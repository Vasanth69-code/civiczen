
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { LeaderboardClient } from "@/components/leaderboard-client";
import { SidebarInset } from "@/components/ui/sidebar";
import { mockUsers } from "@/lib/placeholder-data";

export default function LeaderboardPage() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Header title="Community Leaderboard" />
        <main className="flex-1 p-4 md:p-6">
          <LeaderboardClient users={mockUsers} />
        </main>
      </SidebarInset>
    </>
  );
}
