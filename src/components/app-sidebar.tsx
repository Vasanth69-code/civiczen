
"use client";

import {
  FileText,
  LayoutDashboard,
  VenetianMask,
  Award,
  Settings,
  List,
  MessageCircle,
  Users,
  LineChart,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/context/language-context";
import { useUser } from "@/context/user-context";

export function AppSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user } = useUser();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <VenetianMask className="size-8 text-primary" />
          <h1 className="font-headline text-2xl font-semibold">CityZen</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/report")}
                tooltip={{ children: t('report_an_issue') }}
              >
                <Link href="/report">
                  <LayoutDashboard />
                  <span>{t('report_an_issue')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/analytics")}
                tooltip={{ children: "Analytics" }}
              >
                <Link href="/analytics">
                  <LineChart />
                  <span>{"Analytics"}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/issues")}
                tooltip={{ children: t('my_submitted_issues') }}
              >
                <Link href="/issues">
                  <FileText />
                  <span>{t('my_submitted_issues')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/all-reports")}
                tooltip={{ children: t('all_issue_reports') }}
              >
                <Link href="/all-reports">
                  <List />
                  <span>{t('all_issue_reports')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/community")}
                tooltip={{ children: t('community') }}
              >
                <Link href="/community">
                  <Users />
                  <span>{t('community')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/leaderboard")}
                tooltip={{ children: t('community_leaderboard') }}
              >
                <Link href="/leaderboard">
                  <Award />
                  <span>{t('community_leaderboard')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/chat")}
                tooltip={{ children: t('community_chat') }}
              >
                <Link href="/chat">
                  <MessageCircle />
                  <span>{t('community_chat')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/settings')} tooltip={{children: t('settings')}}>
                        <Link href="/settings">
                            <Settings />
                            <span>{t('settings')}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild size="lg" className="h-auto py-2">
                        <Link href="/settings">
                            <Avatar className="size-8">
                                <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={user.imageHint} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-medium">{user.name}</span>
                                <span className="text-xs text-muted-foreground">{t('citizen')}</span>
                            </div>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
