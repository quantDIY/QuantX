// frontend/App.tsx

import { useState, useEffect } from 'react'
import { ThemeProvider } from './components/theme-provider'
import { Header } from './components/header'
import { Sidebar } from './components/sidebar'
import { Accounts } from './components/accounts'
import { Dashboard } from './components/dashboard'
import { PlaceholderView } from './components/placeholder-view'
import { SignIn } from './components/signin'

interface User {
  username: string
  apiKey: string
  rememberMe: boolean
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeView, setActiveView] = useState('dashboard')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('quantx-user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        if (userData.rememberMe) {
          setUser(userData)
        } else {
          localStorage.removeItem('quantx-user')
        }
      } catch (error) {
        localStorage.removeItem('quantx-user')
      }
    }
    setIsLoading(false)
  }, [])

  const handleSignIn = async (username: string, apiKey: string, rememberMe: boolean) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('http://localhost:5000/api/save-creds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ USERNAME: username, API_KEY: apiKey }),
      })
      const data = await res.json()
      if (data.status === 'ok') {
        const userData = { username, apiKey, rememberMe }
        setUser(userData)
        if (rememberMe) {
          localStorage.setItem('quantx-user', JSON.stringify(userData))
        }
      } else {
        setError(data.error || 'Auth failed')
      }
    } catch (e: any) {
      setError('Connection error: ' + e.message)
    }
    setIsLoading(false)
  }

  const handleSignOut = () => {
    setUser(null)
    setActiveView('dashboard')
    localStorage.removeItem('quantx-user')
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />
      case 'accounts':
        return <Accounts />
      case 'active-strategies':
        return <PlaceholderView title="Active Strategies" description="Monitor and manage your running trading strategies" />
      case 'strategy-builder':
        return <PlaceholderView title="Strategy Builder" description="Create, edit, and optimize your trading strategies" />
      case 'backtesting':
        return <PlaceholderView title="Backtesting" description="Test your strategies against historical market data" />
      case 'indicators':
        return <PlaceholderView title="Indicators" description="Technical analysis tools and custom indicators" />
      case 'data':
        return <PlaceholderView title="Data" description="Market data feeds, historical data, and analytics" />
      case 'settings':
        return <PlaceholderView title="Settings" description="Configure your QuantX application preferences" />
      default:
        return <Dashboard />
    }
  }

  if (isLoading) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="quantx-ui-theme">
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading QuantX...</p>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="quantx-ui-theme">
      {!user ? (
        <SignIn onSignIn={handleSignIn} isLoading={isLoading} error={error || undefined} />
      ) : (
        <div className="min-h-screen bg-background">
          <Header onSignOut={handleSignOut} username={user.username} />
          <div className="flex">
            <Sidebar activeView={activeView} onViewChange={setActiveView} />
            <main className="flex-1 overflow-hidden">
              {renderActiveView()}
            </main>
          </div>
        </div>
      )}
    </ThemeProvider>
  )
}
