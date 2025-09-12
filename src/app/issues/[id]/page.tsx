
"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { IssueDetails } from "@/components/issue-details";
import { SidebarInset } from "@/components/ui/sidebar";
import { useIssues } from "@/context/issue-context";
import { notFound, usePathname, useParams } from 'next/navigation';

export default function IssueDetailsPage() {
  const { issues } = useIssues();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const issue = issues.find(i => i.id === id);

  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  if (!issue) {
    notFound();
  }

  const headerTitle = isAdminPage ? `Issue #${issue.id}` : "issue_details";

  return (
    <>
      {!isAdminPage && <AppSidebar />}
      <SidebarInset>
        <Header title={headerTitle} />
        <main className="flex-1 p-4 md:p-6">
          <IssueDetails issue={issue} />
        </main>
      </SidebarInset>
    </>
  );
}
