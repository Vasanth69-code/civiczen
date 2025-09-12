
"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { IssuesTable } from "@/components/issues-table";
import { SidebarInset } from "@/components/ui/sidebar";
import { useIssues } from "@/context/issue-context";
import { useUser } from "@/context/user-context";

export default function IssuesPage() {
  const { user } = useUser();
  const { issues } = useIssues();
  const userIssues = issues.filter(issue => issue.reporter.id === user.id);

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
