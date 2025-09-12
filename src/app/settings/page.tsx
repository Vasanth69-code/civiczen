
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { SidebarInset } from "@/components/ui/sidebar";
import { UserSettingsForm } from "@/components/user-settings-form";

export default function SettingsPage() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Header title="settings" />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-4xl">
            <UserSettingsForm />
          </div>
        </main>
      </SidebarInset>
    </>
  );
}
