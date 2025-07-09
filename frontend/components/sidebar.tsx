// frontend/components/sidebar.tsx

import { useState } from 'react'
import {
  Users,
  Activity,
  Wrench,
  BarChart3,
  TrendingUp,
  Database,
  Settings,
  Menu,
  X
} from 'lucide-react'
import { Button } from './ui/button'
import { cn } from './ui/utils'

const navigationItems = [
  { id: 'accounts', label: 'Accounts', icon: Users },
  { id: 'active-strategies', label: 'Active Strategies', icon: Activity },
  { id: 'strategy-builder', label: 'Strategy Builder', icon: Wrench },
  { id: 'backtesting', label: 'Backtesting', icon: BarChart3 },
  { id: 'indicators', label: 'Indicators', icon: TrendingUp },
  { id: 'data', label: 'Data', icon: Database },
  { id: 'settings', label: 'Settings', icon: Settings }
]

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside className={cn(
      "relative border-r bg-sidebar border-sidebar-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <nav className="p-4 space-y-2">
        <div className={cn("mb-4", isCollapsed ? "flex justify-center" : "flex justify-start")}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 rounded-md border bg-background shadow-sm hover:bg-accent"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        {navigationItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeView === id
          return (
            <Button
              key={id}
              variant="ghost"
              onClick={() => onViewChange(id)}
              className={cn(
                "w-full justify-start gap-3 transition-all text-sm font-medium",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-primary/20"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                isCollapsed && "justify-center px-0"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive && "text-sidebar-primary")} />
              {!isCollapsed && <span className="truncate">{label}</span>}
            </Button>
          )
        })}
      </nav>

      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4 text-xs text-sidebar-foreground/70">
          <div className="rounded-lg bg-sidebar-accent/30 p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span>Connected</span>
            </div>
            <p>Real-time market data active</p>
          </div>
        </div>
      )}
    </aside>
  )
}
