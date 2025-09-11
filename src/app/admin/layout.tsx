import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { LanguageProvider } from "@/context/language-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <AdminSidebar />
      <SidebarInset>{children}</SidebarInset>
    </LanguageProvider>
  );
}
