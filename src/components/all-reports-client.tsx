
"use client";

import { useIssues } from "@/context/issue-context";
import { IssuesTable } from "./issues-table";
import { Skeleton } from "./ui/skeleton";

export function AllReportsClient() {
  const { issues, loading } = useIssues();

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-1/4" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return <IssuesTable issues={issues} title="All Issue Reports" />;
}
