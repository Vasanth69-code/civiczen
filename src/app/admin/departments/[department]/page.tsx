
"use client";

import { Header } from "@/components/header";
import { IssuesTable } from "@/components/issues-table";
import { useIssues } from "@/context/issue-context";
import { notFound, useParams } from "next/navigation";

export default function DepartmentIssuesPage() {
  const params = useParams();
  const { issues } = useIssues();
  
  // The param can be an array of strings, so we handle that case.
  const departmentParam = Array.isArray(params.department) ? params.department[0] : params.department;
  const departmentName = decodeURIComponent(departmentParam);

  const departmentIssues = issues.filter(
    (issue) => issue.department === departmentName
  );

  // We keep the notFound logic, but it's less likely to be hit with dynamic departments.
  if (departmentIssues.length === 0) {
    // Or you could show a "No issues for this department" message
    // notFound();
  }

  const title = `${departmentName} Department`;

  return (
    <>
      <Header title={title} />
      <main className="flex-1 p-4 md:p-6">
        <IssuesTable issues={departmentIssues} title={`Issues for ${departmentName}`} />
      </main>
    </>
  );
}
