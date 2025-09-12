
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Header title="Notifications" />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Bell />
                  <span>Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-12">
                  <p>You have no new notifications.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </>
  );
}
