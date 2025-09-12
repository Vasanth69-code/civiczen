
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { SidebarInset } from "@/components/ui/sidebar";
import { AllReportsClient } from "@/components/all-reports-client";

export default function AllReportsPage() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Header title="All Issue Reports" />
        <main className="flex-1 p-4 md:p-6">
          <AllReportsClient />
        </main>
      </SidebarInset>
    </>
  );
}
