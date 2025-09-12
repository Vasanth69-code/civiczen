
import { AppSidebar } from "@/components/app-sidebar";
import { DailyChallenge } from "@/components/daily-challenge";
import { Header } from "@/components/header";
import { ReportIssueForm } from "@/components/report-issue-form";
import { SidebarInset } from "@/components/ui/sidebar";

export default function ReportPage() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Header title="Report an Issue" />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ReportIssueForm />
            </div>
            <div className="lg:col-span-1">
              <DailyChallenge />
            </div>
          </div>
        </main>
      </SidebarInset>
    </>
  );
}
