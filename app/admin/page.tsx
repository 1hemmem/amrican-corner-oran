'use client';
import { authClient } from '@/lib/auth-client';

export default function Home() {
  // This page is only for authenticated
  return (
    <div>
      Hello there
      <button
        onClick={async () => {
          await authClient.signOut();
        }}
      >
        sign out
      </button>
    </div>
  );
}
