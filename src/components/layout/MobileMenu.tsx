import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setMobileMenuOpen } from '../../store/slices/uiSlice'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/button'
import { 
  X, 
  Home, 
  Package, 
  User, 
  Settings,
  ShoppingCart,
  Search
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Separator } from '../ui/separator'
import { useStoreLogo, useStoreName } from '@/contexts/StoreSettingsContext'

export default function MobileMenu() {
  const dispatch = useAppDispatch()
  const { mobileMenuOpen } = useAppSelector(state => state.ui)
  const { user, profile, signOut } = useAuth()
  const location = useLocation()
  const storeName = useStoreName()
  const storeLogo = useStoreLogo()
  const isAdmin = profile?.role === 'admin'

  const menuItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/products', label: 'Products', icon: Package },
  ]

  const adminItems = [
    { href: '/admin', label: 'Dashboard', icon: Settings },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/users', label: 'Users', icon: User },
    { href: '/admin/pixels', label: 'Pixels', icon: Settings },
  ]

  if (!mobileMenuOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={() => dispatch(setMobileMenuOpen(false))}
      />
      
      {/* Menu */}
      <div className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-background shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center space-x-2">
              {/* Logo */}
          <Link to="/" className="flex items-center">
            {storeLogo ? (
              <img 
                src={storeLogo} 
                alt={storeName} 
                className="h-10 w-auto max-w-[200px] object-contain"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-foreground">{storeName}</span>
              </div>
            )}
          </Link>
              <span className="text-lg font-bold text-foreground">{storeName}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(setMobileMenuOpen(false))}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}

            {isAdmin && (
              <>
                <Separator className="my-4" />
                <div className="px-3 py-2">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Admin
                  </h3>
                </div>
                {adminItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.href
                  
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => dispatch(setMobileMenuOpen(false))}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </>
            )}
          </nav>

          {/* Footer */}
          <div className="border-t p-4 space-y-4">
          
            {/* <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  dispatch(setMobileMenuOpen(false))
                  // Add cart toggle logic here
                }}
                className="w-full"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  dispatch(setMobileMenuOpen(false))
                  // Add search toggle logic here
                }}
                className="w-full"
              >
                <Search className="h-4 w-4 mr-2" />
                Track Order
              </Button>
            </div> */}

           
            {user ? (
              <div className="space-y-3">
                <div className="px-3 py-2 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-foreground">
                    {profile?.full_name || user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {profile?.role === 'admin' ? 'Administrator' : 'Customer'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    signOut()
                    dispatch(setMobileMenuOpen(false))
                  }}
                  className="w-full"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button asChild size="sm" className="w-full">
                <Link to="tel:01711730819" onClick={() => dispatch(setMobileMenuOpen(false))}>
                কল করুন 
                ০১৭১১-৭৩০৮১৯
                </Link>
              </Button>
            )}
          </div>

        </div>
      </div>
    </>
  )
}
