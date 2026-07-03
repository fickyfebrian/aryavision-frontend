import { Outlet } from "react-router-dom";
import { Sidebar, Topbar } from "@/components";

export const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-secondary-background">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
