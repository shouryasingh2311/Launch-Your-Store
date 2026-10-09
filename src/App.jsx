import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './components/ui/Toast'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { WizardPage } from './pages/WizardPage'
import { StorefrontPage } from './pages/StorefrontPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { AdminProductsPage } from './pages/AdminProductsPage'
import { AdminOrdersPage } from './pages/AdminOrdersPage'
import { AdminSettingsPage } from './pages/AdminSettingsPage'
import { NotFoundPage } from './pages/NotFoundPage'

export function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Auth */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* 5-Step Storefront Setup Wizard */}
          <Route path="/onboarding" element={<WizardPage />} />

          {/* Public Live Storefront (Tenant resolved via :slug) */}
          <Route path="/s/:slug" element={<StorefrontPage />} />

          {/* Merchant Admin Operations */}
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />

          {/* Fallback 404 */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
