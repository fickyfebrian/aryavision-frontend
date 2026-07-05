import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "../components/layout";
import { AdminLayout } from "../layouts/AdminLayout";
import { HomePage } from "../features/home";
import { CatalogPage } from "../features/catalog";
import { RecommendationPage } from "../features/recommendation";
import { ProductDetailPage } from "../features/product";
import { LoginPage } from "../features/auth";
import { DashboardPage, ProductsPage } from "../features/admin";
import { ProtectedRoute } from "./ProtectedRoute";
import { ScrollToTop } from "../components/common";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/recommendation" element={<RecommendationPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
