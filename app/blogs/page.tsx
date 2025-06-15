'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Blog } from '@/types/blog';
import { Calendar, ArrowRight } from 'lucide-react';

export default function BlogListPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: blogs = [],
    isLoading,
    isError,
    error,
  } = useQuery<Blog[], Error>({
    queryKey: ['blogs'],
    queryFn: async () => {
      const res = await fetch('/api/blogs?isPublic=true');
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Failed to fetch blogs');
      }
      const { data } = await res.json();
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });

  if (isError) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <h2 className="text-3xl font-bold text-[#002868] mb-4">
              Error loading blogs
            </h2>
            <p className="text-gray-700 mb-6">{error.message}</p>
            <Button
              className="bg-[#002868] hover:bg-[#001d4c] text-white"
              onClick={() =>
                queryClient.refetchQueries({ queryKey: ['blogs'] })
              }
            >
              Try Again
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-[#002868]">Our Blog</h1>
              <p className="mt-4 text-gray-700 max-w-2xl">
                Explore our latest insights, tips, and stories from the American
                Corner Oran.
              </p>
            </div>
          </div>
        </div>

        {/* Blog List */}
        <main>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="bg-white rounded-lg">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4 bg-gray-200" />
                    <Skeleton className="h-4 w-1/2 mt-2 bg-gray-200" />
                  </CardHeader>
                  <CardContent className="p-0">
                    <Skeleton className="aspect-[3/2] w-full rounded-lg bg-gray-200" />
                  </CardContent>
                  <CardFooter className="flex justify-between items-center p-6">
                    <Skeleton className="h-4 w-24 bg-gray-200" />
                    <Skeleton className="h-8 w-24 bg-gray-200" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {blogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                  <h2 className="text-3xl font-bold text-[#002868]">
                    No Blogs Available
                  </h2>
                  <p className="text-gray-700 mt-4 max-w-md text-center">
                    We’re working on new content. Check back soon for updates!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                  {blogs.map((blog) => (
                    <Card
                      key={blog.id}
                      className="bg-white rounded-lg hover:shadow-lg transition-shadow h-full flex flex-col cursor-pointer"
                      onClick={() => router.push(`/blogs/${blog.id}`)}
                    >
                      <CardContent className="p-0">
                        <div className="relative aspect-[3/2] w-full rounded-lg overflow-hidden">
                          <Image
                            src={blog.blog_cover || '/default-blog-cover.jpg'}
                            alt={blog.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            priority={false}
                          />
                        </div>
                      </CardContent>
                      <CardHeader className="pb-2 flex-grow">
                        <CardTitle className="text-xl font-semibold text-[#002868] line-clamp-2">
                          {blog.title}
                        </CardTitle>
                        <p className="text-gray-700 text-sm line-clamp-2 mt-2">
                          {blog.summary || 'No summary available'}
                        </p>
                      </CardHeader>
                      <CardFooter className="flex justify-between items-center p-6">
                        <div className="flex items-center space-x-2 text-sm text-gray-700">
                          <Calendar className="h-4 w-4 text-[#bf0a30]" />
                          <span>
                            {new Date(blog.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )}
                          </span>
                        </div>
                        <Button
                          className="bg-[#bf0a30] hover:bg-[#a00926] text-white"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/blogs/${blog.id}`);
                          }}
                        >
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </section>
  );
}
