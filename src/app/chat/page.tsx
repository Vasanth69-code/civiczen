
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { SidebarInset } from "@/components/ui/sidebar";
import { ChatClient } from "@/components/chat-client";

export default function ChatPage() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Header title="community_chat" />
        <main className="flex-1 p-4 md:p-6 flex flex-col">
          <ChatClient />
        </main>
      </SidebarInset>
    </>
  );
}
