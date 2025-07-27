// frontend/components/dashboard.tsx

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { TrendingUp, TrendingDown, Users, BarChart3, Wallet, DollarSign } from 'lucide-react'

interface DashboardMetrics {
  num_accounts: number
  total_equity: number
  num_active: number
  num_demo: number
  total_positions: number
  total_pnl: number
  max_loss_limit: number
  last_updated?: string | null
}

export function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    fetch('http://localhost:5000/api/dashboard-metrics')
      .then(res => res.json())
      .then(data => {
        setMetrics(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  if (isLoading || !metrics) {
    return (
      <div className="p-8">
        <div className="text-lg text-brand-primary mb-2">Loading dashboard...</div>
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse border-2 border-muted">
              <CardContent className="py-8 px-6">
                <div className="h-8 bg-muted rounded mb-4 w-3/5"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-primary mb-2 tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground text-sm">
          Real-time snapshot of your TopstepX accounts & strategy status.
        </p>
        {metrics.last_updated && (
          <div className="text-xs mt-2 text-muted-foreground">
            Last account sync: {metrics.last_updated}
          </div>
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        <Card className="border-brand-primary/20 shadow-xl hover:shadow-2xl transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-primary" /> Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.num_accounts}</div>
            <div className="text-xs text-muted-foreground">Total Accounts</div>
            <div className="flex mt-2 gap-3">
              <span className="text-success font-semibold">{metrics.num_active} Live</span>
              <span className="text-muted-foreground">{metrics.num_demo} Demo</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-brand-primary/20 shadow-xl hover:shadow-2xl transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-brand-primary" /> Equity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${metrics.total_equity.toLocaleString(undefined, {maximumFractionDigits: 2})}
            </div>
            <div className="text-xs text-muted-foreground">Aggregate Account Equity</div>
          </CardContent>
        </Card>

        <Card className="border-brand-primary/20 shadow-xl hover:shadow-2xl transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-brand-primary" /> Daily P&L
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${metrics.total_pnl >= 0 ? 'text-success' : 'text-destructive'} flex items-center gap-2`}>
              {metrics.total_pnl >= 0 ? <TrendingUp /> : <TrendingDown />}
              ${metrics.total_pnl.toLocaleString(undefined, {maximumFractionDigits: 2})}
            </div>
            <div className="text-xs text-muted-foreground">Today's Combined P&L</div>
          </CardContent>
        </Card>

        <Card className="border-brand-primary/20 shadow-xl hover:shadow-2xl transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-brand-primary" /> Positions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.total_positions}</div>
            <div className="text-xs text-muted-foreground">Total Open Positions</div>
            <div className="mt-1 text-warning font-semibold">
              Max Loss Limit: ${metrics.max_loss_limit.toLocaleString(undefined, {maximumFractionDigits: 2})}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
