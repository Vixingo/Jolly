import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setTheme } from "../../store/slices/uiSlice";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Separator } from "../ui/separator";
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    Settings,
    LogOut,
    Menu,
    Sun,
    Moon,
    ChevronRight,
} from "lucide-react";

export default function AdminLayout() {
    const dispatch = useAppDispatch();
    const { theme } = useAppSelector((state) => state.ui);
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        // Check for saved theme preference or default to light
        const savedTheme =
            (localStorage.getItem("theme") as "light" | "dark") || "light";
        dispatch(setTheme(savedTheme));

        // Apply theme to document
        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [dispatch]);

    useEffect(() => {
        // Apply theme changes to document
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [theme]);

    const handleSignOut = () => {
        signOut();
        navigate("/login");
    };

    const navItems = [
        {
            name: "Dashboard",
            path: "/admin",
            icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
            name: "Products",
            path: "/admin/products",
            icon: <Package className="h-5 w-5" />,
        },
        {
            name: "Users",
            path: "/admin/users",
            icon: <Users className="h-5 w-5" />,
        },
        {
            name: "Orders",
            path: "/admin/orders",
            icon: <ShoppingCart className="h-5 w-5" />,
        },
        {
            name: "Settings",
            path: "/admin/settings",
            icon: <Settings className="h-5 w-5" />,
        },
    ];

    const NavItem = ({
        item,
        mobile = false,
    }: {
        item: { name: string; path: string; icon: React.ReactElement };
        mobile?: boolean;
    }) => (
        <NavLink
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2 rounded-md transition-colors
        ${
            isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
        }
        ${mobile ? "justify-between" : ""}
      `}
            onClick={() => mobile && setIsMobileOpen(false)}
        >
            <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.name}</span>
            </div>
            {mobile && <ChevronRight className="h-4 w-4" />}
        </NavLink>
    );

    return (
        <div className="min-h-screen bg-background flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r bg-card p-4 h-screen sticky top-0">
                <div className="flex items-center gap-2 px-2 py-3">
                    <Package className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold">Jolly Admin</span>
                </div>

                <Separator className="my-4" />

                <nav className="space-y-1 flex-1">
                    {navItems.map((item) => (
                        <NavItem key={item.path} item={item} />
                    ))}
                </nav>

                <div className="mt-auto space-y-4 pt-4">
                    <Separator />
                    <div className="flex items-center justify-between px-2">
                        <span className="text-sm text-muted-foreground">
                            Theme
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                dispatch(
                                    setTheme(
                                        theme === "light" ? "dark" : "light"
                                    )
                                )
                            }
                        >
                            {theme === "light" ? (
                                <Moon className="h-5 w-5" />
                            ) : (
                                <Sun className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={handleSignOut}
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                    </Button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Package className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold">Jolly Admin</span>
                </div>

                <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="left"
                        className="w-[80%] sm:w-[350px] p-0"
                    >
                        <div className="flex flex-col h-full">
                            <div className="flex items-center gap-2 p-4 border-b">
                                <Package className="h-6 w-6 text-primary" />
                                <span className="text-xl font-bold">
                                    Jolly Admin
                                </span>
                            </div>

                            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                                {navItems.map((item) => (
                                    <NavItem
                                        key={item.path}
                                        item={item}
                                        mobile
                                    />
                                ))}
                            </nav>

                            <div className="p-4 border-t space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Theme
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            dispatch(
                                                setTheme(
                                                    theme === "light"
                                                        ? "dark"
                                                        : "light"
                                                )
                                            )
                                        }
                                    >
                                        {theme === "light" ? (
                                            <Moon className="h-5 w-5" />
                                        ) : (
                                            <Sun className="h-5 w-5" />
                                        )}
                                    </Button>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-2"
                                    onClick={handleSignOut}
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Sign out</span>
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 md:pt-6 md:pb-12 md:ml-0 mt-16 md:mt-0">
                <Outlet />
            </main>
        </div>
    );
}
