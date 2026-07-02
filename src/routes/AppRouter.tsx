import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '../components/layout';
import { HomePage } from '../features/home';
import { CatalogPage } from '../features/catalog';

import { RecommendationPage } from '../features/recommendation';
import { ProductDetailPage } from '../features/product';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/recommendation" element={<RecommendationPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
