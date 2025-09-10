import { Header } from "@/components/header";
import { LeaderboardClient } from "@/components/leaderboard-client";
import { mockUsers } from "@/lib/placeholder-data";

export default function LeaderboardPage() {
  return (
    <>
      <Header title="Community Leaderboard" />
      <main className="flex-1 p-4 md:p-6">
        <LeaderboardClient users={mockUsers} />
      </main>
    </>
  );
}
