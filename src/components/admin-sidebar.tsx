"use client";

import {
  FileText,
  LayoutDashboard,
  VenetianMask,
  Users,
  Settings,
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


export function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <VenetianMask className="size-8 text-primary" />
          <h1 className="font-headline text-2xl font-semibold">CityZen</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/admin/dashboard")}
                tooltip={{ children: t('dashboard') }}
              >
                <Link href="/admin/dashboard">
                  <LayoutDashboard />
                  <span>{t('dashboard')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/admin/issues")}
                tooltip={{ children: t('all_issue_reports') }}
              >
                <Link href="/admin/issues">
                  <FileText />
                  <span>{t('all_issue_reports')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/admin/users")}
                tooltip={{ children: t('users') }}
              >
                <Link href="#">
                  <Users />
                  <span>{t('users')}</span>
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
                    <SidebarMenuButton asChild isActive={isActive('/admin/settings')} tooltip={{children: t('settings')}}>
                        <Link href="#">
                            <Settings />
                            <span>{t('settings')}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild size="lg" className="h-auto py-2">
                        <Link href="#">
                            <Avatar className="size-8">
                                <AvatarImage src="https://picsum.photos/seed/admin/100/100" data-ai-hint="admin user" alt="Admin" />
                                <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-medium">Admin User</span>
                                <span className="text-xs text-muted-foreground">{t('administrator')}</span>
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
