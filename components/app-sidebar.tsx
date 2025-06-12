import { SquarePen } from 'lucide-react';
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
];

export function AppSidebar() {
  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
      className="flex flex-col h-screen"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image
                    src="/logo.png"
                    alt="American Corner Oran Logo"
                    width={40}
                    height={40}
                    className="h-10 w-10"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">The American</span>
                  <span className="truncate font-medium">Corner Oran</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-auto">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter className="border-t p-2">
          <NavUser
            user={{
              name: 'shadcn',
              email: 'm@example.com',
              avatar: '/avatars/shadcn.jpg',
            }}
          />
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
