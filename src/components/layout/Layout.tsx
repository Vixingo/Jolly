import { Outlet } from 'react-router-dom'
import { useEffect, Suspense, lazy } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setTheme } from '../../store/slices/uiSlice'
import Header from './Header'

// Lazy load heavy components for better performance
const SearchModal = lazy(() => import('../search/SearchModal'))
const CartSidebar = lazy(() => import('../cart/CartSidebar'))
const MobileMenu = lazy(() => import('./MobileMenu'))

export default function Layout() {
  const dispatch = useAppDispatch()
  const { theme } = useAppSelector(state => state.ui)

  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light'
    dispatch(setTheme(savedTheme))
    
    // Apply theme to document
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dispatch])

  useEffect(() => {
    // Apply theme changes to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [theme])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <Outlet />
      </main>
      <Suspense fallback={null}>
        <CartSidebar />
      </Suspense>
      <Suspense fallback={null}>
        <SearchModal />
      </Suspense>
      <Suspense fallback={null}>
        <MobileMenu />
      </Suspense>
    </div>
  )
}
