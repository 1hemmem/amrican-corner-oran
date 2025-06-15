'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SquarePen, CalendarCheck, LogOut } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';

export function MobileAdminNavbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await authClient.signOut();
      if (error) throw error;
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      toast.error('Logout failed', {
        description:
          error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t bg-white shadow-md md:hidden">
      <Link
        href="/admin/blogs"
        className="flex flex-col items-center justify-center p-3 text-[#002868]"
      >
        <SquarePen className="h-5 w-5" />
        <span className="text-xs font-medium">Blogs</span>
      </Link>

      <Link
        href="/admin/programs"
        className="flex flex-col items-center justify-center p-3 text-[#002868]"
      >
        <CalendarCheck className="h-5 w-5" />
        <span className="text-xs font-medium">Programs</span>
      </Link>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="flex flex-col items-center justify-center p-3 text-red-600">
            <LogOut className="h-5 w-5" />
            <span className="text-xs font-medium">Logout</span>
          </button>
        </AlertDialogTrigger>

        <AlertDialogContent className="rounded-lg border border-gray-200 bg-white text-[#002868]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-[#002868]">
              Confirm Logout
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500">
              Are you sure you want to log out? You will need to log in again to
              access the admin dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex justify-end gap-2">
            <AlertDialogCancel className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
            >
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
}
