
"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { IssuesTable } from "@/components/issues-table";
import { SidebarInset } from "@/components/ui/sidebar";
import { useIssues } from "@/context/issue-context";

export default function AllReportsPage() {
  const { issues } = useIssues();

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Header title="All Issue Reports" />
        <main className="flex-1 p-4 md:p-6">
          <IssuesTable issues={issues} title="All Issue Reports" />
        </main>
      </SidebarInset>
    </>
  );
}
