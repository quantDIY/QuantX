import { useState, useEffect } from 'react'
import { ThemeProvider } from './components/theme-provider'
import { Header } from './components/header'
import { Sidebar } from './components/sidebar'
import { Accounts } from './components/accounts'
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
  const [activeView, setActiveView] = useState('accounts')

  // Check for stored credentials on app load
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

  const handleSignIn = (username: string, apiKey: string, rememberMe: boolean) => {
    const userData = {
      username: username,
      apiKey: apiKey,
      rememberMe: rememberMe
    }
    
    setUser(userData)
    
    // Store credentials if remember me is selected
    if (rememberMe) {
      localStorage.setItem('quantx-user', JSON.stringify(userData))
    }
  }

  const handleSignOut = () => {
    setUser(null)
    setActiveView('accounts') // Reset to default view
    localStorage.removeItem('quantx-user')
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'accounts':
        return <Accounts />
      case 'active-strategies':
        return (
          <PlaceholderView
            title="Active Strategies"
            description="Monitor and manage your running trading strategies"
          />
        )
      case 'strategy-builder':
        return (
          <PlaceholderView
            title="Strategy Builder"
            description="Create, edit, and optimize your trading strategies"
          />
        )
      case 'backtesting':
        return (
          <PlaceholderView
            title="Backtesting"
            description="Test your strategies against historical market data"
          />
        )
      case 'indicators':
        return (
          <PlaceholderView
            title="Indicators"
            description="Technical analysis tools and custom indicators"
          />
        )
      case 'data':
        return (
          <PlaceholderView
            title="Data"
            description="Market data feeds, historical data, and analytics"
          />
        )
      case 'settings':
        return (
          <PlaceholderView
            title="Settings"
            description="Configure your QuantX application preferences"
          />
        )
      default:
        return <Accounts />
    }
  }

  // Show loading state while checking for stored credentials
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
        <SignIn onSignIn={handleSignIn} isLoading={false} />
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
