// frontend/components/figma/FigmaDesignSystem.tsx
// Purely presentational component - all data comes from backend via props

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Palette, Type, Zap, Clock, ExternalLink } from 'lucide-react'

interface FigmaToken {
  name: string
  value: string
  category: 'color' | 'typography' | 'spacing' | 'shadow'
  figma_node_id?: string
  last_synced?: string
  description?: string
}

interface FigmaDesignTokensProps {
  tokens: FigmaToken[]
  isConnected: boolean
  lastSynced?: string
  onSyncRequest: () => void
  onNodeSync?: (nodeId: string) => void
}

export function FigmaDesignTokens({ 
  tokens, 
  isConnected, 
  lastSynced, 
  onSyncRequest, 
  onNodeSync 
}: FigmaDesignTokensProps) {
  const colorTokens = tokens.filter(t => t.category === 'color')
  const typographyTokens = tokens.filter(t => t.category === 'typography')
  const spacingTokens = tokens.filter(t => t.category === 'spacing')
  const shadowTokens = tokens.filter(t => t.category === 'shadow')

  const renderColorToken = (token: FigmaToken) => (
    <div key={token.name} className="flex items-center gap-3 p-3 rounded-lg border">
      <div 
        className="w-8 h-8 rounded-md border shadow-sm"
        style={{ backgroundColor: token.value }}
      />
      <div className="flex-1">
        <div className="font-mono text-sm font-medium">{token.name}</div>
        <div className="text-xs text-muted-foreground">{token.value}</div>
        {token.description && (
          <div className="text-xs text-muted-foreground mt-1">{token.description}</div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {token.last_synced && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(token.last_synced).toLocaleTimeString()}
          </div>
        )}
        {token.figma_node_id && onNodeSync && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onNodeSync(token.figma_node_id!)}
          >
            <Zap className="h-3 w-3 mr-1" />
            Sync
          </Button>
        )}
      </div>
    </div>
  )

  const renderTypographyToken = (token: FigmaToken) => (
    <div key={token.name} className="flex items-center justify-between p-3 rounded-lg border">
      <div className="flex-1">
        <div className="font-mono text-sm font-medium">{token.name}</div>
        <div className="text-xs text-muted-foreground">{token.value}</div>
        {token.description && (
          <div className="text-xs text-muted-foreground mt-1">{token.description}</div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right" style={{ fontSize: token.value }}>
          Sample Text
        </div>
        {token.last_synced && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(token.last_synced).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header with connection status and sync controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-brand-primary">Design System Tokens</h2>
          <Badge 
            variant={isConnected ? "default" : "secondary"} 
            className={isConnected ? "bg-success/10 text-success" : "bg-muted"}
          >
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
            {isConnected ? 'Figma Connected' : 'Figma Disconnected'}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          {lastSynced && (
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Last sync: {new Date(lastSynced).toLocaleString()}
            </div>
          )}
          <Button onClick={onSyncRequest} className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Sync All Tokens
          </Button>
        </div>
      </div>

      {/* Token Categories */}
      {colorTokens.length > 0 && (
        <Card className="border-brand-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-brand-primary" />
              Color Tokens
              <Badge variant="outline">{colorTokens.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {colorTokens.map(renderColorToken)}
            </div>
          </CardContent>
        </Card>
      )}

      {typographyTokens.length > 0 && (
        <Card className="border-brand-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5 text-brand-primary" />
              Typography Tokens
              <Badge variant="outline">{typographyTokens.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {typographyTokens.map(renderTypographyToken)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {tokens.length === 0 && (
        <Card className="border-dashed border-2 border-muted">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Palette className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No Design Tokens Found
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Connect to Figma and sync your design tokens to get started.
            </p>
            <Button onClick={onSyncRequest} variant="outline">
              <Zap className="h-4 w-4 mr-2" />
              Sync from Figma
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Component for displaying Figma-sourced design specs
export function FigmaComponentSpecs({ 
  componentName, 
  figmaUrl, 
  specs 
}: {
  componentName: string
  figmaUrl?: string
  specs: Record<string, string>
}) {
  return (
    <Card className="border-brand-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔧 {componentName} Specs
          {figmaUrl && (
            <Button size="sm" variant="outline" asChild>
              <a href={figmaUrl} target="_blank" rel="noopener noreferrer">
                View in Figma
              </a>
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.entries(specs).map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{key}:</span>
              <span className="font-mono">{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
