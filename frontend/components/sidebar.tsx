// frontend/components/sidebar.tsx

import { useState } from 'react'
import {
  Users, Activity, Wrench, BarChart3, TrendingUp, Database, Settings,
  BookOpenCheck, FlaskConical, BarChartHorizontal, Brain, BookOpen, TerminalSquare, Menu, X
} from 'lucide-react'
import { Button } from './ui/button'
import { cn } from './ui/utils'

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChartHorizontal },
  { id: 'accounts', label: 'Accounts', icon: Users },
  { id: 'data', label: 'Data', icon: Database },
  { id: 'indicators', label: 'Indicators', icon: TrendingUp },
  { id: 'strategy-builder', label: 'Strategy Builder', icon: Wrench },
  { id: 'active-strategies', label: 'Active Strategies', icon: Activity },
  { id: 'backtesting', label: 'Backtesting', icon: BarChart3 },
  { id: 'ml-lab', label: 'ML Lab', icon: Brain },
  { id: 'analytics', label: 'Analytics & Reports', icon: FlaskConical },
  { id: 'visualization', label: 'Visualization Studio', icon: BarChartHorizontal },
  { id: 'notebook', label: 'Research Notebook', icon: BookOpen },
  { id: 'openbb', label: 'OpenBB Terminal', icon: TerminalSquare },
  { id: 'design-system', label: 'Design System', icon: BookOpenCheck },
  { id: 'settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "quantx-sidebar-unique border-r border-sidebar-border transition-all duration-300 flex-none",
        isCollapsed && "quantx-sidebar-collapsed"
      )}
    >
      {/* Collapse/Expand button */}
      <nav className="p-4 space-y-2">
        <div className={cn("mb-4", isCollapsed ? "flex justify-center" : "flex justify-start")}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 rounded-md border bg-background shadow-sm hover:bg-accent"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
        {/* Navigation Items */}
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
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className={cn("h-4 w-4", isActive && "text-sidebar-primary")} />
              {!isCollapsed && <span className="truncate">{label}</span>}
            </Button>
          )
        })}
      </nav>

      {/* Status widget */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4 text-xs text-sidebar-foreground/70">
          <div className="rounded-lg bg-sidebar-accent/30 p-3 shadow-md">
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
