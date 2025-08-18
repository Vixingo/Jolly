import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Switch } from '../../components/ui/switch'
import { Separator } from '../../components/ui/separator'
import { Settings, Bell, Lock, Store } from 'lucide-react'

export default function AdminSettings() {
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Jolly Store',
    storeEmail: 'contact@jollystore.com',
    storePhone: '+1 (555) 123-4567',
    storeAddress: '123 Commerce St, Shopping City, SC 12345'
  })
  
  const [notificationSettings, setNotificationSettings] = useState({
    orderNotifications: true,
    customerSignups: true,
    lowStockAlerts: true,
    marketingUpdates: false
  })
  
  const handleStoreSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setStoreSettings(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleNotificationToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Security
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
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    name="storeName"
                    value={storeSettings.storeName}
                    onChange={handleStoreSettingChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Store Email</Label>
                  <Input
                    id="storeEmail"
                    name="storeEmail"
                    type="email"
                    value={storeSettings.storeEmail}
                    onChange={handleStoreSettingChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Store Phone</Label>
                  <Input
                    id="storePhone"
                    name="storePhone"
                    value={storeSettings.storePhone}
                    onChange={handleStoreSettingChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeAddress">Store Address</Label>
                  <Input
                    id="storeAddress"
                    name="storeAddress"
                    value={storeSettings.storeAddress}
                    onChange={handleStoreSettingChange}
                  />
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-2">
                <Label>Store Currency</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="justify-start">USD ($)</Button>
                  <Button variant="outline" className="justify-start">EUR (€)</Button>
                  <Button variant="outline" className="justify-start">GBP (£)</Button>
                  <Button variant="outline" className="justify-start">JPY (¥)</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
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