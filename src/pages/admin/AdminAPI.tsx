import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Save, Facebook, Chrome, Truck, CreditCard } from 'lucide-react'
import { getApiConfigurations, updateApiConfigurations, DEFAULT_API_CONFIG, type ApiConfigurationsFormData } from '@/lib/api-configurations'
import { toast } from 'sonner'

const AdminAPI = () => {
  const [formData, setFormData] = useState<ApiConfigurationsFormData>(DEFAULT_API_CONFIG)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadApiConfigurations()
  }, [])

  const loadApiConfigurations = async () => {
    try {
      setLoading(true)
      const config = await getApiConfigurations()
      if (config) {
        setFormData({
          // Facebook Conversion API
          fb_api_version: config.fb_api_version || DEFAULT_API_CONFIG.fb_api_version,
          fb_pixel_id: config.fb_pixel_id || '',
          fb_access_token: config.fb_access_token || '',
          fb_enabled: config.fb_enabled || false,
          // Google Tag Manager
          gtm_container_id: config.gtm_container_id || '',
          ga_measurement_id: config.ga_measurement_id || '',
          google_ads_conversion_id: config.google_ads_conversion_id || '',
          google_ads_conversion_label: config.google_ads_conversion_label || '',
          gtm_enabled: config.gtm_enabled || false,
          // Pathao
          pathao_client_id: config.pathao_client_id || '',
          pathao_client_secret: config.pathao_client_secret || '',
          pathao_username: config.pathao_username || '',
          pathao_password: config.pathao_password || '',
          pathao_base_url: config.pathao_base_url || DEFAULT_API_CONFIG.pathao_base_url,
          pathao_enabled: config.pathao_enabled || false,
          // RedX
          redx_api_token: config.redx_api_token || '',
          redx_base_url: config.redx_base_url || DEFAULT_API_CONFIG.redx_base_url,
          redx_enabled: config.redx_enabled || false,
          // Steadfast
          stedfast_api_key: config.stedfast_api_key || '',
          stedfast_secret_key: config.stedfast_secret_key || '',
          stedfast_base_url: config.stedfast_base_url || DEFAULT_API_CONFIG.stedfast_base_url,
          stedfast_enabled: config.stedfast_enabled || false,
          // SSLCommerz
          sslcommerz_store_id: config.sslcommerz_store_id || '',
          sslcommerz_store_password: config.sslcommerz_store_password || '',
          sslcommerz_sandbox_mode: config.sslcommerz_sandbox_mode ?? true,
          sslcommerz_enabled: config.sslcommerz_enabled || false,
          // bKash
          bkash_app_key: config.bkash_app_key || '',
          bkash_app_secret: config.bkash_app_secret || '',
          bkash_username: config.bkash_username || '',
          bkash_password: config.bkash_password || '',
          bkash_sandbox_mode: config.bkash_sandbox_mode ?? true,
          bkash_enabled: config.bkash_enabled || false
        })
      }
    } catch (err) {
      console.error('Error loading API configurations:', err)
      setError('Failed to load API configurations')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ApiConfigurationsFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      
      const result = await updateApiConfigurations(formData)
      
      if (result.success) {
        toast.success('API configurations updated successfully')
      } else {
        setError(result.error || 'Failed to update API configurations')
        toast.error('Failed to update API configurations')
      }
    } catch (err) {
      console.error('Error saving API configurations:', err)
      setError('An unexpected error occurred')
      toast.error('An unexpected error occurred')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Management</h1>
          <p className="text-muted-foreground">
            Configure and manage all third-party API integrations
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Facebook Conversion API */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Facebook className="h-5 w-5" />
            Facebook Conversion API
          </CardTitle>
          <CardDescription>
            Configure Facebook Conversion API for tracking conversions and events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="fb_enabled"
              checked={formData.fb_enabled}
              onCheckedChange={(checked) => handleInputChange('fb_enabled', checked)}
            />
            <Label htmlFor="fb_enabled">Enable Facebook Conversion API</Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fb_api_version">API Version</Label>
              <Input
                id="fb_api_version"
                value={formData.fb_api_version}
                onChange={(e) => handleInputChange('fb_api_version', e.target.value)}
                placeholder="18.0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fb_pixel_id">Pixel ID</Label>
              <Input
                id="fb_pixel_id"
                value={formData.fb_pixel_id}
                onChange={(e) => handleInputChange('fb_pixel_id', e.target.value)}
                placeholder="Enter Facebook Pixel ID"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="fb_access_token">Access Token</Label>
              <Input
                id="fb_access_token"
                type="password"
                value={formData.fb_access_token}
                onChange={(e) => handleInputChange('fb_access_token', e.target.value)}
                placeholder="Enter Facebook Access Token"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Google Tag Manager */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Chrome className="h-5 w-5" />
            Google Analytics & Tag Manager
          </CardTitle>
          <CardDescription>
            Configure Google Tag Manager, Analytics, and Ads conversion tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="gtm_enabled"
              checked={formData.gtm_enabled}
              onCheckedChange={(checked) => handleInputChange('gtm_enabled', checked)}
            />
            <Label htmlFor="gtm_enabled">Enable Google Tag Manager</Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gtm_container_id">GTM Container ID</Label>
              <Input
                id="gtm_container_id"
                value={formData.gtm_container_id}
                onChange={(e) => handleInputChange('gtm_container_id', e.target.value)}
                placeholder="GTM-XXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ga_measurement_id">GA Measurement ID</Label>
              <Input
                id="ga_measurement_id"
                value={formData.ga_measurement_id}
                onChange={(e) => handleInputChange('ga_measurement_id', e.target.value)}
                placeholder="G-XXXXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="google_ads_conversion_id">Google Ads Conversion ID</Label>
              <Input
                id="google_ads_conversion_id"
                value={formData.google_ads_conversion_id}
                onChange={(e) => handleInputChange('google_ads_conversion_id', e.target.value)}
                placeholder="AW-XXXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="google_ads_conversion_label">Google Ads Conversion Label</Label>
              <Input
                id="google_ads_conversion_label"
                value={formData.google_ads_conversion_label}
                onChange={(e) => handleInputChange('google_ads_conversion_label', e.target.value)}
                placeholder="Enter conversion label"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courier Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Courier Services
          </CardTitle>
          <CardDescription>
            Configure courier service APIs for delivery management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pathao */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Pathao</h3>
              <Switch
                id="pathao_enabled"
                checked={formData.pathao_enabled}
                onCheckedChange={(checked) => handleInputChange('pathao_enabled', checked)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pathao_client_id">Client ID</Label>
                <Input
                  id="pathao_client_id"
                  value={formData.pathao_client_id}
                  onChange={(e) => handleInputChange('pathao_client_id', e.target.value)}
                  placeholder="Enter Pathao Client ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pathao_client_secret">Client Secret</Label>
                <Input
                  id="pathao_client_secret"
                  type="password"
                  value={formData.pathao_client_secret}
                  onChange={(e) => handleInputChange('pathao_client_secret', e.target.value)}
                  placeholder="Enter Pathao Client Secret"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pathao_username">Username</Label>
                <Input
                  id="pathao_username"
                  value={formData.pathao_username}
                  onChange={(e) => handleInputChange('pathao_username', e.target.value)}
                  placeholder="Enter Pathao Username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pathao_password">Password</Label>
                <Input
                  id="pathao_password"
                  type="password"
                  value={formData.pathao_password}
                  onChange={(e) => handleInputChange('pathao_password', e.target.value)}
                  placeholder="Enter Pathao Password"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="pathao_base_url">Base URL</Label>
                <Input
                  id="pathao_base_url"
                  value={formData.pathao_base_url}
                  onChange={(e) => handleInputChange('pathao_base_url', e.target.value)}
                  placeholder="https://api-hermes.pathao.com"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* RedX */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">RedX</h3>
              <Switch
                id="redx_enabled"
                checked={formData.redx_enabled}
                onCheckedChange={(checked) => handleInputChange('redx_enabled', checked)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="redx_api_token">API Token</Label>
                <Input
                  id="redx_api_token"
                  type="password"
                  value={formData.redx_api_token}
                  onChange={(e) => handleInputChange('redx_api_token', e.target.value)}
                  placeholder="Enter RedX API Token"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="redx_base_url">Base URL</Label>
                <Input
                  id="redx_base_url"
                  value={formData.redx_base_url}
                  onChange={(e) => handleInputChange('redx_base_url', e.target.value)}
                  placeholder="https://openapi.redx.com.bd/v1.0.0-beta"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Steadfast */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Steadfast</h3>
              <Switch
                id="stedfast_enabled"
                checked={formData.stedfast_enabled}
                onCheckedChange={(checked) => handleInputChange('stedfast_enabled', checked)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stedfast_api_key">API Key</Label>
                <Input
                  id="stedfast_api_key"
                  type="password"
                  value={formData.stedfast_api_key}
                  onChange={(e) => handleInputChange('stedfast_api_key', e.target.value)}
                  placeholder="Enter Steadfast API Key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stedfast_secret_key">Secret Key</Label>
                <Input
                  id="stedfast_secret_key"
                  type="password"
                  value={formData.stedfast_secret_key}
                  onChange={(e) => handleInputChange('stedfast_secret_key', e.target.value)}
                  placeholder="Enter Steadfast Secret Key"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="stedfast_base_url">Base URL</Label>
                <Input
                  id="stedfast_base_url"
                  value={formData.stedfast_base_url}
                  onChange={(e) => handleInputChange('stedfast_base_url', e.target.value)}
                  placeholder="https://portal.steadfast.com.bd/api/v1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Gateways */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Gateways
          </CardTitle>
          <CardDescription>
            Configure payment gateway APIs for processing transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* SSLCommerz */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">SSLCommerz</h3>
              <Switch
                id="sslcommerz_enabled"
                checked={formData.sslcommerz_enabled}
                onCheckedChange={(checked) => handleInputChange('sslcommerz_enabled', checked)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sslcommerz_store_id">Store ID</Label>
                <Input
                  id="sslcommerz_store_id"
                  value={formData.sslcommerz_store_id}
                  onChange={(e) => handleInputChange('sslcommerz_store_id', e.target.value)}
                  placeholder="Enter SSLCommerz Store ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sslcommerz_store_password">Store Password</Label>
                <Input
                  id="sslcommerz_store_password"
                  type="password"
                  value={formData.sslcommerz_store_password}
                  onChange={(e) => handleInputChange('sslcommerz_store_password', e.target.value)}
                  placeholder="Enter SSLCommerz Store Password"
                />
              </div>
              <div className="flex items-center space-x-2 md:col-span-2">
                <Switch
                  id="sslcommerz_sandbox_mode"
                  checked={formData.sslcommerz_sandbox_mode}
                  onCheckedChange={(checked) => handleInputChange('sslcommerz_sandbox_mode', checked)}
                />
                <Label htmlFor="sslcommerz_sandbox_mode">Sandbox Mode</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* bKash */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">bKash</h3>
              <Switch
                id="bkash_enabled"
                checked={formData.bkash_enabled}
                onCheckedChange={(checked) => handleInputChange('bkash_enabled', checked)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bkash_app_key">App Key</Label>
                <Input
                  id="bkash_app_key"
                  type="password"
                  value={formData.bkash_app_key}
                  onChange={(e) => handleInputChange('bkash_app_key', e.target.value)}
                  placeholder="Enter bKash App Key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bkash_app_secret">App Secret</Label>
                <Input
                  id="bkash_app_secret"
                  type="password"
                  value={formData.bkash_app_secret}
                  onChange={(e) => handleInputChange('bkash_app_secret', e.target.value)}
                  placeholder="Enter bKash App Secret"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bkash_username">Username</Label>
                <Input
                  id="bkash_username"
                  value={formData.bkash_username}
                  onChange={(e) => handleInputChange('bkash_username', e.target.value)}
                  placeholder="Enter bKash Username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bkash_password">Password</Label>
                <Input
                  id="bkash_password"
                  type="password"
                  value={formData.bkash_password}
                  onChange={(e) => handleInputChange('bkash_password', e.target.value)}
                  placeholder="Enter bKash Password"
                />
              </div>
              <div className="flex items-center space-x-2 md:col-span-2">
                <Switch
                  id="bkash_sandbox_mode"
                  checked={formData.bkash_sandbox_mode}
                  onCheckedChange={(checked) => handleInputChange('bkash_sandbox_mode', checked)}
                />
                <Label htmlFor="bkash_sandbox_mode">Sandbox Mode</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button at Bottom */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save All Changes
        </Button>
      </div>
    </div>
  )
}

export default AdminAPI