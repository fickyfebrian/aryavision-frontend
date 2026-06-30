import { Outlet } from 'react-router-dom';

export const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-secondary-background">
      <aside className="w-64 border-r border-border bg-white p-4">
        <div>Sidebar Placeholder</div>
      </aside>
      
      <div className="flex flex-1 flex-col">
        <header className="border-b border-border bg-white p-4">
          <div>Topbar Placeholder</div>
        </header>
        
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
