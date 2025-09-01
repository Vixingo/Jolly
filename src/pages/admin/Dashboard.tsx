import { useState, useEffect, useCallback } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { supabase } from "../../lib/supabase";
import { useFormatCurrency } from "../../lib/utils";
import {
    DollarSign,
    Users,
    ShoppingBag,
    TrendingUp,
    TrendingDown,
    Package,
    AlertCircle,
    CheckCircle2,
    BarChart3,
    LineChart,
    ArrowRight,
} from "lucide-react";

export default function Dashboard() {
    const formatCurrency = useFormatCurrency();
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
        revenueChange: 15.3, // Placeholder data
        ordersChange: 8.2, // Placeholder data
        customersChange: 12.5, // Placeholder data
        lowStockProducts: 0,
    });

    const [recentOrders, setRecentOrders] = useState<
        Array<{
            id: string;
            total: string;
            status: string;
            created_at: string;
            user_name?: string;
            user_email?: string;
            customer_phone?: string;
            items?: any[];
        }>
    >([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [showCustomerDetails, setShowCustomerDetails] = useState(false);
    const [customerStats, setCustomerStats] = useState<
        Array<{
            phone: string;
            name: string;
            email: string;
            orderCount: number;
            totalValue: number;
        }>
    >([]);

    const fetchCustomerStats = useCallback(async () => {
        try {
            const { data: orders } = await supabase
                .from("orders")
                .select("customer_phone, total, user_id")
                .not("customer_phone", "is", null);

            if (orders) {
                const phoneStats = new Map();

                for (const order of orders) {
                    const phone = order.customer_phone;
                    if (!phoneStats.has(phone)) {
                        phoneStats.set(phone, {
                            phone,
                            orderCount: 0,
                            totalValue: 0,
                            name: "Guest User",
                            email: "",
                        });
                    }

                    const stat = phoneStats.get(phone);
                    stat.orderCount += 1;
                    stat.totalValue += parseFloat(order.total);

                    // Fetch user info if available
                    if (order.user_id && stat.name === "Guest User") {
                        const { data: userData } = await supabase
                            .from("users")
                            .select("full_name, email")
                            .eq("id", order.user_id)
                            .single();

                        if (userData) {
                            stat.name = userData.full_name || "Guest User";
                            stat.email = userData.email || "";
                        }
                    }
                }

                const sortedStats = Array.from(phoneStats.values()).sort(
                    (a, b) => b.totalValue - a.totalValue
                );

                setCustomerStats(sortedStats);
            }
        } catch (error) {
            console.error("Error fetching customer stats:", error);
        }
    }, []);

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            // Fetch total users
            await supabase
                .from("users")
                .select("*", { count: "exact", head: true });

            // Fetch total products
            const { count: productsCount } = await supabase
                .from("products")
                .select("*", { count: "exact", head: true });

            // Fetch low stock products
            const { count: lowStockCount } = await supabase
                .from("products")
                .select("*", { count: "exact", head: true })
                .lt("stock", 10);

            // Fetch total orders and revenue with customer information
            const { data: orders, error: ordersError } = await supabase
                .from("orders")
                .select("*, customer_phone, items")
                .order("created_at", { ascending: false })
                .limit(5);

            if (ordersError) throw ordersError;

            // Fetch user information for each order
            const ordersWithUserInfo = orders
                ? await Promise.all(
                      orders.map(async (order) => {
                          let userData = null;

                          if (order.user_id) {
                              const { data, error: userError } = await supabase
                                  .from("users")
                                  .select("email, full_name")
                                  .eq("id", order.user_id)
                                  .single();

                              if (!userError && data) {
                                  userData = data;
                              }
                          }

                          return {
                              ...order,
                              user_email: userData?.email || "Guest User",
                              user_name: userData?.full_name || "Guest User",
                              customer_phone: order.customer_phone || "N/A",
                          };
                      })
                  )
                : [];

            // Calculate total revenue from all orders
            const { data: allOrders } = await supabase
                .from("orders")
                .select("total, customer_phone");

            const totalRevenue =
                allOrders?.reduce(
                    (sum, order) => sum + parseFloat(order.total),
                    0
                ) || 0;

            // Calculate unique customers based on phone numbers
            const uniquePhones = new Set(
                allOrders?.map((order) => order.customer_phone).filter(Boolean)
            );

            setStats({
                ...stats,
                totalRevenue,
                totalOrders: allOrders?.length || 0,
                totalCustomers: uniquePhones.size || 0,
                totalProducts: productsCount || 0,
                lowStockProducts: lowStockCount || 0,
            });

            setRecentOrders(ordersWithUserInfo || []);
        } catch (error: unknown) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }, [stats]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const StatCard = ({
        title,
        value,
        icon,
        change,
        changeType = "positive",
        format = "number",
        onClick,
    }: {
        title: string;
        value: number;
        icon: React.ReactNode;
        change: number;
        changeType?: "positive" | "negative" | "neutral";
        format?: "number" | "currency";
        onClick?: () => void;
    }) => {
        const formattedValue =
            format === "currency"
                ? formatCurrency(value)
                : value.toLocaleString();

        return (
            <Card
                className={
                    onClick
                        ? "cursor-pointer hover:shadow-md transition-shadow"
                        : ""
                }
                onClick={onClick}
            >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {title}
                    </CardTitle>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {icon}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formattedValue}</div>
                    <div className="flex items-center space-x-2 mt-2 text-xs">
                        {changeType === "positive" ? (
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                        ) : (
                            <TrendingDown className="h-4 w-4 text-rose-500" />
                        )}
                        <span
                            className={
                                changeType === "positive"
                                    ? "text-emerald-500"
                                    : "text-rose-500"
                            }
                        >
                            {change}% from last month
                        </span>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Dashboard
                    </h2>
                    <p className="text-muted-foreground">
                        Overview of your store's performance
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                        Download Report
                    </Button>
                    <Button size="sm">Refresh Data</Button>
                </div>
            </div>

            <Tabs
                defaultValue="overview"
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-4"
            >
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                    <TabsTrigger value="notifications">
                        Notifications
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    {/* Stats Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Total Revenue"
                            value={stats.totalRevenue}
                            icon={
                                <DollarSign className="h-4 w-4 text-primary" />
                            }
                            change={stats.revenueChange}
                            changeType="positive"
                            format="currency"
                        />
                        <StatCard
                            title="Orders"
                            value={stats.totalOrders}
                            icon={
                                <ShoppingBag className="h-4 w-4 text-primary" />
                            }
                            change={stats.ordersChange}
                            changeType="positive"
                        />
                        <StatCard
                            title="Customers"
                            value={stats.totalCustomers}
                            icon={<Users className="h-4 w-4 text-primary" />}
                            change={stats.customersChange}
                            changeType="positive"
                            onClick={() => {
                                setShowCustomerDetails(true);
                                fetchCustomerStats();
                            }}
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
                                <CardDescription>
                                    Latest 5 orders from your store
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="flex items-center justify-center h-40">
                                        <p>Loading orders...</p>
                                    </div>
                                ) : recentOrders.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentOrders.map((order) => (
                                            <div
                                                key={order.id}
                                                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 hover:bg-gray-50 p-2 rounded cursor-pointer"
                                                onClick={() =>
                                                    (window.location.href = `/admin/orders/${order.id}`)
                                                }
                                            >
                                                <div className="space-y-1 flex-1">
                                                    <p className="font-medium">
                                                        {order.user_name ||
                                                            "Guest User"}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Phone:{" "}
                                                        {order.customer_phone ||
                                                            "N/A"}
                                                    </p>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-xs text-muted-foreground">
                                                            Items:{" "}
                                                            {order.items
                                                                ? order.items
                                                                      .length
                                                                : 0}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            •
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(
                                                                order.created_at
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right flex items-center space-x-2">
                                                    <div>
                                                        <p className="font-medium">
                                                            {formatCurrency(
                                                                parseFloat(
                                                                    order.total
                                                                )
                                                            )}
                                                        </p>
                                                        <Badge
                                                            variant={
                                                                order.status ===
                                                                "delivered"
                                                                    ? "default"
                                                                    : order.status ===
                                                                      "shipped"
                                                                    ? "secondary"
                                                                    : order.status ===
                                                                      "processing"
                                                                    ? "outline"
                                                                    : order.status ===
                                                                      "cancelled"
                                                                    ? "destructive"
                                                                    : "default"
                                                            }
                                                        >
                                                            {order.status
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                order.status.slice(
                                                                    1
                                                                )}
                                                        </Badge>
                                                    </div>
                                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-40 space-y-2">
                                        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                                        <p className="text-muted-foreground">
                                            No orders yet
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                >
                                    View All Orders
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Inventory Status */}
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Inventory Status</CardTitle>
                                <CardDescription>
                                    Stock levels and alerts
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">
                                            Low Stock Products
                                        </span>
                                        <Badge variant="outline">
                                            {stats.lowStockProducts}
                                        </Badge>
                                    </div>
                                    <Progress
                                        value={
                                            (stats.lowStockProducts /
                                                stats.totalProducts) *
                                            100
                                        }
                                        className="h-2"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                                                <AlertCircle className="h-4 w-4 text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Low Stock Alert
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {stats.lowStockProducts}{" "}
                                                    products below threshold
                                                </p>
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
                                                <p className="text-sm font-medium">
                                                    Healthy Stock
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {stats.totalProducts -
                                                        stats.lowStockProducts}{" "}
                                                    products with good inventory
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            View
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                >
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
                            <CardDescription>
                                Monthly revenue for the current year
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-80 flex items-center justify-center">
                            <div className="flex flex-col items-center space-y-2">
                                <BarChart3 className="h-16 w-16 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                    Sales chart visualization would appear here
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Implement with a charting library like
                                    Recharts or Chart.js
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Analytics</CardTitle>
                            <CardDescription>
                                Detailed performance metrics and trends
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-96 flex items-center justify-center">
                            <div className="flex flex-col items-center space-y-2">
                                <LineChart className="h-16 w-16 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                    Analytics dashboard would appear here
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Implement with analytics visualization
                                    components
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="reports" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Reports</CardTitle>
                            <CardDescription>
                                Generate and view store reports
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-96 flex items-center justify-center">
                            <div className="flex flex-col items-center space-y-2">
                                <BarChart3 className="h-16 w-16 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                    Reports interface would appear here
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Implement with report generation
                                    functionality
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>
                                System alerts and updates
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-96 flex items-center justify-center">
                            <div className="flex flex-col items-center space-y-2">
                                <Bell className="h-16 w-16 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                    Notifications panel would appear here
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Implement with notification system
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Customer Details Modal */}
            {showCustomerDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">
                                Customer Details
                            </h2>
                            <Button
                                variant="ghost"
                                onClick={() => setShowCustomerDetails(false)}
                            >
                                ×
                            </Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 px-4 py-2 text-left">
                                            Phone Number
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">
                                            Customer Name
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">
                                            Email
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">
                                            Orders
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">
                                            Total Value
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customerStats.map((customer, index) => (
                                        <tr
                                            key={customer.phone}
                                            className={
                                                index % 2 === 0
                                                    ? "bg-gray-50"
                                                    : "bg-white"
                                            }
                                        >
                                            <td className="border border-gray-300 px-4 py-2">
                                                {customer.phone}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {customer.name}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {customer.email || "N/A"}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {customer.orderCount}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {formatCurrency(
                                                    customer.totalValue
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Import Bell icon at the top of the file
import { Bell } from "lucide-react";
