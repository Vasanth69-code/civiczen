
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { IssuesTable } from "@/components/issues-table";
import { SidebarInset } from "@/components/ui/sidebar";
import { mockIssues, currentUser } from "@/lib/placeholder-data";

export default function IssuesPage() {
  const userIssues = mockIssues.filter(issue => issue.reporter.id === currentUser.id);

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Header title="My Submitted Issues" />
        <main className="flex-1 p-4 md:p-6">
          <IssuesTable issues={userIssues} title="My Submitted Issues" />
        </main>
      </SidebarInset>
    </>
  );
}
