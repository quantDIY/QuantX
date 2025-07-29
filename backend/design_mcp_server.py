# backend/design_mcp_server.py

"""
MCP Server for QuantX Design System Management
Integrates with Figma API and provides design token synchronization
"""

import json
import asyncio
import httpx
import os
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from datetime import datetime

def load_design_env():
    """Load design system environment variables from .design_env file"""
    design_env_path = os.path.join(os.path.dirname(__file__), '../.design_env')
    env_vars = {}
    
    if os.path.exists(design_env_path):
        with open(design_env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key.strip()] = value.strip()
    
    return env_vars

@dataclass
class DesignToken:
    name: str
    value: str
    category: str
    figma_node_id: Optional[str] = None
    last_synced: Optional[datetime] = None
    description: Optional[str] = None

class QuantXDesignMCPServer:
    def __init__(self, figma_token: str = None):
        self.figma_token = figma_token
        self.base_url = "https://api.figma.com/v1"
        self.design_tokens: List[DesignToken] = []
        self.css_variables: Dict[str, str] = {}
        
    async def fetch_figma_file(self, file_key: str) -> Dict[str, Any]:
        """Fetch Figma file data"""
        if not self.figma_token:
            raise ValueError("Figma token not configured")
            
        headers = {"X-Figma-Token": self.figma_token}
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/files/{file_key}",
                headers=headers
            )
            response.raise_for_status()
            return response.json()
    
    async def extract_design_tokens_from_figma(self, file_key: str, page_name: str = "Design System") -> List[DesignToken]:
        """Extract design tokens from a Figma file"""
        file_data = await self.fetch_figma_file(file_key)
        tokens = []
        
        # Find the design system page
        design_page = None
        for page in file_data.get("document", {}).get("children", []):
            if page.get("name") == page_name:
                design_page = page
                break
        
        if not design_page:
            return tokens
        
        # Extract color tokens
        color_tokens = self._extract_color_tokens(design_page)
        tokens.extend(color_tokens)
        
        # Extract typography tokens
        typography_tokens = self._extract_typography_tokens(design_page)
        tokens.extend(typography_tokens)
        
        self.design_tokens = tokens
        return tokens
    
    def _extract_color_tokens(self, node: Dict[str, Any]) -> List[DesignToken]:
        """Extract color tokens from Figma nodes"""
        tokens = []
        
        def traverse_node(current_node):
            # Look for color frames/rectangles
            if current_node.get("type") == "RECTANGLE" and "fills" in current_node:
                fills = current_node.get("fills", [])
                if fills and fills[0].get("type") == "SOLID":
                    color = fills[0].get("color", {})
                    # Convert RGB to hex
                    r = int(color.get("r", 0) * 255)
                    g = int(color.get("g", 0) * 255)
                    b = int(color.get("b", 0) * 255)
                    hex_color = f"#{r:02x}{g:02x}{b:02x}"
                    
                    token = DesignToken(
                        name=current_node.get("name", "unnamed"),
                        value=hex_color,
                        category="color",
                        figma_node_id=current_node.get("id"),
                        last_synced=datetime.now()
                    )
                    tokens.append(token)
            
            # Recursively traverse children
            for child in current_node.get("children", []):
                traverse_node(child)
        
        traverse_node(node)
        return tokens
    
    def _extract_typography_tokens(self, node: Dict[str, Any]) -> List[DesignToken]:
        """Extract typography tokens from Figma nodes"""
        tokens = []
        
        def traverse_node(current_node):
            if current_node.get("type") == "TEXT":
                style = current_node.get("style", {})
                font_size = style.get("fontSize", 16)
                
                token = DesignToken(
                    name=current_node.get("name", "unnamed"),
                    value=f"{font_size}px",
                    category="typography",
                    figma_node_id=current_node.get("id"),
                    last_synced=datetime.now()
                )
                tokens.append(token)
            
            for child in current_node.get("children", []):
                traverse_node(child)
        
        traverse_node(node)
        return tokens
    
    def generate_css_variables(self) -> str:
        """Generate CSS variables from design tokens"""
        css_vars = []
        css_vars.append(":root {")
        
        # Group tokens by category
        color_tokens = [t for t in self.design_tokens if t.category == "color"]
        typography_tokens = [t for t in self.design_tokens if t.category == "typography"]
        
        # Generate color variables
        if color_tokens:
            css_vars.append("  /* Colors from Figma */")
            for token in color_tokens:
                var_name = f"--{token.name.lower().replace(' ', '-')}"
                css_vars.append(f"  {var_name}: {token.value};")
        
        # Generate typography variables
        if typography_tokens:
            css_vars.append("  /* Typography from Figma */")
            for token in typography_tokens:
                var_name = f"--font-size-{token.name.lower().replace(' ', '-')}"
                css_vars.append(f"  {var_name}: {token.value};")
        
        css_vars.append("}")
        return "\n".join(css_vars)
    
    def generate_tailwind_config_extension(self) -> Dict[str, Any]:
        """Generate Tailwind config extension from design tokens"""
        config = {
            "colors": {},
            "fontSize": {},
            "spacing": {}
        }
        
        for token in self.design_tokens:
            if token.category == "color":
                # Convert token name to valid Tailwind key
                key = token.name.lower().replace(" ", "-").replace("_", "-")
                config["colors"][key] = f"var(--{key})"
            elif token.category == "typography":
                key = token.name.lower().replace(" ", "-").replace("_", "-")
                config["fontSize"][key] = token.value
        
        return config
    
    async def sync_with_quantx_globals(self, globals_css_path: str):
        """Sync design tokens with QuantX globals.css file"""
        try:
            # Read current globals.css
            with open(globals_css_path, 'r') as f:
                current_css = f.read()
            
            # Generate new CSS variables
            new_css_vars = self.generate_css_variables()
            
            # Create backup
            backup_path = f"{globals_css_path}.backup.{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            with open(backup_path, 'w') as f:
                f.write(current_css)
            
            # Insert/update Figma tokens section
            figma_section_start = "/* Figma Design Tokens - Auto Generated */"
            figma_section_end = "/* End Figma Design Tokens */"
            
            if figma_section_start in current_css:
                # Replace existing section
                start_idx = current_css.find(figma_section_start)
                end_idx = current_css.find(figma_section_end) + len(figma_section_end)
                
                updated_css = (
                    current_css[:start_idx] +
                    f"{figma_section_start}\n{new_css_vars}\n{figma_section_end}" +
                    current_css[end_idx:]
                )
            else:
                # Append new section
                updated_css = f"{current_css}\n\n{figma_section_start}\n{new_css_vars}\n{figma_section_end}\n"
            
            # Write updated CSS
            with open(globals_css_path, 'w') as f:
                f.write(updated_css)
            
            return {
                "status": "success",
                "message": f"Synced {len(self.design_tokens)} design tokens",
                "backup_path": backup_path,
                "tokens_count": len(self.design_tokens)
            }
            
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }
    
    def export_tokens_json(self) -> str:
        """Export design tokens as JSON"""
        tokens_data = [asdict(token) for token in self.design_tokens]
        return json.dumps(tokens_data, indent=2, default=str)

# Example usage for QuantX
async def main():
    # Initialize the MCP server
    design_server = QuantXDesignMCPServer(figma_token="your-figma-token")
    
    # Extract tokens from Figma file
    figma_file_key = "your-figma-file-key"
    tokens = await design_server.extract_design_tokens_from_figma(figma_file_key)
    
    print(f"Extracted {len(tokens)} design tokens from Figma")
    
    # Sync with QuantX globals.css
    result = await design_server.sync_with_quantx_globals("../frontend/styles/globals.css")
    print(f"Sync result: {result}")
    
    # Generate Tailwind config
    tailwind_extension = design_server.generate_tailwind_config_extension()
    print("Tailwind config extension:", json.dumps(tailwind_extension, indent=2))

if __name__ == "__main__":
    asyncio.run(main())
