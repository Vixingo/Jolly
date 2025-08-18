import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'
import { store } from './store'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CheckoutPage from './pages/CheckoutPage'
import ThankYouPage from './pages/ThankYouPage'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminUsers from './pages/admin/Users'
import AdminPixels from './pages/admin/Pixels'
import AdminSettings from './pages/admin/Settings'
import FileUploads from './pages/admin/FileUploads'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import './App.css'

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="product/:id" element={<ProductPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignupPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="thank-you" element={<ThankYouPage />} />
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
                <Route path="pixels" element={<AdminPixels />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="file-uploads" element={<FileUploads />} />
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
      </AuthProvider>
    </Provider>
  )
}

export default App
