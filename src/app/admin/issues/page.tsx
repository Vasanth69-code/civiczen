import { Header } from "@/components/header";
import { IssuesTable } from "@/components/issues-table";
import { mockIssues } from "@/lib/placeholder-data";

export default function AllIssuesPage() {
  return (
    <>
      <Header title="All Issue Reports" />
      <main className="flex-1 p-4 md:p-6">
        <IssuesTable issues={mockIssues} />
      </main>
    </>
  );
}
