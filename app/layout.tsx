import type React from 'react';
import '@/styles/globals.scss';
import Providers from '@/components/providers';

export const metadata = {
  title: 'American Corner Oran',
  description: 'Official website of the American Corner in Oran, Algeria',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
