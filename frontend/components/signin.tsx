// components/signin.tsx

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent } from './ui/card'
import { Moon, Sun } from 'lucide-react'
import { Checkbox } from './ui/checkbox'
import { useTheme } from './theme-provider'

interface SignInProps {
  onSignIn: (username: string, apiKey: string, rememberMe: boolean) => void
  isLoading: boolean
  error?: string
}

export function SignIn({ onSignIn, isLoading, error }: SignInProps) {
  const [username, setUsername] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const { theme, setTheme } = useTheme()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSignIn(username, apiKey, rememberMe)
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="h-9 w-9 fixed top-4 right-4 z-50 "
        style={{ right: '1rem', left: 'auto' }}
      >
        {theme === 'light' ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </Button>
      
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-wd-md space-y-6" style={{ maxWidth: '28rem'}}>
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-gradient">QuantX</h1>
            <p className="text-muted-foreground text-lg">
              Enter your TopstepX credentials:
            </p>
          </div>
          <Card className="bg-card text-card-foreground flex flex-col  rounded-xl w-full border-2 border-indigo-500/10 shadow-2xl">
            <CardContent className="[&amp;:last-child]:pb-6 space-y-8 px-10 pb-10" style={{ paddingTop: '2rem', paddingRight: '2rem', paddingBottom: '1rem', paddingLeft: '2rem' }}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3" style={{paddingBottom: '1.5rem'}}>
                  <Label htmlFor="username" style={{paddingBottom: '.35rem'}} className="text-base">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    style={{paddingLeft: '.35rem'}}
                    autoComplete="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-3" style={{paddingBottom: '.5rem'}}>
                  <Label htmlFor="apiKey" style={{paddingBottom: '.35rem'}} className="text-base">API Key</Label>
                  <Input
                    id="apiKey"
                    name="apiKey"
                    type="password"
                    style={{paddingLeft: '.35rem'}} autoComplete="current-password"
                    placeholder="Enter your API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-12 text-base"
                  />
                </div>
                <div className="inline-flex items-center space-x-3 py-2" style={{paddingBottom: '2.5rem'}}>
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                    disabled={isLoading}
                    className="h-5 w-5 border-2 rounded-md appearance-none flex items-center justify-center transition-colors"
                    style={{
                      minWidth: '1.25rem',
                      minHeight: '1.25rem',
                      width: '1.25rem',
                      height: '1.25rem',
                      borderRadius: '0.25rem',
                      boxSizing: 'border-box',
                    }}
                  />
                  <Label
                    style={{paddingLeft: '1rem'}}
                    htmlFor="remember"
                    className="text-base text-muted-foreground cursor-pointer select-none"
                  >
                    Remember me
                  </Label>
                </div>
                {error && (
                  <div className="text-base text-destructive font-medium p-3 bg-destructive/10 rounded-md">
                    {error}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full h-12 text-base bg-brand-gradient hover:opacity-90 transition-opacity mt-6" style={{paddingTop: '.25rem', paddingBottom: '.25rem', marginLeft: '.25rem', marginRight: '.35rem'}}
                  disabled={isLoading || !username.trim() || !apiKey.trim()}
                >
                  {isLoading ? 'Connecting...' : 'Connect'}
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="text-center space-y-3 pt-4">
            <p className="text-sm text-muted-foreground">
              This application connects to TopstepX API services
            </p>
            <p className="text-sm text-muted-foreground">
              Source code available • Privacy focused • Secure connection
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
