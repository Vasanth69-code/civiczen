import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminSidebar />
      <SidebarInset>{children}</SidebarInset>
    </>
  );
}
