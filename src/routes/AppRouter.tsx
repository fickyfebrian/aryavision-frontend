import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "../components/layout";
import { HomePage } from "../features/home";
import { CatalogPage } from "../features/catalog";
import { RecommendationPage } from "../features/recommendation";
import { ProductDetailPage } from "../features/product";
import { LoginPage } from "../features/auth";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRouter = () => {
  return (
    <BrowserRouter>
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
          <Route
            index
            element={
              <div style={{ padding: "2rem" }}>
                <h1>Admin Dashboard</h1>
                <p>Welcome to Admin Panel</p>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
