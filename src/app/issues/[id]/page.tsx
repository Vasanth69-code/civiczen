import { Header } from "@/components/header";
import { IssueDetails } from "@/components/issue-details";
import { mockIssues } from "@/lib/placeholder-data";
import { notFound } from 'next/navigation';

export default function IssueDetailsPage({ params }: { params: { id: string } }) {
  const issue = mockIssues.find(i => i.id === params.id);

  if (!issue) {
    notFound();
  }

  return (
    <>
      <Header title="issue_details" />
      <main className="flex-1 p-4 md:p-6">
        <IssueDetails issue={issue} />
      </main>
    </>
  );
}
