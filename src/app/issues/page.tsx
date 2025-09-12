
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { SidebarInset } from "@/components/ui/sidebar";
import { MyIssuesClient } from "@/components/my-issues-client";

export default function IssuesPage() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Header title="My Submitted Issues" />
        <main className="flex-1 p-4 md:p-6">
          <MyIssuesClient />
        </main>
      </SidebarInset>
    </>
  );
}
