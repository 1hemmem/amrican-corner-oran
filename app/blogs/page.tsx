'use client';

import { useQuery } from '@tanstack/react-query';
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
import { Badge } from '@/components/ui/badge';
import { Blog } from '@/types/blog';
import { Calendar, ArrowRight } from 'lucide-react';

export default function BlogListPage() {
  const router = useRouter();

  const {
    data: blogs = [],
    isLoading,
    isError,
    error,
  } = useQuery<Blog[], Error>({
    queryKey: ['blogs'],
    queryFn: async () => {
      const res = await fetch('/api/blogs?isPublic=true');
      if (!res.ok) throw new Error('Failed to fetch blogs');
      const { data } = await res.json();
      console.log(data);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-muted/50 rounded-lg">
          <h2 className="text-2xl font-bold text-destructive mb-2">
            Error loading blogs
          </h2>
          <p className="text-muted-foreground mb-6">{error.message}</p>
          <Button
            variant="default"
            size="lg"
            className="group"
            onClick={() => window.location.reload()}
          >
            Try Again
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          Our Blog
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our latest insights, tips, and stories from the world of
          technology
        </p>
        <Button
          variant="outline"
          size="lg"
          className="mt-6"
          onClick={() => router.push('/blogs/subscribe')}
        >
          Subscribe for Updates
        </Button>
      </header>

      {/* Blog List */}
      <main>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent className="p-0">
                  <Skeleton className="aspect-[3/2] w-full" />
                </CardContent>
                <CardFooter className="flex justify-between items-center p-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {blogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] bg-muted/50 rounded-lg">
                <h2 className="text-2xl font-bold">No Blogs Available</h2>
                <p className="text-muted-foreground mt-2 max-w-md text-center">
                  We&rsquo;re working on new content. Subscribe to get notified
                  when new posts are published!
                </p>
                <Button
                  variant="default"
                  size="lg"
                  className="mt-6"
                  onClick={() => router.push('/blogs/subscribe')}
                >
                  Subscribe Now
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <Card
                    key={blog.id}
                    className="group overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    onClick={() => router.push(`/blogs/${blog.id}`)}
                  >
                    <CardContent className="p-0">
                      <div className="relative aspect-[3/2] w-full">
                        <Image
                          src={blog.blog_cover_url || '/default-blog-cover.jpg'}
                          alt={blog.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority={false}
                        />
                        {blog.category && (
                          <Badge className="absolute top-4 left-4 bg-primary/90">
                            {blog.category}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-2 text-xl font-semibold">
                        {blog.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                        {blog.summary || 'No summary available'}
                      </p>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center p-4">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
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
                        variant="ghost"
                        size="sm"
                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
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
  );
}
