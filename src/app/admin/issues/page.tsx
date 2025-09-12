
"use client";

import { Header } from "@/components/header";
import { IssuesTable } from "@/components/issues-table";
import { useIssues } from "@/context/issue-context";

export default function AllIssuesPage() {
  const { issues } = useIssues();
  
  return (
    <>
      <Header title="All Issue Reports" />
      <main className="flex-1 p-4 md:p-6">
        <IssuesTable issues={issues} title="All Issue Reports" />
      </main>
    </>
  );
}
