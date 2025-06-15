'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Blog } from '@/types/blog';
import { use } from 'react';

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ blog_id: string }>;
}) {
  const router = useRouter();
  const { blog_id } = use(params);

  const {
    data: blog,
    isLoading,
    isError,
    error,
  } = useQuery<Blog, Error>({
    queryKey: ['blog', blog_id],
    queryFn: async () => {
      const res = await fetch(`/api/blogs/${blog_id}?isPublic=true`);
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Failed to fetch blog');
      }
      const { data } = await res.json();
      return data;
    },
    enabled: !!blog_id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#002868]" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <h2 className="text-3xl font-bold text-[#002868] mb-4">
              Error loading blog
            </h2>
            <p className="text-gray-700 mb-6">{error.message}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!blog) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <h2 className="text-3xl font-bold text-[#002868] mb-4">
              Blog Not Found
            </h2>
            <p className="text-gray-700 mb-6">
              The requested blog post could not be found.
            </p>
            <Button
              className="bg-[#002868] hover:bg-[#001d4c] text-white gap-2"
              onClick={() => router.push('/blogs')}
            >
              Back to Blogs
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <div className="mb-12">
          <article className="max-w-4xl mx-auto">
            {blog.blog_cover && (
              <div className="relative w-full aspect-[3/2] mb-8 rounded-lg overflow-hidden">
                <Image
                  src={blog.blog_cover}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                  priority
                />
              </div>
            )}

            <h1 className="text-3xl font-bold text-[#002868] mb-4">
              {blog.title}
            </h1>
            <div className="flex items-center gap-4 mb-8 text-gray-700">
              <span>
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            <div className="prose max-w-none text-gray-700 p-8">
              <div
                dangerouslySetInnerHTML={{
                  __html: blog.content || '<p>No content available</p>',
                }}
              />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
