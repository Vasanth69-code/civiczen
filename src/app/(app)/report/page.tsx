import { Header } from "@/components/header";
import { ReportIssueForm } from "@/components/report-issue-form";

export default function ReportPage() {
  return (
    <>
      <Header title="Report an Issue" />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
            <ReportIssueForm />
        </div>
      </main>
    </>
  );
}
