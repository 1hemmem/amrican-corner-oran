'use client';

import { AppSidebar } from '@/components/app-sidebar';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter, usePathname } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [authStatus, setAuthStatus] = useState<
    'loading' | 'authenticated' | 'unauthenticated'
  >('loading');
  const [session, setSession] = useState<any>(null); // State to hold session
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authClient.getSession();
        setSession(res);
        if (res?.data) {
          setAuthStatus('authenticated');
          // Redirect to /admin/blogs if on root admin path or login
          if (pathname === '/admin' || pathname === '/admin/login') {
            router.push('/admin/blogs');
          }
        } else {
          setAuthStatus('unauthenticated');
          // If not on login page, redirect to login
          if (pathname !== '/admin/login') {
            router.push('/admin/login');
          }
        }
      } catch (error) {
        console.error(error);
        setAuthStatus('unauthenticated');
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Show spinner only during initial auth check
  if (authStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-10 h-10" />
      </div>
    );
  }

  // Show login page if unauthenticated
  if (authStatus === 'unauthenticated' && pathname === '/admin/login') {
    return children;
  }

  // Show protected content if authenticated
  if (authStatus === 'authenticated') {
    // Additional check to handle cases where redirect hasn't happened yet
    if (pathname === '/admin' || pathname === '/admin/login') {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner className="w-10 h-10" />
        </div>
      );
    }

    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <SidebarProvider>
          <AppSidebar session={session} />
          <SidebarInset className="flex-1 overflow-hidden">
            <SidebarTrigger className="mt-2" />
            <div className="flex-1 overflow-y-auto">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    );
  }

  // Return null for any other case (will be replaced by the router)
  return null;
}
