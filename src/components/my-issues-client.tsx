
"use client";

import { useIssues } from "@/context/issue-context";
import { useUser } from "@/context/user-context";
import { IssuesTable } from "./issues-table";
import { Skeleton } from "./ui/skeleton";

export function MyIssuesClient() {
  const { user } = useUser();
  const { issues, loading } = useIssues();

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-1/4" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const userIssues = issues.filter(issue => issue.reporter.id === user.id);

  return <IssuesTable issues={userIssues} title="My Submitted Issues" />;
}
