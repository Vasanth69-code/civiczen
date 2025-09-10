import { Header } from "@/components/header";
import { AdminDashboard } from "@/components/admin-dashboard";

export default function DashboardPage() {
  return (
    <>
      <Header title="Admin Dashboard" />
      <main className="flex-1 p-4 md:p-6">
        <AdminDashboard />
      </main>
    </>
  );
}
