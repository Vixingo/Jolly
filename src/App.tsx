import React, { Suspense } from "react";
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
import { DynamicFavicon } from "./components/DynamicFavicon";
import Preloader from "./components/Preloader";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import "./App.css";

// Lazy load page components
const HomePage = React.lazy(() => import("./pages/HomePage"));
const ProductsPage = React.lazy(() => import("./pages/ProductsPage"));
const ProductPage = React.lazy(() => import("./pages/ProductPage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const SignupPage = React.lazy(() => import("./pages/SignupPage"));
const CheckoutPage = React.lazy(() => import("./pages/CheckoutPage"));
const ThankYouPage = React.lazy(() => import("./pages/ThankYouPage"));
const PaymentSuccessPage = React.lazy(() => import("./pages/PaymentSuccessPage"));
const PaymentFailedPage = React.lazy(() => import("./pages/PaymentFailedPage"));
const TrackOrderPage = React.lazy(() => import("./pages/TrackOrderPage"));

// Lazy load admin components
const AdminLayout = React.lazy(() => import("./components/layout/AdminLayout"));
const AdminDashboard = React.lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts = React.lazy(() => import("./pages/admin/Products"));
const AdminUsers = React.lazy(() => import("./pages/admin/Users"));
const AdminOrders = React.lazy(() => import("./pages/admin/Orders"));
const AdminAPI = React.lazy(() => import("./pages/admin/AdminAPI"));
const AdminSettings = React.lazy(() => import("./pages/admin/Settings"));

// Loading fallback component
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
);

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

                            <PreloaderWrapper />


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
            <Suspense fallback={<PageLoader />}>
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
            </Suspense>

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
