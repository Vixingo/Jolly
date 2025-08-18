import type { ReactNode } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useAppSelector } from '../../store/hooks'
import { Button } from '../ui/button'
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Upload
} from 'lucide-react'

interface AdminLayoutProps {
  children?: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation()
  const { signOut } = useAuth()
  const { profile } = useAppSelector(state => state.auth)
  
  // Verify user is admin
  const isAdmin = profile?.role === 'admin'
  
  if (!isAdmin) {
    return <div className="p-8 text-center">You don't have permission to access this area.</div>
  }
  
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Analytics', href: '/admin/pixels', icon: BarChart3 },
    { name: 'File Uploads', href: '/admin/file-uploads', icon: Upload },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow border-r border-border bg-card pt-5">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link to="/" className="text-xl font-bold text-primary">Jolly Admin</Link>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href !== '/admin' && location.pathname.startsWith(item.href))
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                      aria-hidden="true"
                    />
                    {item.name}
                    {isActive && <ChevronRight className="ml-auto h-4 w-4 text-primary" />}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-border p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-foreground">{profile?.full_name}</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-auto"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile sidebar */}
      <div className="md:hidden bg-card border-b border-border p-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary">Jolly Admin</Link>
        <div className="flex space-x-2">
          {/* Mobile navigation dropdown could be added here */}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}