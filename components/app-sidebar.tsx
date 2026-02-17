"use client";

import {
  IconCamera,
  IconCategory2,
  IconChartBar,
  IconDashboard,
  IconDashboardFilled,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import * as React from "react";

import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Bug, CodeSquare, User as UserIcon } from "lucide-react";
import { NavMain } from "./nav-main";
import { User } from "better-auth";

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: User & { type: string } }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <Bug className="size-5!" />
                <span className="text-base font-semibold">NC-Panel</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
        {props.user.type === "ADMIN" && (
          <NavMain
            items={[
              {
                icon: IconDashboardFilled,
                title: "Dashboard",
                url: "/dashboard",
              },
              {
                icon: UserIcon,
                title: "Users",
                url: "/dashboard/users",
              },
              {
                icon: CodeSquare,
                title: "Projects",
                url: "/dashboard/projects",
              },
              {
                icon: IconCategory2,
                title: "Categories",
                url: "/dashboard/categories",
              },
            ]}
          />
        )}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={props.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
