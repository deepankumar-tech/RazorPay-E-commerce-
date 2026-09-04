import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OliverProvider } from './context/OliverContext';

import { CustomerLayout } from './components/layout/CustomerLayout';
import { MerchantLayout } from './components/merchant/MerchantLayout';
import { RoleRoute, ProtectedRoute } from './components/layout/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AccessDeniedPage } from './pages/AccessDeniedPage';

// Customer Role Pages
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { AIShoppingPage } from './pages/AIShoppingPage';
import { ProductCatalogPage } from './pages/ProductCatalogPage';
import { CustomerCategoriesPage } from './pages/CustomerCategoriesPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { CustomerWishlistPage } from './pages/CustomerWishlistPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

// Dedicated Merchant Revenue OS Pages
import { MerchantOverviewPage } from './pages/merchant/MerchantOverviewPage';
import { MerchantCopilotPage } from './pages/merchant/MerchantCopilotPage';
import { MerchantProductsPage } from './pages/merchant/MerchantProductsPage';
import { MerchantAiCatalogPage } from './pages/merchant/MerchantAiCatalogPage';
import { MerchantOrdersPage } from './pages/merchant/MerchantOrdersPage';
import { MerchantCustomersPage } from './pages/merchant/MerchantCustomersPage';
import { MerchantAnalyticsPage } from './pages/merchant/MerchantAnalyticsPage';
import { MerchantOpportunitiesPage } from './pages/merchant/MerchantOpportunitiesPage';
import { MerchantUpsellPage } from './pages/merchant/MerchantUpsellPage';
import { MerchantCampaignsPage } from './pages/merchant/MerchantCampaignsPage';
import { MerchantAgenticCommercePage } from './pages/merchant/MerchantAgenticCommercePage';
import { MerchantPoliciesPage } from './pages/merchant/MerchantPoliciesPage';
import { MerchantAuditTrailPage } from './pages/merchant/MerchantAuditTrailPage';
import { MerchantFailureCenterPage } from './pages/merchant/MerchantFailureCenterPage';
import { MerchantSettingsPage } from './pages/merchant/MerchantSettingsPage';

import { PageTransition } from './components/common/PageTransition';

// Auto Role Redirector for Root "/" and Login
const RoleDashboardRedirect: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user) return <Navigate to="/customer/dashboard" replace />;
  if (user.role === 'MERCHANT') return <Navigate to="/merchant/dashboard" replace />;
  return <Navigate to="/customer/dashboard" replace />;
};

export const AppContent: React.FC = () => {
  return (
    <Routes>
      {/* Root & Authentication Routes */}
      <Route path="/" element={<RoleDashboardRedirect />} />
      <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
      <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
      <Route path="/403" element={<PageTransition><AccessDeniedPage /></PageTransition>} />

      {/* Direct Shortcuts */}
      <Route path="/ai-shopping" element={<Navigate to="/customer/ai-assistant" replace />} />
      <Route path="/cart" element={<Navigate to="/customer/cart" replace />} />
      <Route path="/checkout" element={<Navigate to="/customer/checkout" replace />} />
      <Route path="/products" element={<Navigate to="/customer/products" replace />} />
      <Route path="/orders" element={<Navigate to="/customer/orders" replace />} />
      <Route path="/order-success" element={<Navigate to="/customer/order-success" replace />} />

      {/* ================================================= */}
      {/* 1. ONLINE E-COMMERCE STOREFRONT (Customer Layout) */}
      {/* ================================================= */}
      <Route
        path="/customer/*"
        element={
          <CustomerLayout>
            <Routes>
              <Route path="dashboard" element={<CustomerDashboardPage />} />
              <Route path="ai-assistant" element={<AIShoppingPage />} />
              <Route path="products" element={<ProductCatalogPage />} />
              <Route path="categories" element={<CustomerCategoriesPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="orders" element={<OrderHistoryPage />} />
              <Route path="order-success" element={<OrderSuccessPage />} />
              <Route path="wishlist" element={<CustomerWishlistPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/customer/dashboard" replace />} />
            </Routes>
          </CustomerLayout>
        }
      />

      {/* ================================================= */}
      {/* 2. MERCHANT AI REVENUE & AGENTIC COMMERCE HUB     */}
      {/* ================================================= */}
      <Route element={<RoleRoute allowedRoles={['MERCHANT', 'ADMIN']} />}>
        <Route
          path="/merchant/*"
          element={
            <MerchantLayout>
              <Routes>
                <Route path="dashboard" element={<MerchantOverviewPage />} />
                <Route path="copilot" element={<MerchantCopilotPage />} />
                <Route path="products" element={<MerchantProductsPage />} />
                <Route path="orders" element={<MerchantOrdersPage />} />
                <Route path="customers" element={<MerchantCustomersPage />} />
                <Route path="analytics" element={<MerchantAnalyticsPage />} />
                <Route path="opportunities" element={<MerchantOpportunitiesPage />} />
                <Route path="upsell" element={<MerchantUpsellPage />} />
                <Route path="campaigns" element={<MerchantCampaignsPage />} />
                <Route path="ai-catalog" element={<MerchantAiCatalogPage />} />
                <Route path="agentic-commerce" element={<MerchantAgenticCommercePage />} />
                <Route path="policies" element={<MerchantPoliciesPage />} />
                <Route path="inventory" element={<MerchantProductsPage />} />
                <Route path="payments" element={<MerchantOrdersPage />} />
                <Route path="audit" element={<MerchantAuditTrailPage />} />
                <Route path="failure-center" element={<MerchantFailureCenterPage />} />
                <Route path="settings" element={<MerchantSettingsPage />} />
                <Route path="*" element={<Navigate to="/merchant/dashboard" replace />} />
              </Routes>
            </MerchantLayout>
          }
        />
      </Route>

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/customer/dashboard" replace />} />
    </Routes>
  );
};

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <OliverProvider>
            <AppContent />
          </OliverProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
