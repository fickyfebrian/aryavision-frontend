import { Outlet } from 'react-router-dom';

export const PublicLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-white p-4">
        <div>Navbar Placeholder</div>
      </header>
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <footer className="border-t border-border bg-white p-4 mt-auto">
        <div>Footer Placeholder</div>
      </footer>
    </div>
  );
};
