import { Outlet } from 'react-router-dom';
import { Navbar, Footer } from '@/components';

export const PublicLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};
