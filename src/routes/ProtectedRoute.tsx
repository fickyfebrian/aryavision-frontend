import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Sederhana: asalkan ada token, anggap valid. 
  // Nanti bisa diextend untuk cek validitas token via /auth/me jika perlu.
  return <Outlet />;
};
