import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { store } from "./store";
import { AuthProvider } from "./contexts/AuthContext";
import {
    StoreSettingsProvider,
    useStoreName,
} from "./contexts/StoreSettingsContext";
import { LoadingProvider, useLoading } from "./contexts/LoadingContext";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/layout/AdminLayout";
import { DynamicFavicon } from "./components/DynamicFavicon";
import Preloader from "./components/Preloader";
import FacebookPixel from "./components/FacebookPixel";
import FacebookPixelTest from "./components/FacebookPixelTest";
import FacebookSettingsDebug from "./components/FacebookSettingsDebug";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import ThankYouPage from "./pages/ThankYouPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentFailedPage from "./pages/PaymentFailedPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminUsers from "./pages/admin/Users";
import AdminAPI from "./pages/admin/AdminAPI";
import AdminSettings from "./pages/admin/Settings";
import AdminOrders from "./pages/admin/Orders";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import "./App.css";
import ProductsPage from "./pages/ProductsPage";

// Component to update document title based on store name
function DocumentTitle() {
    const storeName = useStoreName();

    React.useEffect(() => {
        if (storeName) {
            document.title = storeName;
        }
    }, [storeName]);

    return null;
}

// PreloaderWrapper component to use the loading context
function PreloaderWrapper() {
    const { isLoading } = useLoading();
    return <Preloader isLoading={isLoading} />;
}

function App() {
    return (
        <Provider store={store}>
            <AuthProvider>
                <Router>
                    <StoreSettingsProvider>
                        <LoadingProvider>
                            <DocumentTitle />
                            <DynamicFavicon />
                            <FacebookPixel />
                            <PreloaderWrapper />
                            {/* <FacebookPixelTest /> */}
                            {/* <FacebookSettingsDebug /> */}
                            <AppContent />
                        </LoadingProvider>
                    </StoreSettingsProvider>
                </Router>
            </AuthProvider>
        </Provider>
    );
}

// Separate component to use the loading context
function AppContent() {
    const { isLoading } = useLoading();

    return (
        <div
            className="min-h-screen bg-background"
            style={{ display: isLoading ? "none" : "block" }}
        >
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
                    <Route
                        path="payment-success"
                        element={<PaymentSuccessPage />}
                    />
                    <Route
                        path="payment-failed"
                        element={<PaymentFailedPage />}
                    />
                    <Route path="track-order" element={<TrackOrderPage />} />
                </Route>

                {/* Admin routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute requireAdmin>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="api" element={<AdminAPI />} />
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
    );
}

export default App;
