'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Blog } from '@/types/blog';
import { Badge } from '@/components/ui/badge';
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
      const res = await fetch(`/api/blogs/${blog_id}`);
      if (!res.ok) throw new Error('Failed to fetch blog');
      const { data } = await res.json();
      return data;
    },
    enabled: !!blog_id,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6">
        <Card className="border-destructive/50">
          <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <h2 className="text-2xl font-bold text-destructive mb-2">
              Error loading blog
            </h2>
            <p className="text-muted-foreground mb-6">{error.message}</p>
            <Button
              variant="default"
              size="lg"
              className="group"
              onClick={() => router.push('/blogs')}
            >
              Back to Blogs
              <ArrowLeft className="ml-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <h2 className="text-2xl font-bold">Blog Not Found</h2>
            <p className="text-muted-foreground mt-2">
              The requested blog post could not be found.
            </p>
            <Button
              variant="default"
              size="lg"
              className="mt-6"
              onClick={() => router.push('/blogs')}
            >
              Back to Blogs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  console.log(blog.content);
  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 hover:bg-muted"
        onClick={() => router.push('/blogs')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to All Blogs
      </Button>

      <article className="max-w-4xl mx-auto">
        {blog.blog_cover_url && (
          <div className="relative w-full aspect-[3/2] mb-8 rounded-lg overflow-hidden">
            <Image
              src={blog.blog_cover_url}
              alt={blog.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
            {blog.category && (
              <Badge className="absolute top-4 left-4 bg-primary/90">
                {blog.category}
              </Badge>
            )}
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            {blog.title}
          </h1>
          <div className="flex items-center gap-4 mt-4 text-muted-foreground">
            <span>
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </header>

        <Card className="prose max-w-none dark:prose-invert">
          <CardContent className="p-8">
            <div
              dangerouslySetInnerHTML={{
                __html: blog.content || '<p>No content available</p>',
              }}
            />
          </CardContent>
        </Card>
      </article>
    </div>
  );
}
