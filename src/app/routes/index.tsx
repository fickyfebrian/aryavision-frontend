import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { PublicLayout, AdminLayout } from '@/layouts';

// Placeholder components using MUI Typography (no actual page implementation)
const Home = () => <Typography variant="h2">Home</Typography>;
const Catalog = () => <Typography variant="h2">Catalog</Typography>;
const ProductDetail = () => <Typography variant="h2">Product Detail</Typography>;
const Recommendation = () => <Typography variant="h2">Recommendation</Typography>;
const LoginAdmin = () => <Typography variant="h2">Login Admin</Typography>;

const Dashboard = () => <Typography variant="h2">Dashboard</Typography>;
const Products = () => <Typography variant="h2">Products</Typography>;

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'catalog',
        element: <Catalog />,
      },
      {
        path: 'product/:id',
        element: <ProductDetail />,
      },
      {
        path: 'recommendation',
        element: <Recommendation />,
      },
      {
        path: 'admin/login',
        element: <LoginAdmin />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'products',
        element: <Products />,
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
