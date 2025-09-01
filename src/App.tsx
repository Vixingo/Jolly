import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'
import { store } from './store'
import { AuthProvider } from './contexts/AuthContext'
import { StoreSettingsProvider } from './contexts/StoreSettingsContext'
import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CheckoutPage from './pages/CheckoutPage'
import ThankYouPage from './pages/ThankYouPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import PaymentFailedPage from './pages/PaymentFailedPage'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminUsers from './pages/admin/Users'

import AdminSettings from './pages/admin/Settings'
import AdminOrders from './pages/admin/Orders'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import './App.css'
import ProductsPage from './pages/ProductsPage'

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <StoreSettingsProvider>
          <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="product/:id" element={<ProductPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignupPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="thank-you" element={<ThankYouPage />} />
                <Route path="payment-success" element={<PaymentSuccessPage />} />
                <Route path="payment-failed" element={<PaymentFailedPage />} />
              </Route>
              
              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="settings" element={<AdminSettings />} />

              </Route>
            </Routes>
            
            <Toaster 
              position="top-right"
              richColors
              closeButton
              duration={5000}
            />
          </div>
          </Router>
        </StoreSettingsProvider>
      </AuthProvider>
    </Provider>
  )
}

export default App
