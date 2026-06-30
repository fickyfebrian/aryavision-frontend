import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Welcome to Sistem Rekomendasi Produk CCTV</div>,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
