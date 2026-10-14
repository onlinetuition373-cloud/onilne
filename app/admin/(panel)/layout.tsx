import { AdminStoreProvider } from "@/components/admin/AdminStore";
import { AdminShell } from "@/components/admin/AdminShell";

// TODO(backend): protect every /admin route. Add middleware.ts that checks the admin session
// and an `admins` table (or a role claim), redirecting anyone else to /admin/login.
export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminStoreProvider>
      <AdminShell>{children}</AdminShell>
    </AdminStoreProvider>
  );
}
