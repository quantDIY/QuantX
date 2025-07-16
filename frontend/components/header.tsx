// frontend/components/header.tsx

import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Sun, Moon, LogOut, Wifi } from 'lucide-react'
import { useTheme } from './theme-provider'

interface HeaderProps {
  onSignOut: () => void
  username: string
}

export function Header({ onSignOut, username }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <header className="border-b bg-card border-border">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Branding and status */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gradient">QuantX</h1>
          <Badge variant="secondary" className="text-xs">
            <Wifi className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </div>

        {/* Right side - User session */}
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            Welcome, <span className="text-foreground font-medium">{username}</span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onSignOut}
            className="h-9 w-9 text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
