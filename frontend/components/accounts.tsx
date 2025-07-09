// components/accounts.tsx
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Shield,
  Activity,
  AlertTriangle
} from 'lucide-react'

interface Position {
  symbol: string
  quantity: number
  side: 'long' | 'short'
  unrealizedPnL: number
}

interface Account {
  id: string
  accountNumber: string
  nickname: string
  name: string
  balance: number
  dailyPnL: number
  maxLossLimit: number
  currentLossFromMax: number
  positions: Position[]
  status: 'active' | 'evaluation' | 'practice'
}

export function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await fetch('/api/accounts', { method: 'POST' })
        const result = await res.json()
        const enrichedAccounts = result.accounts.map((account: any, index: number) => ({
          id: `TST-${index + 1}`,
          accountNumber: account.accountNumber,
          nickname: account.nickname || '—',
          name: account.accountName || 'TopStep Account',
          balance: account.balance,
          dailyPnL: account.dailyPnl,
          maxLossLimit: account.maxLossLimit || 0,
          currentLossFromMax: account.lossFromMax || 0,
          positions: [], // optional: integrate with open positions API
          status: account.accountStatus?.toLowerCase() || 'practice'
        }))
        setAccounts(enrichedAccounts)
      } catch (error) {
        console.error('Failed to load accounts', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAccounts()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-white'
      case 'evaluation': return 'bg-warning text-white'
      case 'practice': return 'bg-info text-white'
      default: return 'bg-secondary'
    }
  }

  const getPnLColor = (pnl: number) => {
    if (pnl > 0) return 'text-success'
    if (pnl < 0) return 'text-destructive'
    return 'text-muted-foreground'
  }

  const handleFlattenAccount = (accountId: string) => {
    alert(`Account ${accountId}: Flatten positions, cancel orders, and disconnect strategies initiated.`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading accounts...</div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-brand-primary">Accounts snapshot</h1>
        <div className="flex items-center gap-2 text-sm text-success">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span>{accounts.length} accounts connected</span>
        </div>
      </div>

      <div className="grid gap-4">
        {accounts.map((account) => (
          <Card key={account.id} className="border-2 border-brand-primary/10 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <CardTitle className="text-lg">{account.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>#{account.accountNumber}</span>
                      <span>•</span>
                      <span>{account.nickname}</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(account.status)}>
                    {account.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">ID: {account.id}</div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>Account Balance</span>
                  </div>
                  <div className="text-lg font-semibold">
                    ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {account.dailyPnL >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span>Daily P&L</span>
                  </div>
                  <div className={`text-lg font-semibold ${getPnLColor(account.dailyPnL)}`}>
                    {account.dailyPnL >= 0 ? '+' : ''}${account.dailyPnL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Max Loss Limit</span>
                  </div>
                  <div className="text-lg font-semibold">
                    ${account.maxLossLimit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-destructive">
                    Used: ${account.currentLossFromMax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Activity className="h-4 w-4" />
                    <span>Positions</span>
                  </div>
                  <div className="text-lg font-semibold">
                    {account.positions.length}
                  </div>
                </div>
              </div>

              {account.positions.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Current Positions</h4>
                    <div className="space-y-1">
                      {account.positions.map((position, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{position.symbol}</span>
                            <Badge variant={position.side === 'long' ? 'default' : 'secondary'}>
                              {position.quantity} {position.side}
                            </Badge>
                          </div>
                          <div className={`font-medium ${getPnLColor(position.unrealizedPnL)}`}>
                            {position.unrealizedPnL >= 0 ? '+' : ''}${position.unrealizedPnL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Emergency actions will close all positions and stop strategies</span>
                </div>
                <Button variant="destructive" onClick={() => handleFlattenAccount(account.id)} className="ml-4">
                  Flatten, Cancel Open Orders and Disconnect Active Strategies
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/30">
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-semibold text-brand-primary">
                ${accounts.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-muted-foreground">Total Balance</div>
            </div>
            <div>
              <div className={`text-2xl font-semibold ${getPnLColor(accounts.reduce((sum, acc) => sum + acc.dailyPnL, 0))}`}>
                ${accounts.reduce((sum, acc) => sum + acc.dailyPnL, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-muted-foreground">Total Daily P&L</div>
            </div>
            <div>
              <div className="text-2xl font-semibold">
                {accounts.reduce((sum, acc) => sum + acc.positions.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Positions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
