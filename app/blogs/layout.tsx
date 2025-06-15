import type React from 'react';
import SiteHeader from '@/components/site-header';

export const metadata = {
  title: 'American corner | Blogs',
  description: 'Official website of the American Corner in Oran, Algeria',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteHeader />
      <div className="flex min-h-screen flex-col">{children}</div>
    </>
  );
}
