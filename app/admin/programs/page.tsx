'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ComingSoonPage() {
  const router = useRouter();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <h1 className="text-3xl font-bold text-[#002868] mb-4">
            Programme Customization is Coming Soon
          </h1>
          <p className="text-gray-700 mb-6 max-w-md">
            We are working on bringing you a personalized programme
            customization experience. Stay tuned for updates!
          </p>
          <Button
            className="bg-[#bf0a30] hover:bg-[#a00926] text-white gap-2"
            onClick={() => router.push('/admin/blogs')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs Dashboard
          </Button>
        </div>
      </div>
    </section>
  );
}
