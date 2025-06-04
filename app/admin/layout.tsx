'use client';
import Image from 'next/image';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { LoginForm } from './login-form';
import Link from 'next/link';

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authClient.getSession().then((res) => {
      setSession(res?.data || null);
      setLoading(false);
    });
  }, []);
  if (loading) {
    return <div>Loading... </div>;
  }
  // If the user is authenticated render the admin page (children)
  if (session) {
    return <div>{children}</div>;
  } else {
    return (
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <Link href="/" className="flex items-center gap-2 font-medium">
              <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                <Image
                  src="/logo.png"
                  alt="American Corner Oran Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
              </div>
              American Corner Oran
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <LoginForm />
            </div>
          </div>
        </div>
        <div className="bg-muted relative hidden lg:block">
          <Image
            src="/program-english.jpg"
            alt="American Corner Oran"
            width={40}
            height={40}
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    );
  }
}
