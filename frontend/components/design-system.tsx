// frontend/components/design-system.tsx
// Purely presentational design system view - all data managed by backend

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { FigmaDesignTokens, FigmaComponentSpecs } from './figma/FigmaDesignSystem'
import { 
  Settings, 
  Palette, 
  Download, 
  Upload, 
  RefreshCw, 
  ExternalLink,
  Code,
  Eye,
  Zap
} from 'lucide-react'

interface DesignSystemData {
  tokens: Array<{
    name: string
    value: string
    category: 'color' | 'typography' | 'spacing' | 'shadow'
    figma_node_id?: string
    last_synced?: string
    description?: string
  }>
  figmaConfig: {
    figma_token_configured: boolean
    figma_file_key: string
    figma_page_name: string
  }
  lastSynced?: string
  cssVariables?: string
  tailwindConfig?: Record<string, any>
}

interface DesignSystemProps {
  data: DesignSystemData
  isLoading: boolean
  onSyncFigma: (fileKey?: string, pageName?: string) => void
  onSaveFigmaConfig: (config: { figma_token: string, figma_file_key: string, figma_page_name: string }) => void
  onGenerateCSS: () => void
  onDownloadTokens: () => void
  error?: string
}

export function DesignSystemView({ 
  data, 
  isLoading, 
  onSyncFigma, 
  onSaveFigmaConfig, 
  onGenerateCSS, 
  onDownloadTokens,
  error 
}: DesignSystemProps) {
  // Form state would be managed by parent component (following backend-first pattern)
  const [figmaToken, setFigmaToken] = React.useState('')
  const [figmaFileKey, setFigmaFileKey] = React.useState(data.figmaConfig.figma_file_key || '')
  const [figmaPageName, setFigmaPageName] = React.useState(data.figmaConfig.figma_page_name || 'Design System')

  const handleSaveFigmaConfig = () => {
    onSaveFigmaConfig({
      figma_token: figmaToken,
      figma_file_key: figmaFileKey,
      figma_page_name: figmaPageName
    })
  }

  const handleSyncFigma = () => {
    onSyncFigma(figmaFileKey, figmaPageName)
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-lg text-brand-primary mb-2">Loading design system...</div>
        <div className="grid gap-6 md:grid-cols-2">
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-primary mb-2 tracking-tight">
          Design System Manager
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage design tokens, sync with Figma, and maintain visual consistency across QuantX.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <div className="w-2 h-2 rounded-full bg-destructive"></div>
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Figma Configuration */}
      <Card className="border-brand-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-brand-primary" />
            Figma Integration Setup
            {data.figmaConfig.figma_token_configured && (
              <Badge variant="outline" className="bg-success/10 text-success">
                <div className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse"></div>
                Connected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="figma-token">Figma Personal Access Token</Label>
              <Input
                id="figma-token"
                type="password"
                placeholder="figd_..."
                value={figmaToken}
                onChange={(e) => setFigmaToken(e.target.value)}
              />
              <div className="text-xs text-muted-foreground mt-1">
                Generate token at{' '}
                <a 
                  href="https://figma.com/developers/api#access-tokens" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-brand-primary hover:underline"
                >
                  figma.com/developers
                </a>
              </div>
            </div>
            <div>
              <Label htmlFor="figma-file-key">Figma File Key</Label>
              <Input
                id="figma-file-key"
                placeholder="File key from Figma URL"
                value={figmaFileKey}
                onChange={(e) => setFigmaFileKey(e.target.value)}
              />
              <div className="text-xs text-muted-foreground mt-1">
                Found in your Figma file URL
              </div>
            </div>
            <div>
              <Label htmlFor="figma-page-name">Design System Page Name</Label>
              <Input
                id="figma-page-name"
                placeholder="Design System"
                value={figmaPageName}
                onChange={(e) => setFigmaPageName(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSaveFigmaConfig}>
              <Settings className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
            {data.figmaConfig.figma_token_configured && (
              <Button onClick={handleSyncFigma} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync from Figma
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Design Tokens Display */}
      <FigmaDesignTokens
        tokens={data.tokens}
        isConnected={data.figmaConfig.figma_token_configured}
        lastSynced={data.lastSynced}
        onSyncRequest={handleSyncFigma}
        onNodeSync={(nodeId) => {
          // Individual node sync would be handled by backend
          console.log('Sync node:', nodeId)
        }}
      />

      {/* Code Generation & Export */}
      {data.tokens.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CSS Variables */}
          <Card className="border-brand-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-brand-primary" />
                CSS Variables
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-muted rounded-lg p-4 font-mono text-sm max-h-40 overflow-y-auto">
                  {data.cssVariables ? (
                    <pre>{data.cssVariables}</pre>
                  ) : (
                    <div className="text-muted-foreground">Click "Generate CSS" to see variables</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={onGenerateCSS} size="sm">
                    <Code className="h-4 w-4 mr-2" />
                    Generate CSS
                  </Button>
                  <Button onClick={onDownloadTokens} size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download JSON
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tailwind Config */}
          <Card className="border-brand-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-brand-primary" />
                Tailwind Extension
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-muted rounded-lg p-4 font-mono text-sm max-h-40 overflow-y-auto">
                  {data.tailwindConfig ? (
                    <pre>{JSON.stringify(data.tailwindConfig, null, 2)}</pre>
                  ) : (
                    <div className="text-muted-foreground">Tailwind config will appear here</div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  Add this to your tailwind.config.js extend section
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Usage Examples */}
      {data.tokens.length > 0 && (
        <Card className="border-brand-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-brand-primary" />
              Usage Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Color Usage */}
              {data.tokens.some(t => t.category === 'color') && (
                <div>
                  <h4 className="font-medium mb-3">Color Usage</h4>
                  <div className="space-y-2 text-sm">
                    <div className="bg-muted rounded p-2 font-mono">
                      className="bg-brand-primary text-brand-primary"
                    </div>
                    <div className="bg-muted rounded p-2 font-mono">
                      style={`{color: 'var(--brand-primary)'}`}
                    </div>
                  </div>
                </div>
              )}

              {/* Typography Usage */}
              {data.tokens.some(t => t.category === 'typography') && (
                <div>
                  <h4 className="font-medium mb-3">Typography Usage</h4>
                  <div className="space-y-2 text-sm">
                    <div className="bg-muted rounded p-2 font-mono">
                      className="text-lg font-medium"
                    </div>
                    <div className="bg-muted rounded p-2 font-mono">
                      style={`{fontSize: 'var(--text-lg)'}`}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
