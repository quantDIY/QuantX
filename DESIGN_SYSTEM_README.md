# QuantX Design System Integration

## Overview

QuantX includes an integrated design system that allows automatic synchronization with Figma design files. This ensures visual consistency between design and development.

## Features

- 🎨 **Figma Integration**: Direct connection to Figma files
- 🔄 **Automatic Sync**: Pull design tokens (colors, typography) from Figma
- 📱 **Live Preview**: See design tokens with visual previews
- ⚡ **Code Generation**: Automatic CSS variables and Tailwind config
- 💾 **Backup System**: Automatic backup before CSS updates

## Setup

### 1. Configure Figma Access

1. Copy the example configuration:
   ```bash
   cp .design_env.example .design_env
   ```

2. Get your Figma Personal Access Token:
   - Go to [Figma Developer Settings](https://figma.com/developers/api#access-tokens)
   - Generate a new personal access token

3. Find your Figma file key:
   - Open your Figma file
   - Copy the file key from the URL: `https://figma.com/file/[FILE_KEY]/Your-Design-System`

4. Edit `.design_env` with your actual values:
   ```
   FIGMA_TOKEN=your_figma_personal_access_token
   FIGMA_FILE_KEY=your_figma_file_key
   FIGMA_PAGE_NAME=Design System
   ```

### 2. Access the Design System

1. Start your QuantX application
2. Navigate to "Design System" in the sidebar
3. Configure your Figma connection in the interface
4. Click "Sync from Figma" to pull your design tokens

## Usage

### Design Token Sync
- Colors and typography are automatically extracted from your Figma file
- Tokens are converted to CSS custom properties
- Your `globals.css` file is updated automatically
- Backups are created before each update

### Code Generation
- **CSS Variables**: Generated automatically for use in stylesheets
- **Tailwind Config**: Extension configuration for Tailwind CSS
- **JSON Export**: Download tokens for use in other tools

## File Structure

```
backend/
├── design_mcp_server.py     # Figma API integration
└── app.py                   # Design system endpoints

frontend/components/
├── design-system.tsx        # Main design system interface
└── figma/
    └── FigmaDesignSystem.tsx # Design token display components
```

## Security

- All sensitive data (tokens, keys) are stored locally
- Configuration files are excluded from version control
- No credentials are ever committed to the repository

## API Endpoints

- `GET /api/design-tokens` - Retrieve current design tokens
- `POST /api/design-tokens/sync-figma` - Sync tokens from Figma
- `GET /api/design-tokens/generate-css` - Generate CSS from tokens
- `POST /api/design-system/figma-config` - Save Figma configuration
- `GET /api/design-system/figma-config` - Get current configuration

## Contributing

When adding new design token categories or features:

1. Update the token extraction logic in `design_mcp_server.py`
2. Add corresponding UI components in the frontend
3. Update the API endpoints as needed
4. Test with your own Figma file setup
