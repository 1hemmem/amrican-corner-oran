'use client';
import { SquarePen, CalendarCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar';

import { NavUser } from './nav-user';

// Menu items.
const items = [
  {
    title: 'Blogs',
    url: '/admin/blogs',
    icon: SquarePen,
  },
  {
    title: 'Programs',
    url: '/admin/programs',
    icon: CalendarCheck,
  },
];

export function AppSidebar({ session }: { session: any }) {
  console.log('AppSidebar session:', session);
  return (
    <Sidebar
      className="flex flex-col min-h-screen bg-white border-r border-gray-200"
      collapsible="offcanvas"
    >
      <SidebarHeader className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex items-center gap-3">
                  <div className=" text-white flex aspect-square size-10 items-center justify-center rounded-lg">
                    <Image
                      src="/logo.png"
                      alt="American Corner Oran Logo"
                      width={40}
                      height={40}
                      className="h-8 w-8"
                    />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-[#002868]">
                      The American
                    </span>
                    <span className="truncate font-semibold text-[#002868]">
                      Corner Oran
                    </span>
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex-1 pt-8 overflow-auto bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="rounded-lg transition-colors hover:bg-gray-100"
                  >
                    <a href={item.url}>
                      <item.icon className="h-5 w-5 text-[#002868]" />
                      <span className="font-semibold text-[#002868]">
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-gray-200 p-4 bg-white mt-auto">
        <NavUser
          user={{
            name: session.data.user.name || 'Admin',
            email: session.data.user.email || '',
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
