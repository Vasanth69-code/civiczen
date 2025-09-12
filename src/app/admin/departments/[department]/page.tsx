
import { Header } from "@/components/header";
import { IssuesTable } from "@/components/issues-table";
import { mockIssues } from "@/lib/placeholder-data";
import { notFound } from "next/navigation";

export default function DepartmentIssuesPage({ params }: { params: { department: string } }) {
  const departmentName = decodeURIComponent(params.department);
  const departmentIssues = mockIssues.filter(
    (issue) => issue.department === departmentName
  );

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

// Optional: Generate static paths for better performance
export async function generateStaticParams() {
  const departments = [...new Set(mockIssues.map(issue => issue.department))];

  return departments.map(department => ({
    department: encodeURIComponent(department),
  }));
}
