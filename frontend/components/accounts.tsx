// components/accounts.tsx
import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { RefreshCw, AlertTriangle, TrendingUp, TrendingDown, Users } from 'lucide-react'
import io from 'socket.io-client'

interface Account {
  id: string | number
  name?: string
  number?: string
  nickname?: string
  balance: number
  dailyPnL?: number
  maxLossLimit?: number
  positions?: number
  status?: 'active' | 'demo' | 'disabled' | string
  canTrade?: boolean
}

const socket = io('http://localhost:5000')

export function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    setIsLoading(true)
    socket.emit('subscribe_accounts')
    socket.on('accounts_update', (data) => {
      setAccounts(Array.isArray(data) ? data : [])
      setLastUpdated(new Date())
      setIsLoading(false)
    })
    return () => { socket.off('accounts_update') }
  }, [])

  const handleManualRefresh = () => {
    setIsLoading(true)
    socket.emit('refresh_accounts')
  }

  const handleFlattenAccount = async (accountId: string | number) => {
    socket.emit('flatten_account', { accountId })
  }

  // --- Metrics for the mini stats bar at top
  const stats = useMemo(() => {
    let totalEquity = 0, active = 0, demo = 0, disabled = 0, totalPnL = 0, openPositions = 0
    accounts.forEach(a => {
      totalEquity += a.balance || 0
      totalPnL += a.dailyPnL || 0
      openPositions += a.positions || 0
      if (a.status === 'active') active += 1
      else if (a.status === 'demo') demo += 1
      else if (a.status === 'disabled' || a.canTrade === false) disabled += 1
    })
    return { totalEquity, active, demo, disabled, totalPnL, openPositions }
  }, [accounts])

  const formatCurrency = (amount?: number) => {
    if (typeof amount !== 'number') return '--'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const getPnLColor = (pnl?: number) => {
    if (pnl === undefined) return 'text-muted-foreground'
    if (pnl > 0) return 'text-success'
    if (pnl < 0) return 'text-destructive'
    return 'text-muted-foreground'
  }

  const getPnLIcon = (pnl?: number) => {
    if (pnl === undefined) return null
    if (pnl > 0) return <TrendingUp className="h-4 w-4" />
    if (pnl < 0) return <TrendingDown className="h-4 w-4" />
    return null
  }

  const getStatusBadge = (status?: string, canTrade?: boolean) => {
    if (canTrade === false) return <Badge variant="destructive">Disabled</Badge>
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-success text-white">Live</Badge>
      case 'demo':
        return <Badge variant="secondary">Demo</Badge>
      case 'disabled':
        return <Badge variant="destructive">Disabled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-brand-primary">Accounts</h1>
            <p className="text-muted-foreground mt-1">Loading account data...</p>
          </div>
          <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-2 border-muted animate-pulse">
              <CardHeader className="space-y-0 pb-4">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header & Stats Bar */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-brand-primary">Accounts</h1>
            <p className="text-muted-foreground text-sm">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <Button 
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>
        {/* Mini-stats summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-4">
          <div className="rounded bg-muted p-3 text-xs text-muted-foreground flex flex-col items-center">
            <div className="font-bold text-lg text-brand-primary">{accounts.length}</div>
            <div>Accounts</div>
          </div>
          <div className="rounded bg-success/10 p-3 text-xs text-success flex flex-col items-center">
            <div className="font-bold text-lg">{stats.active}</div>
            <div>Live</div>
          </div>
          <div className="rounded bg-secondary p-3 text-xs text-secondary-foreground flex flex-col items-center">
            <div className="font-bold text-lg">{stats.demo}</div>
            <div>Demo</div>
          </div>
          <div className="rounded bg-destructive/10 p-3 text-xs text-destructive flex flex-col items-center">
            <div className="font-bold text-lg">{stats.disabled}</div>
            <div>Disabled</div>
          </div>
          <div className="rounded bg-brand-primary/10 p-3 text-xs text-brand-primary flex flex-col items-center">
            <div className="font-bold text-lg">{formatCurrency(stats.totalEquity)}</div>
            <div>Equity</div>
          </div>
          <div className="rounded bg-muted p-3 text-xs text-muted-foreground flex flex-col items-center">
            <div className={`font-bold text-lg ${stats.totalPnL > 0 ? 'text-success' : stats.totalPnL < 0 ? 'text-destructive' : ''}`}>
              {formatCurrency(stats.totalPnL)}
            </div>
            <div>Daily P&L</div>
          </div>
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <Card
            key={account.id}
            className={cn(
              "border-2 shadow-lg hover:shadow-2xl transition-colors",
              account.status === 'active'
                ? "border-success/40"
                : account.status === 'demo'
                  ? "border-secondary"
                  : account.status === 'disabled' || account.canTrade === false
                    ? "border-destructive/40"
                    : "border-muted"
            )}
          >
            <CardHeader className="space-y-0 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex gap-2 items-center">
                  #{account.name || account.number || account.id}
                  {account.nickname && (
                    <span className="ml-1 text-xs px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-lg">
                      {account.nickname}
                    </span>
                  )}
                </CardTitle>
                {getStatusBadge(account.status, account.canTrade)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Balance</div>
                  <div className="text-lg font-semibold">
                    {formatCurrency(account.balance)}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Daily P&L</div>
                  <div className={cn("text-lg font-semibold flex items-center gap-1", getPnLColor(account.dailyPnL))}>
                    {getPnLIcon(account.dailyPnL)}
                    {formatCurrency(account.dailyPnL)}
                  </div>
                </div>
                <div className="space-y-1 col-span-2">
                  <div className="text-xs text-muted-foreground">Max Loss Limit</div>
                  <div className="text-base font-semibold text-warning">
                    {formatCurrency(account.maxLossLimit)}
                  </div>
                </div>
                <div className="space-y-1 col-span-2">
                  <div className="text-xs text-muted-foreground">Current Positions</div>
                  <div className="text-base font-semibold">
                    {account.positions || 0} {account.positions === 1 ? 'position' : 'positions'}
                  </div>
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="w-full mt-4"
                onClick={() => handleFlattenAccount(account.id)}
                disabled={account.positions === 0}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Flatten, Cancel Orders & Disconnect
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {accounts.length === 0 && !isLoading && (
        <Card className="border-2 border-dashed border-muted shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No accounts found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Unable to load account data. Please check your API connection.
            </p>
            <Button onClick={handleManualRefresh} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Helper
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
