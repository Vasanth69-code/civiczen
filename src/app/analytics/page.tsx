
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { SidebarInset } from "@/components/ui/sidebar";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";


export default function AnalyticsPage() {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/admin');

  return (
    <>
      {isAdminPage ? <AdminSidebar /> : <AppSidebar />}
      <SidebarInset>
        <Header title="Analytics Dashboard" />
        <main className="flex-1 p-4 md:p-6">
          <AnalyticsDashboard />
        </main>
      </SidebarInset>
    </>
  );
}
