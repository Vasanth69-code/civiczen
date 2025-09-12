
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { SidebarInset } from "@/components/ui/sidebar";
import { CommunityMembersClient } from "@/components/community-members-client";

export default function CommunityPage() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Header title="community_members" />
        <main className="flex-1 p-4 md:p-6">
            <CommunityMembersClient />
        </main>
      </SidebarInset>
    </>
  );
}
