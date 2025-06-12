'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Blog } from '@/types/blog';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BlogDashboard() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const router = useRouter();

  // Fetch blogs with proper error handling and loading states
  const {
    data: blogs = [],
    isLoading,
    isError,
    error,
  } = useQuery<Blog[], Error>({
    queryKey: ['blogs'],
    queryFn: async () => {
      const res = await fetch('/api/blogs');
      if (!res.ok) throw new Error('Failed to fetch blogs');
      const { data } = await res.json();
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Create blog mutation
  const { mutate: createBlog, isPending: isCreating } = useMutation({
    mutationFn: async (title: string) => {
      const response = await fetch('/api/blogs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error('Failed to create blog');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      setIsDialogOpen(false);
      setNewBlogTitle('');
    },
  });

  // Toggle blog visibility mutation
  const { mutate: toggleVisibility } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await fetch(`/api/blogs/change-visibility`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blog_id: id }),
      });

      if (!response.ok) {
        throw new Error('Failed to update visibility');
      }
      return response.json();
    },
    onSuccess: (updatedBlog, variables) => {
      queryClient.setQueryData<Blog[]>(['blogs'], (oldBlogs) => {
        if (!oldBlogs) return [];
        return oldBlogs.map((blog) =>
          blog.id === variables.id
            ? { ...blog, isPublic: !blog.isPublic }
            : blog
        );
      });
    },
  });

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-xl font-semibold text-red-500">
            Error loading blogs
          </h2>
          <p className="text-muted-foreground">{error.message}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => queryClient.refetchQueries({ queryKey: ['blogs'] })}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Fixed header with title and create button */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Blogs</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Blog
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Blog</DialogTitle>
                <DialogDescription>
                  Add a title for your new blog post.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={newBlogTitle}
                    onChange={(e) => setNewBlogTitle(e.target.value)}
                    className="col-span-3"
                    placeholder="My amazing blog post"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newBlogTitle.trim()) {
                        createBlog(newBlogTitle);
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={() => createBlog(newBlogTitle)}
                  disabled={!newBlogTitle.trim() || isCreating}
                >
                  {isCreating ? 'Creating...' : 'Create Blog'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main content area */}
      <main className="mt-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="p-0">
                  <Skeleton className="aspect-video w-full" />
                </CardContent>
                <CardFooter className="flex justify-between items-center p-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-9 w-16" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {blogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
                <div className="text-center space-y-4 max-w-md">
                  <h2 className="text-xl font-semibold">No blogs yet</h2>
                  <p className="text-muted-foreground">
                    Get started by creating your first blog post. Share your
                    ideas and thoughts with the world.
                  </p>
                  <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Blog
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <Card
                    key={blog.id}
                    className="hover:shadow-lg transition-shadow h-full flex flex-col"
                  >
                    <CardHeader>
                      <CardTitle className="truncate">{blog.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-grow">
                      <div className="relative aspect-video w-full">
                        <Image
                          src={blog.blog_cover_url || '/default-blog-cover.jpg'}
                          alt={blog.title}
                          fill
                          className="object-cover rounded-t-lg"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={false}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center p-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`visibility-${blog.id}`}
                          checked={blog.isPublic}
                          onCheckedChange={() =>
                            toggleVisibility({
                              id: blog.id,
                            })
                          }
                          disabled={isCreating}
                        />
                        <Label htmlFor={`visibility-${blog.id}`}>
                          {blog.isPublic ? 'Public' : 'Private'}
                        </Label>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/blogs/${blog.id}`)}
                      >
                        Edit
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
