import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import { Progress } from '../../components/ui/progress'
import { supabase } from '../../lib/supabase'
import {
  LayoutDashboard,
  DollarSign,
  Users,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  Package,
  Clock,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  LineChart,
  ArrowRight
} from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    revenueChange: 15.3, // Placeholder data
    ordersChange: 8.2,   // Placeholder data
    usersChange: 12.5,   // Placeholder data
    lowStockProducts: 0
  })
  
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // Fetch total users
        const { count: usersCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
        
        // Fetch total products
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
        
        // Fetch low stock products
        const { count: lowStockCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .lt('stock', 10)
        
        // Fetch total orders and revenue
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)
        
        if (ordersError) throw ordersError
        
        // Calculate total revenue from all orders
        const { data: allOrders } = await supabase
          .from('orders')
          .select('total')
        
        const totalRevenue = allOrders?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0
        
        setStats({
          ...stats,
          totalRevenue,
          totalOrders: allOrders?.length || 0,
          totalUsers: usersCount || 0,
          totalProducts: productsCount || 0,
          lowStockProducts: lowStockCount || 0
        })
        
        setRecentOrders(orders ? orders as Array<{
          id: number,
          created_at: string,
          total: number,
          status: string,
        }> | undefined: [])
      } catch (error: unknown) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)

      }
    }
    
    fetchDashboardData()
  }, [])

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    change, 
    changeType = 'positive', 
    format = 'number' 
  }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    change: number;
    changeType?: 'positive' | 'negative' | 'neutral';
    format?: 'number' | 'currency';
  }) => {
    const formattedValue = format === 'currency' 
      ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
      : value.toLocaleString()
    
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formattedValue}</div>
          <div className="flex items-center space-x-2 mt-2 text-xs">
            {changeType === 'positive' ? (
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-rose-500" />
            )}
            <span className={changeType === 'positive' ? 'text-emerald-500' : 'text-rose-500'}>
              {change}% from last month
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your store's performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Download Report
          </Button>
          <Button size="sm">
            Refresh Data
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Total Revenue" 
              value={stats.totalRevenue} 
              icon={<DollarSign className="h-4 w-4 text-primary" />}
              change={stats.revenueChange}
              changeType="positive"
              format="currency"
            />
            <StatCard 
              title="Orders" 
              value={stats.totalOrders} 
              icon={<ShoppingBag className="h-4 w-4 text-primary" />}
              change={stats.ordersChange}
              changeType="positive"
            />
            <StatCard 
              title="Customers" 
              value={stats.totalUsers} 
              icon={<Users className="h-4 w-4 text-primary" />}
              change={stats.usersChange}
              changeType="positive"
            />
            <StatCard 
              title="Products" 
              value={stats.totalProducts} 
              icon={<Package className="h-4 w-4 text-primary" />}
              change={0}
              changeType="neutral"
            />
          </div>
          
          {/* Recent Orders and Inventory */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Recent Orders */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest 5 orders from your store</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-40">
                    <p>Loading orders...</p>
                  </div>
                ) : recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={(order as { id: string }).id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="space-y-1">
                          <p className="font-medium">{(order as { id: string }).id.substring(0, 8)}...</p>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {new Date((order as { created_at: string }).created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${parseFloat((order as { total: string }).total).toFixed(2)}</p>
                          <Badge variant={(order as { status: string }).status === 'delivered' ? 'default' :
                                        (order as { status: string }).status === 'shipped' ? 'secondary' :
                                        (order as { status: string }).status === 'processing' ? 'outline' :
                                        (order as { status: string }).status === 'cancelled' ? 'destructive' : 'default'}>
                            {((order as { status: string }).status.charAt(0).toUpperCase() + (order as { status: string }).status.slice(1))}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 space-y-2">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No orders yet</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View All Orders
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            {/* Inventory Status */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
                <CardDescription>Stock levels and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Low Stock Products</span>
                    <Badge variant="outline">{stats.lowStockProducts}</Badge>
                  </div>
                  <Progress value={(stats.lowStockProducts / stats.totalProducts) * 100} className="h-2" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Low Stock Alert</p>
                        <p className="text-xs text-muted-foreground">{stats.lowStockProducts} products below threshold</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Healthy Stock</p>
                        <p className="text-xs text-muted-foreground">{stats.totalProducts - stats.lowStockProducts} products with good inventory</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Manage Inventory
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Monthly revenue for the current year</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-2">
                <BarChart3 className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground">Sales chart visualization would appear here</p>
                <p className="text-xs text-muted-foreground">Implement with a charting library like Recharts or Chart.js</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Detailed performance metrics and trends</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-2">
                <LineChart className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground">Analytics dashboard would appear here</p>
                <p className="text-xs text-muted-foreground">Implement with analytics visualization components</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and view store reports</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-2">
                <BarChart3 className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground">Reports interface would appear here</p>
                <p className="text-xs text-muted-foreground">Implement with report generation functionality</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>System alerts and updates</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-2">
                <Bell className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground">Notifications panel would appear here</p>
                <p className="text-xs text-muted-foreground">Implement with notification system</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Import Bell icon at the top of the file
import { Bell } from 'lucide-react'