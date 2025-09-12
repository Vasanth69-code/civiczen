
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { IssuesTable } from "@/components/issues-table";
import { SidebarInset } from "@/components/ui/sidebar";
import { mockIssues } from "@/lib/placeholder-data";

export default function AllReportsPage() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Header title="All Issue Reports" />
        <main className="flex-1 p-4 md:p-6">
          <IssuesTable issues={mockIssues} title="All Issue Reports" />
        </main>
      </SidebarInset>
    </>
  );
}
