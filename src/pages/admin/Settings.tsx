import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Switch } from '../../components/ui/switch'
import { Separator } from '../../components/ui/separator'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Bell, Store, Upload, X, Facebook, Instagram, Twitter, Linkedin, Youtube, MessageCircle, Palette, Truck, CreditCard, BarChart3 } from 'lucide-react'
import { getStoreSettings, updateStoreSettings, uploadStoreLogo, CURRENCY_OPTIONS, type StoreSettingsFormData } from '../../lib/store-settings'
import { ColorPicker } from '../../components/ui/color-picker'
import { applyThemeColors, DEFAULT_THEME_COLORS } from '../../lib/theme-utils'
import { toast } from 'sonner'

export default function AdminSettings() {
  const [storeSettings, setStoreSettings] = useState<StoreSettingsFormData>({
    store_name: '',
    store_description: '',
    store_email: '',
    store_phone: '',
    store_whatsapp: '',
    store_address: '',
    currency: 'USD',
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    linkedin_url: '',
    youtube_url: '',
    tiktok_url: '',
    privacy_policy: '',
    terms_of_service: '',
    return_policy: '',
    shipping_policy: '',
    theme_primary_color: DEFAULT_THEME_COLORS.primary,
    theme_secondary_color: DEFAULT_THEME_COLORS.secondary,
    theme_accent_color: DEFAULT_THEME_COLORS.accent,
    // Facebook Conversion API fields
    fb_api_version: '18.0',
    fb_pixel_id: '',
    fb_access_token: '',
    // Courier Service fields
    pathao_client_id: '',
    pathao_client_secret: '',
    pathao_username: '',
    pathao_password: '',
    pathao_base_url: 'https://api-hermes.pathao.com',
    pathao_enabled: false,
    stedfast_api_key: '',
    stedfast_secret_key: '',
    stedfast_base_url: 'https://portal.steadfast.com.bd/api/v1',
    stedfast_enabled: false,
    redx_api_token: '',
    redx_base_url: 'https://openapi.redx.com.bd/v1.0.0-beta',
    redx_enabled: false,
    // Payment Gateway fields
    sslcommerz_store_id: '',
    sslcommerz_store_password: '',
    sslcommerz_sandbox_mode: true,
    sslcommerz_enabled: false,
    bkash_app_key: '',
    bkash_app_secret: '',
    bkash_username: '',
    bkash_password: '',
    bkash_sandbox_mode: true,
    bkash_enabled: false,
    // Google Tag Manager fields
    gtm_container_id: '',
    ga_measurement_id: '',
    google_ads_conversion_id: '',
    google_ads_conversion_label: '',
    gtm_enabled: false
  })
  
  const [currentLogo, setCurrentLogo] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [notificationSettings, setNotificationSettings] = useState({
    orderNotifications: true,
    customerSignups: true,
    lowStockAlerts: true,
    marketingUpdates: false
  })

  // Load store settings on component mount
  useEffect(() => {
    loadStoreSettings()
  }, [])

  const loadStoreSettings = async () => {
    setIsLoading(true)
    try {
      const settings = await getStoreSettings()
      if (settings) {
        setStoreSettings({
          store_name: settings.store_name || '',
          store_description: settings.store_description || '',
          store_email: settings.store_email || '',
          store_phone: settings.store_phone || '',
          store_whatsapp: settings.store_whatsapp || '',
          store_address: settings.store_address || '',
          currency: settings.currency || 'USD',
          facebook_url: settings.facebook_url || '',
          instagram_url: settings.instagram_url || '',
          twitter_url: settings.twitter_url || '',
          linkedin_url: settings.linkedin_url || '',
          youtube_url: settings.youtube_url || '',
          tiktok_url: settings.tiktok_url || '',
          privacy_policy: settings.privacy_policy || '',
          terms_of_service: settings.terms_of_service || '',
          return_policy: settings.return_policy || '',
          shipping_policy: settings.shipping_policy || '',
          theme_primary_color: settings.theme_primary_color || DEFAULT_THEME_COLORS.primary,
          theme_secondary_color: settings.theme_secondary_color || DEFAULT_THEME_COLORS.secondary,
          theme_accent_color: settings.theme_accent_color || DEFAULT_THEME_COLORS.accent,
          // Facebook Conversion API fields
          fb_api_version: settings.fb_api_version || '18.0',
          fb_pixel_id: settings.fb_pixel_id || '',
          fb_access_token: settings.fb_access_token || '',
          // Courier Service fields
          pathao_client_id: settings.pathao_client_id || '',
          pathao_client_secret: settings.pathao_client_secret || '',
          pathao_username: settings.pathao_username || '',
          pathao_password: settings.pathao_password || '',
          pathao_base_url: settings.pathao_base_url || 'https://api-hermes.pathao.com',
          pathao_enabled: settings.pathao_enabled || false,
          stedfast_api_key: settings.stedfast_api_key || '',
          stedfast_secret_key: settings.stedfast_secret_key || '',
          stedfast_base_url: settings.stedfast_base_url || 'https://portal.steadfast.com.bd/api/v1',
          stedfast_enabled: settings.stedfast_enabled || false,
          redx_api_token: settings.redx_api_token || '',
          redx_base_url: settings.redx_base_url || 'https://openapi.redx.com.bd/v1.0.0-beta',
          redx_enabled: settings.redx_enabled || false,
          // Payment Gateway fields
          sslcommerz_store_id: settings.sslcommerz_store_id || '',
          sslcommerz_store_password: settings.sslcommerz_store_password || '',
          sslcommerz_sandbox_mode: settings.sslcommerz_sandbox_mode ?? true,
          sslcommerz_enabled: settings.sslcommerz_enabled || false,
          bkash_app_key: settings.bkash_app_key || '',
          bkash_app_secret: settings.bkash_app_secret || '',
          bkash_username: settings.bkash_username || '',
          bkash_password: settings.bkash_password || '',
          bkash_sandbox_mode: settings.bkash_sandbox_mode ?? true,
          bkash_enabled: settings.bkash_enabled || false,
          // Google Tag Manager fields
          gtm_container_id: settings.gtm_container_id || '',
          ga_measurement_id: settings.ga_measurement_id || '',
          google_ads_conversion_id: settings.google_ads_conversion_id || '',
          google_ads_conversion_label: settings.google_ads_conversion_label || '',
          gtm_enabled: settings.gtm_enabled || false
        })
        setCurrentLogo(settings.logo_url || null)
      }
    } catch (error) {
      console.error('Error loading store settings:', error)
      toast.error('Failed to load store settings')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleStoreSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setStoreSettings(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCurrencyChange = (value: string) => {
    setStoreSettings(prev => ({
      ...prev,
      currency: value
    }))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }

      setLogoFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      let logoUrl = currentLogo
      let logoStoragePath = ''

      // Upload new logo if selected
      if (logoFile) {
        const uploadResult = await uploadStoreLogo(logoFile)
        if (uploadResult) {
          logoUrl = uploadResult.url
          logoStoragePath = uploadResult.path
          
          // Delete old logo if exists
          if (currentLogo) {
            // Extract path from current logo URL if needed
            // This is a simplified approach - you might need to store the path separately
          }
        } else {
          toast.error('Failed to upload logo')
          return
        }
      }

      // Update store settings
       const updatedSettings = await updateStoreSettings({
         ...storeSettings,
         logo_url: logoUrl || undefined,
         logo_storage_path: logoStoragePath
       })

      if (updatedSettings) {
        setCurrentLogo(logoUrl)
        setLogoFile(null)
        setLogoPreview(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        toast.success('Store settings saved successfully!')
      } else {
        toast.error('Failed to save store settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save store settings')
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleNotificationToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }

  const handleThemeColorChange = (colorType: 'theme_primary_color' | 'theme_secondary_color' | 'theme_accent_color', color: string) => {
    setStoreSettings(prev => {
      const updated = {
        ...prev,
        [colorType]: color
      }
      
      // Apply theme colors immediately for preview
      applyThemeColors({
        primary: updated.theme_primary_color,
        secondary: updated.theme_secondary_color,
        accent: updated.theme_accent_color
      })
      
      return updated
    })
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Theme
            </TabsTrigger>
            <TabsTrigger value="facebook" className="flex items-center gap-2">
              <Facebook className="h-4 w-4" />
              Facebook
            </TabsTrigger>
            <TabsTrigger value="courier" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Courier
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Store Information
              </CardTitle>
              <CardDescription>
                Update your store details and contact information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="store_name">Store Name</Label>
                  <Input
                    id="store_name"
                    name="store_name"
                    value={storeSettings.store_name}
                    onChange={handleStoreSettingChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store_email">Store Email</Label>
                  <Input
                    id="store_email"
                    name="store_email"
                    type="email"
                    value={storeSettings.store_email}
                    onChange={handleStoreSettingChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store_phone">Store Phone</Label>
                  <Input
                    id="store_phone"
                    name="store_phone"
                    value={storeSettings.store_phone}
                    onChange={handleStoreSettingChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store_address">Store Address</Label>
                  <Input
                    id="store_address"
                    name="store_address"
                    value={storeSettings.store_address}
                    onChange={handleStoreSettingChange}
                  />
                </div>
              </div>
              
              
              <div className="space-y-2">
                <Label htmlFor="store_description">Store Description</Label>
                <Textarea
                  id="store_description"
                  name="store_description"
                  value={storeSettings.store_description}
                  onChange={handleStoreSettingChange}
                  placeholder="Brief description of your store"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="store_whatsapp">WhatsApp Number</Label>
                <Input
                  id="store_whatsapp"
                  name="store_whatsapp"
                  value={storeSettings.store_whatsapp}
                  onChange={handleStoreSettingChange}
                  placeholder="+1234567890"
                />
              </div>
              
              <Separator className="my-6" />
              
              {/* Logo Upload Section */}
              <div className="space-y-4">
                <Label>Store Logo</Label>
                <div className="flex items-center gap-4">
                  {(logoPreview || currentLogo) && (
                    <div className="relative">
                      <img
                        src={logoPreview || currentLogo || ''}
                        alt="Store logo"
                        className="w-20 h-20 object-contain border rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={handleRemoveLogo}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {logoPreview || currentLogo ? 'Change Logo' : 'Upload Logo'}
                    </Button>
                    <p className="text-sm text-muted-foreground mt-1">
                      Recommended: 200x200px, max 5MB
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              {/* Currency Selection */}
              <div className="space-y-2">
                <Label>Store Currency</Label>
                <Select value={storeSettings.currency} onValueChange={handleCurrencyChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCY_OPTIONS.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Separator className="my-6" />
              
              {/* Social Media Links */}
              <div className="space-y-4">
                <Label>Social Media Links</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebook_url" className="flex items-center gap-2">
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </Label>
                    <Input
                      id="facebook_url"
                      name="facebook_url"
                      value={storeSettings.facebook_url}
                      onChange={handleStoreSettingChange}
                      placeholder="https://facebook.com/yourstore"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram_url" className="flex items-center gap-2">
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </Label>
                    <Input
                      id="instagram_url"
                      name="instagram_url"
                      value={storeSettings.instagram_url}
                      onChange={handleStoreSettingChange}
                      placeholder="https://instagram.com/yourstore"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter_url" className="flex items-center gap-2">
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </Label>
                    <Input
                      id="twitter_url"
                      name="twitter_url"
                      value={storeSettings.twitter_url}
                      onChange={handleStoreSettingChange}
                      placeholder="https://twitter.com/yourstore"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_url" className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin_url"
                      name="linkedin_url"
                      value={storeSettings.linkedin_url}
                      onChange={handleStoreSettingChange}
                      placeholder="https://linkedin.com/company/yourstore"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube_url" className="flex items-center gap-2">
                      <Youtube className="h-4 w-4" />
                      YouTube
                    </Label>
                    <Input
                      id="youtube_url"
                      name="youtube_url"
                      value={storeSettings.youtube_url}
                      onChange={handleStoreSettingChange}
                      placeholder="https://youtube.com/@yourstore"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tiktok_url" className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      TikTok
                    </Label>
                    <Input
                      id="tiktok_url"
                      name="tiktok_url"
                      value={storeSettings.tiktok_url}
                      onChange={handleStoreSettingChange}
                      placeholder="https://tiktok.com/@yourstore"
                    />
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              {/* Store Policies */}
              <div className="space-y-4">
                <Label>Store Policies</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="privacy_policy">Privacy Policy</Label>
                    <Textarea
                      id="privacy_policy"
                      name="privacy_policy"
                      value={storeSettings.privacy_policy}
                      onChange={handleStoreSettingChange}
                      placeholder="Your privacy policy..."
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="terms_of_service">Terms of Service</Label>
                    <Textarea
                      id="terms_of_service"
                      name="terms_of_service"
                      value={storeSettings.terms_of_service}
                      onChange={handleStoreSettingChange}
                      placeholder="Your terms of service..."
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="return_policy">Return Policy</Label>
                    <Textarea
                      id="return_policy"
                      name="return_policy"
                      value={storeSettings.return_policy}
                      onChange={handleStoreSettingChange}
                      placeholder="Your return policy..."
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shipping_policy">Shipping Policy</Label>
                    <Textarea
                      id="shipping_policy"
                      name="shipping_policy"
                      value={storeSettings.shipping_policy}
                      onChange={handleStoreSettingChange}
                      placeholder="Your shipping policy..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving || isLoading}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme Colors
              </CardTitle>
              <CardDescription>
                Customize your store's theme colors. Changes will be applied immediately for preview.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Main brand color used for buttons and highlights
                  </p>
                  <ColorPicker
                    value={storeSettings.theme_primary_color}
                    onChange={(color) => handleThemeColorChange('theme_primary_color', color)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Supporting color for secondary elements
                  </p>
                  <ColorPicker
                    value={storeSettings.theme_secondary_color}
                    onChange={(color) => handleThemeColorChange('theme_secondary_color', color)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Accent color for special highlights and CTAs
                  </p>
                  <ColorPicker
                    value={storeSettings.theme_accent_color}
                    onChange={(color) => handleThemeColorChange('theme_accent_color', color)}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Preview</h4>
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex gap-2">
                    <Button size="sm">Primary Button</Button>
                    <Button variant="secondary" size="sm">Secondary Button</Button>
                    <Button variant="outline" size="sm">Outline Button</Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    This preview shows how your theme colors will appear on buttons and other elements.
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving || isLoading}>
                {isSaving ? 'Saving...' : 'Save Theme Colors'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="facebook">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Facebook className="h-5 w-5" />
                Facebook Conversion API
              </CardTitle>
              <CardDescription>
                Configure Facebook Conversion API for tracking and advertising.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fb_api_version">API Version</Label>
                  <Input
                    id="fb_api_version"
                    value={storeSettings.fb_api_version}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, fb_api_version: e.target.value }))}
                    placeholder="18.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fb_pixel_id">Pixel ID</Label>
                  <Input
                    id="fb_pixel_id"
                    value={storeSettings.fb_pixel_id}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, fb_pixel_id: e.target.value }))}
                    placeholder="Enter your Facebook Pixel ID"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fb_access_token">Access Token</Label>
                <Input
                  id="fb_access_token"
                  type="password"
                  value={storeSettings.fb_access_token}
                  onChange={(e) => setStoreSettings(prev => ({ ...prev, fb_access_token: e.target.value }))}
                  placeholder="Enter your Facebook Access Token"
                />
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Setup Instructions</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Create a Facebook Business account and set up a Pixel</li>
                  <li>• Generate an access token from Facebook Business Manager</li>
                  <li>• Use API version 18.0 or later for best compatibility</li>
                  <li>• Events will be tracked automatically after configuration</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving || isLoading}>
                {isSaving ? 'Saving...' : 'Save Facebook Settings'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="courier">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Courier Services
              </CardTitle>
              <CardDescription>
                Configure courier services for automated order delivery.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Pathao Configuration */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Pathao</h4>
                  <Switch
                    checked={storeSettings.pathao_enabled}
                    onCheckedChange={(checked) => setStoreSettings(prev => ({ ...prev, pathao_enabled: checked }))}
                  />
                </div>
                {storeSettings.pathao_enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-blue-200">
                    <div className="space-y-2">
                      <Label htmlFor="pathao_client_id">Client ID</Label>
                      <Input
                        id="pathao_client_id"
                        value={storeSettings.pathao_client_id}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, pathao_client_id: e.target.value }))}
                        placeholder="Enter Pathao Client ID"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pathao_client_secret">Client Secret</Label>
                      <Input
                        id="pathao_client_secret"
                        type="password"
                        value={storeSettings.pathao_client_secret}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, pathao_client_secret: e.target.value }))}
                        placeholder="Enter Pathao Client Secret"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pathao_username">Username</Label>
                      <Input
                        id="pathao_username"
                        value={storeSettings.pathao_username}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, pathao_username: e.target.value }))}
                        placeholder="Enter Pathao Username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pathao_password">Password</Label>
                      <Input
                        id="pathao_password"
                        type="password"
                        value={storeSettings.pathao_password}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, pathao_password: e.target.value }))}
                        placeholder="Enter Pathao Password"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <Separator />
              
              {/* Stedfast Configuration */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Stedfast</h4>
                  <Switch
                    checked={storeSettings.stedfast_enabled}
                    onCheckedChange={(checked) => setStoreSettings(prev => ({ ...prev, stedfast_enabled: checked }))}
                  />
                </div>
                {storeSettings.stedfast_enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-green-200">
                    <div className="space-y-2">
                      <Label htmlFor="stedfast_api_key">API Key</Label>
                      <Input
                        id="stedfast_api_key"
                        value={storeSettings.stedfast_api_key}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, stedfast_api_key: e.target.value }))}
                        placeholder="Enter Stedfast API Key"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stedfast_secret_key">Secret Key</Label>
                      <Input
                        id="stedfast_secret_key"
                        type="password"
                        value={storeSettings.stedfast_secret_key}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, stedfast_secret_key: e.target.value }))}
                        placeholder="Enter Stedfast Secret Key"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <Separator />
              
              {/* RedX Configuration */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">RedX</h4>
                  <Switch
                    checked={storeSettings.redx_enabled}
                    onCheckedChange={(checked) => setStoreSettings(prev => ({ ...prev, redx_enabled: checked }))}
                  />
                </div>
                {storeSettings.redx_enabled && (
                  <div className="pl-4 border-l-2 border-red-200">
                    <div className="space-y-2">
                      <Label htmlFor="redx_api_token">API Token</Label>
                      <Input
                        id="redx_api_token"
                        type="password"
                        value={storeSettings.redx_api_token}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, redx_api_token: e.target.value }))}
                        placeholder="Enter RedX API Token"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving || isLoading}>
                {isSaving ? 'Saving...' : 'Save Courier Settings'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Gateways
              </CardTitle>
              <CardDescription>
                Configure payment gateways for online transactions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* SSLCOMMERZ Configuration */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">SSLCOMMERZ</h4>
                  <Switch
                    checked={storeSettings.sslcommerz_enabled}
                    onCheckedChange={(checked) => setStoreSettings(prev => ({ ...prev, sslcommerz_enabled: checked }))}
                  />
                </div>
                {storeSettings.sslcommerz_enabled && (
                  <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sslcommerz_store_id">Store ID</Label>
                        <Input
                          id="sslcommerz_store_id"
                          value={storeSettings.sslcommerz_store_id}
                          onChange={(e) => setStoreSettings(prev => ({ ...prev, sslcommerz_store_id: e.target.value }))}
                          placeholder="Enter SSLCOMMERZ Store ID"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sslcommerz_store_password">Store Password</Label>
                        <Input
                          id="sslcommerz_store_password"
                          type="password"
                          value={storeSettings.sslcommerz_store_password}
                          onChange={(e) => setStoreSettings(prev => ({ ...prev, sslcommerz_store_password: e.target.value }))}
                          placeholder="Enter SSLCOMMERZ Store Password"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="sslcommerz_sandbox"
                        checked={storeSettings.sslcommerz_sandbox_mode}
                        onCheckedChange={(checked) => setStoreSettings(prev => ({ ...prev, sslcommerz_sandbox_mode: checked }))}
                      />
                      <Label htmlFor="sslcommerz_sandbox">Sandbox Mode (for testing)</Label>
                    </div>
                  </div>
                )}
              </div>
              
              <Separator />
              
              {/* bKash Configuration */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">bKash</h4>
                  <Switch
                    checked={storeSettings.bkash_enabled}
                    onCheckedChange={(checked) => setStoreSettings(prev => ({ ...prev, bkash_enabled: checked }))}
                  />
                </div>
                {storeSettings.bkash_enabled && (
                  <div className="space-y-4 pl-4 border-l-2 border-pink-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bkash_app_key">App Key</Label>
                        <Input
                          id="bkash_app_key"
                          value={storeSettings.bkash_app_key}
                          onChange={(e) => setStoreSettings(prev => ({ ...prev, bkash_app_key: e.target.value }))}
                          placeholder="Enter bKash App Key"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bkash_app_secret">App Secret</Label>
                        <Input
                          id="bkash_app_secret"
                          type="password"
                          value={storeSettings.bkash_app_secret}
                          onChange={(e) => setStoreSettings(prev => ({ ...prev, bkash_app_secret: e.target.value }))}
                          placeholder="Enter bKash App Secret"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bkash_username">Username</Label>
                        <Input
                          id="bkash_username"
                          value={storeSettings.bkash_username}
                          onChange={(e) => setStoreSettings(prev => ({ ...prev, bkash_username: e.target.value }))}
                          placeholder="Enter bKash Username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bkash_password">Password</Label>
                        <Input
                          id="bkash_password"
                          type="password"
                          value={storeSettings.bkash_password}
                          onChange={(e) => setStoreSettings(prev => ({ ...prev, bkash_password: e.target.value }))}
                          placeholder="Enter bKash Password"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="bkash_sandbox"
                        checked={storeSettings.bkash_sandbox_mode}
                        onCheckedChange={(checked) => setStoreSettings(prev => ({ ...prev, bkash_sandbox_mode: checked }))}
                      />
                      <Label htmlFor="bkash_sandbox">Sandbox Mode (for testing)</Label>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving || isLoading}>
                {isSaving ? 'Saving...' : 'Save Payment Settings'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics & Tracking
              </CardTitle>
              <CardDescription>
                Configure Google Tag Manager, Analytics, and Ads tracking.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Google Tag Manager</Label>
                  <p className="text-sm text-muted-foreground">Enable tracking for analytics and advertising</p>
                </div>
                <Switch
                  checked={storeSettings.gtm_enabled}
                  onCheckedChange={(checked) => setStoreSettings(prev => ({ ...prev, gtm_enabled: checked }))}
                />
              </div>
              
              {storeSettings.gtm_enabled && (
                <div className="space-y-4 pl-4 border-l-2 border-orange-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gtm_container_id">GTM Container ID</Label>
                      <Input
                        id="gtm_container_id"
                        value={storeSettings.gtm_container_id}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, gtm_container_id: e.target.value }))}
                        placeholder="GTM-XXXXXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ga_measurement_id">GA Measurement ID</Label>
                      <Input
                        id="ga_measurement_id"
                        value={storeSettings.ga_measurement_id}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, ga_measurement_id: e.target.value }))}
                        placeholder="G-XXXXXXXXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="google_ads_conversion_id">Google Ads Conversion ID</Label>
                      <Input
                        id="google_ads_conversion_id"
                        value={storeSettings.google_ads_conversion_id}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, google_ads_conversion_id: e.target.value }))}
                        placeholder="AW-XXXXXXXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="google_ads_conversion_label">Conversion Label</Label>
                      <Input
                        id="google_ads_conversion_label"
                        value={storeSettings.google_ads_conversion_label}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, google_ads_conversion_label: e.target.value }))}
                        placeholder="Enter conversion label"
                      />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-900 mb-2">Tracking Events</h4>
                    <ul className="text-sm text-orange-800 space-y-1">
                      <li>• Page views and user sessions</li>
                      <li>• Product views and add to cart events</li>
                      <li>• Purchase completions and revenue tracking</li>
                      <li>• Custom conversion events for ads optimization</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving || isLoading}>
                {isSaving ? 'Saving...' : 'Save Analytics Settings'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose which notifications you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="orderNotifications">Order Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications when new orders are placed</p>
                  </div>
                  <Switch
                    id="orderNotifications"
                    checked={notificationSettings.orderNotifications}
                    onCheckedChange={() => handleNotificationToggle('orderNotifications')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="customerSignups">Customer Signups</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications when new customers register</p>
                  </div>
                  <Switch
                    id="customerSignups"
                    checked={notificationSettings.customerSignups}
                    onCheckedChange={() => handleNotificationToggle('customerSignups')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="lowStockAlerts">Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when product inventory is running low</p>
                  </div>
                  <Switch
                    id="lowStockAlerts"
                    checked={notificationSettings.lowStockAlerts}
                    onCheckedChange={() => handleNotificationToggle('lowStockAlerts')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketingUpdates">Marketing Updates</Label>
                    <p className="text-sm text-muted-foreground">Receive marketing and promotional information</p>
                  </div>
                  <Switch
                    id="marketingUpdates"
                    checked={notificationSettings.marketingUpdates}
                    onCheckedChange={() => handleNotificationToggle('marketingUpdates')}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and authentication settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Session Management</Label>
                    <p className="text-sm text-muted-foreground">Manage your active sessions and devices</p>
                  </div>
                  <Button variant="outline">View Sessions</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update Security Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}