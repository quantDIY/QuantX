// components/accounts.tsx
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { RefreshCw, AlertTriangle, TrendingUp, TrendingDown, Users } from 'lucide-react'
import io from 'socket.io-client'

interface Account {
  id: string | number
  name?: string // from backend
  number?: string // not all backends provide this
  nickname?: string
  balance: number
  dailyPnL?: number
  maxLossLimit?: number
  positions?: number
  status?: 'active' | 'demo' | 'disabled' | string
  canTrade?: boolean
}

const socket = io('http://localhost:5000') // adjust if needed

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

  // If you want to support manual reload (triggers server to refresh data)
  const handleManualRefresh = () => {
    setIsLoading(true)
    socket.emit('refresh_accounts')
  }

  const handleFlattenAccount = async (accountId: string | number) => {
    // Emits a "flatten" event to backend. Backend should listen & process.
    socket.emit('flatten_account', { accountId })
  }

  const formatCurrency = (amount?: number) => {
    if (typeof amount !== 'number') return '--'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
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
        return <Badge variant="secondary">Practice</Badge>
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
            <h1 className="text-2xl text-brand-primary">Accounts snapshot</h1>
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-brand-primary">Accounts snapshot</h1>
          <p className="text-muted-foreground mt-1">
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

      {/* Account Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <Card key={account.id} className="border-2 border-brand-primary/10 hover:border-brand-primary/20 transition-colors">
            <CardHeader className="space-y-0 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  #{account.name || account.number || account.id}
                  {account.nickname ? ` • ${account.nickname}` : ''}
                </CardTitle>
                {getStatusBadge(account.status, account.canTrade)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Account Balance</div>
                <div className="text-xl font-semibold">
                  {formatCurrency(account.balance)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Daily P&L</div>
                <div className={cn("text-lg font-semibold flex items-center gap-1", getPnLColor(account.dailyPnL))}>
                  {getPnLIcon(account.dailyPnL)}
                  {formatCurrency(account.dailyPnL)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Maximum Loss Limit</div>
                <div className="text-lg font-semibold text-warning">
                  {formatCurrency(account.maxLossLimit)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Current Positions</div>
                <div className="text-lg font-semibold">
                  {account.positions || 0} {account.positions === 1 ? 'position' : 'positions'}
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
                Flatten, Cancel Open Orders and Disconnect Active Strategies
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Empty State */}
      {accounts.length === 0 && !isLoading && (
        <Card className="border-2 border-dashed border-muted">
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
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
