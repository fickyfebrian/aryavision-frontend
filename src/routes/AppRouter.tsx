import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '../components/layout';
import { HomePage } from '../features/home';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
