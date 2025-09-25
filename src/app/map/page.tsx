
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { SidebarInset } from "@/components/ui/sidebar";
import { IssuesMap } from "@/components/issues-map";

export default function MapPage() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Header title="Issues Map" />
        <main className="flex-1 flex flex-col">
            <IssuesMap />
        </main>
      </SidebarInset>
    </>
  );
}
