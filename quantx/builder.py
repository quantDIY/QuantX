# quantx/builder.py

import os
import json
from typing import Dict, Any, Optional, List
from rich.console import Console
from rich.prompt import Prompt, Confirm
from rich.table import Table
from rich.panel import Panel
from rich import print as rprint

console = Console()

class StrategyQuestion:
    """Represents a single strategy configuration question"""
    
    def __init__(self, key: str, question: str, required: bool = False, 
                 default: Optional[str] = None, options: Optional[List[str]] = None,
                 help_text: Optional[str] = None, depends_on: Optional[Dict] = None):
        self.key = key
        self.question = question
        self.required = required
        self.default = default
        self.options = options
        self.help_text = help_text
        self.depends_on = depends_on
    
    def should_ask(self, config: Dict[str, Any]) -> bool:
        """Check if this question should be asked based on previous answers"""
        if not self.depends_on:
            return True
        
        for key, expected_value in self.depends_on.items():
            if key not in config:
                return False
            
            if expected_value == "not none" and config[key] == "none":
                return False
            elif expected_value != "not none" and config[key] != expected_value:
                return False
        
        return True
    
    def ask(self) -> str:
        """Ask the question and return the answer"""
        prompt_text = self.question
        
        if self.help_text:
            prompt_text += f"\n[dim]{self.help_text}[/dim]"
        
        if not self.required:
            prompt_text += " [dim](or 'skip')[/dim]"
        
        if self.options:
            prompt_text += f"\nOptions: {', '.join(self.options)}"
        
        if self.default:
            prompt_text += f" [dim](default: {self.default})[/dim]"
        
        while True:
            answer = Prompt.ask(prompt_text)
            
            # Handle skip for non-required questions
            if not self.required and answer.lower() == 'skip':
                return self.default or "none"
            
            # Use default if no answer provided
            if not answer and self.default:
                return self.default
            
            # Validate required questions
            if self.required and not answer:
                console.print("[red]This question is required.[/red]")
                continue
            
            # Validate options if provided
            if self.options and answer and answer not in self.options:
                console.print(f"[red]Please choose from: {', '.join(self.options)}[/red]")
                continue
            
            return answer or "none"

# Essential questions for strategy building
ESSENTIAL_QUESTIONS = [
    StrategyQuestion(
        key="strategy_name",
        question="What do you want to call this strategy?",
        required=True,
        help_text="Use alphanumeric characters and underscores only"
    ),
    StrategyQuestion(
        key="component_type", 
        question="What type of strategy component are you building?",
        required=True,
        options=[
            "entry_strategy", "exit_strategy", "stop_strategy", "profit_target",
            "position_sizing", "risk_management", "market_filter", "time_filter",
            "complete_strategy", "custom"
        ],
        help_text="This determines the template and scaffolding we generate"
    ),
    StrategyQuestion(
        key="contract",
        question="Which contract? (ES, NQ, YM, RTY, CL, GC, etc.)",
        required=True,
        default="ES",
        help_text="Enter the symbol for the futures contract you want to trade"
    ),
    StrategyQuestion(
        key="timeframe",
        question="Bar size/timeframe?",
        required=True,
        options=["1m", "2m", "3m", "5m", "10m", "15m", "30m", "1h", "2h", "4h", "1d"],
        default="5m",
        help_text="The timeframe for your strategy execution"
    ),
    StrategyQuestion(
        key="indicators",
        question="Which indicators do you need? (comma-separated)",
        required=False,
        default="none",
        help_text="Available: RSI, MACD, EMA, SMA, ATR, Bollinger, Stochastic, etc. Skip if using pure price action"
    ),
    StrategyQuestion(
        key="entry_trigger",
        question="Entry trigger type?",
        required=True,
        options=["breakout", "crossover", "pullback", "momentum", "mean_reversion", "pattern", "custom"],
        help_text="What causes your strategy to enter a position?"
    ),
    StrategyQuestion(
        key="entry_order_type",
        question="Entry order type?",
        required=True,
        options=["market", "limit", "stop", "stop_limit"],
        default="market",
        help_text="How should orders be placed when entering positions?"
    ),
    StrategyQuestion(
        key="execution_confirmation",
        question="Require execution confirmation?",
        required=False,
        options=["yes", "no"],
        default="no",
        help_text="Whether to wait for order fill confirmation before proceeding"
    ),
    StrategyQuestion(
        key="stop_type",
        question="Stop loss type?",
        required=False,
        options=["none", "fixed_points", "percentage", "atr_based", "trailing", "custom"],
        default="none",
        help_text="Risk management - highly recommended but not required"
    ),
    StrategyQuestion(
        key="stop_implementation",
        question="Stop loss value/implementation?",
        required=False,
        depends_on={"stop_type": "not none"},
        help_text="How many points, percentage, ATR multiples, etc."
    ),
    StrategyQuestion(
        key="exit_type",
        question="Exit strategy type?",
        required=False,
        options=["none", "profit_target", "opposite_signal", "time_based", "custom"],
        default="none",
        help_text="Skip if only using stops or manual exits"
    ),
    StrategyQuestion(
        key="exit_implementation",
        question="Exit implementation details?",
        required=False,
        depends_on={"exit_type": "not none"},
        help_text="Target points, time limit, etc."
    )
]

def display_welcome():
    """Display welcome message and instructions"""
    welcome_panel = Panel(
        "[bold cyan]QuantX Strategy Builder[/bold cyan]\n\n"
        "Build modular trading strategies with ease!\n\n"
        "[dim]• Answer essential questions to generate strategy scaffolding[/dim]\n"
        "[dim]• Type 'skip' for any non-required question[/dim]\n"
        "[dim]• All generated code will be ready to run with QuantX[/dim]",
        title="Welcome",
        border_style="cyan"
    )
    console.print(welcome_panel)
    console.print()

def build_strategy_interactively() -> Dict[str, Any]:
    """Main interactive strategy builder function"""
    display_welcome()
    
    config = {}
    
    # Ask all essential questions
    for question in ESSENTIAL_QUESTIONS:
        if question.should_ask(config):
            console.print(f"\n[bold blue]Question {len([k for k in config.keys() if k != 'help']) + 1}:[/bold blue]")
            answer = question.ask()
            config[question.key] = answer
            
            # Show confirmation for important answers
            if question.required or answer != "none":
                console.print(f"[green]✓[/green] [dim]{question.key}:[/dim] {answer}")
    
    # Display configuration summary
    display_config_summary(config)
    
    # Confirm before generating
    if not Confirm.ask("\n[bold]Generate strategy template?[/bold]"):
        console.print("[yellow]Strategy generation cancelled.[/yellow]")
        return {}
    
    return config

def display_config_summary(config: Dict[str, Any]):
    """Display a summary of the collected configuration"""
    console.print("\n" + "="*60)
    console.print("[bold cyan]Strategy Configuration Summary[/bold cyan]")
    console.print("="*60)
    
    table = Table(show_header=True, header_style="bold cyan")
    table.add_column("Setting", style="dim")
    table.add_column("Value", style="bold")
    
    for key, value in config.items():
        if value and value != "none":
            # Format key for display
            display_key = key.replace("_", " ").title()
            table.add_row(display_key, str(value))
    
    console.print(table)

def save_strategy_config(config: Dict[str, Any], output_dir: str = "user_components") -> str:
    """Save strategy configuration to JSON file"""
    os.makedirs(output_dir, exist_ok=True)
    
    strategy_name = config.get("strategy_name", "untitled_strategy")
    component_type = config.get("component_type", "custom")
    
    # Create component type subdirectory
    component_dir = os.path.join(output_dir, f"{component_type}s")
    os.makedirs(component_dir, exist_ok=True)
    
    # Save config file
    config_path = os.path.join(component_dir, f"{strategy_name}_config.json")
    with open(config_path, 'w') as f:
        json.dump(config, f, indent=2)
    
    return config_path

def load_available_indicators():
    """Load available indicators from TA-Lib and QuantLib"""
    # This will be implemented when we integrate with the actual libraries
    return [
        "RSI", "MACD", "EMA", "SMA", "WMA", "ATR", "Bollinger", "Stochastic", 
        "CCI", "Williams_R", "ADX", "VWAP", "Volume", "OBV", "Momentum", "ROC"
    ]

if __name__ == "__main__":
    # Test the builder
    config = build_strategy_interactively()
    if config:
        config_path = save_strategy_config(config)
        console.print(f"\n[green]Configuration saved to: {config_path}[/green]")
