
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { ReportIssueForm } from "@/components/report-issue-form";
import { SidebarInset } from "@/components/ui/sidebar";

export default function ReportPage() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Header title="Report an Issue" />
        <main className="flex-1 p-4 mdp-6">
          <div className="mx-auto max-w-4xl">
              <ReportIssueForm />
          </div>
        </main>
      </SidebarInset>
    </>
  );
}
