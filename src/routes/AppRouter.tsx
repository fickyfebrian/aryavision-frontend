import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '../components/layout';
import { HomePage } from '../features/home';
import { CatalogPage } from '../features/catalog';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
