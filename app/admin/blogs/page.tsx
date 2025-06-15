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
import { Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/image-upload';

export default function BlogDashboard() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const router = useRouter();

  // Fetch blogs
  const {
    data: blogs = [],
    isLoading,
    isError,
    error,
  } = useQuery<Blog[], Error>({
    queryKey: ['blogs'],
    queryFn: async () => {
      const res = await fetch('/api/blogs');
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Failed to fetch blogs');
      }
      const { data } = await res.json();
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2, // Retry failed requests twice
  });

  // Create blog mutation
  const createBlogMutation = useMutation({
    mutationFn: async (title: string) => {
      const response = await fetch('/api/blogs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Failed to create blog');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      setIsDialogOpen(false);
      setNewBlogTitle('');
    },
    onError: (error: Error) => {
      console.error('Create blog error:', error.message);
    },
  });

  // Toggle visibility mutation with optimistic update
  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await fetch(`/api/blogs/change-visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blog_id: id }),
      });
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Failed to update visibility');
      }
      return response.json();
    },
    onMutate: async ({ id }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['blogs'] });

      // Snapshot the previous value
      const previousBlogs = queryClient.getQueryData<Blog[]>(['blogs']) || [];

      // Optimistically update
      queryClient.setQueryData<Blog[]>(
        ['blogs'],
        (oldBlogs) =>
          oldBlogs?.map((blog) =>
            blog.id === id ? { ...blog, isPublic: !blog.isPublic } : blog
          ) || []
      );

      // Return context for rollback
      return { previousBlogs };
    },
    onError: (err, _variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['blogs'], context?.previousBlogs);
      console.error('Toggle visibility error:', err.message);
    },
    onSettled: () => {
      // Invalidate to ensure data is fresh
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  // Delete blog mutation
  const deleteBlogMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Failed to delete blog');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      setIsDeleteDialogOpen(false);
      setBlogToDelete(null);
    },
    onError: (error: Error) => {
      console.error('Delete blog error:', error.message);
    },
  });

  if (isError) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-center h-64">
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
              Retry
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        {/* Header with title and create button */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <h1 className="text-3xl font-bold text-[#002868]">My Blogs</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-[#002868] hover:bg-[#001d4c] text-white gap-2"
                  disabled={createBlogMutation.isPending}
                >
                  <Plus className="h-4 w-4" />
                  Create Blog
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white rounded-lg">
                <DialogHeader>
                  <DialogTitle className="text-[#002868]">
                    Create New Blog
                  </DialogTitle>
                  <DialogDescription className="text-gray-700">
                    Add a title for your new blog post.
                    {createBlogMutation.isError && (
                      <p className="text-[#bf0a30] mt-2">
                        Error: {createBlogMutation.error?.message}
                      </p>
                    )}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="title"
                      className="text-right text-[#002868] font-medium"
                    >
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={newBlogTitle}
                      onChange={(e) => setNewBlogTitle(e.target.value)}
                      className="col-span-3 border-gray-300 focus:border-[#002868]"
                      placeholder="My amazing blog post"
                      onKeyDown={(e) => {
                        if (
                          e.key === 'Enter' &&
                          !createBlogMutation.isPending
                        ) {
                          createBlogMutation.mutate(newBlogTitle);
                        }
                      }}
                      disabled={createBlogMutation.isPending}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    className="bg-[#002868] hover:bg-[#001d4c] text-white"
                    onClick={() => createBlogMutation.mutate(newBlogTitle)}
                    disabled={
                      !newBlogTitle.trim() || createBlogMutation.isPending
                    }
                  >
                    {createBlogMutation.isPending
                      ? 'Creating...'
                      : 'Create Blog'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-white rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-[#002868]">Delete Blog</DialogTitle>
              <DialogDescription className="text-gray-700">
                Are you sure you want to delete this blog post? This action
                cannot be undone.
                {deleteBlogMutation.isError && (
                  <p className="text-[#bf0a30] mt-2">
                    Error: {deleteBlogMutation.error?.message}
                  </p>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                className="bg-gray-200 text-[#002868] hover:bg-gray-300"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setBlogToDelete(null);
                }}
                disabled={deleteBlogMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#bf0a30] hover:bg-[#a00926] text-white"
                onClick={() =>
                  blogToDelete && deleteBlogMutation.mutate(blogToDelete)
                }
                disabled={deleteBlogMutation.isPending}
              >
                {deleteBlogMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Main content area */}
        <main>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="bg-white rounded-lg">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent className="p-0">
                    <Skeleton className="aspect-video w-full rounded-lg" />
                  </CardContent>
                  <CardFooter className="flex justify-between items-center p-6">
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
                    <h2 className="text-3xl font-bold text-[#002868]">
                      No blogs yet
                    </h2>
                    <p className="text-gray-700">
                      Get started by creating your first blog post. Share your
                      ideas and thoughts with the world.
                    </p>
                    <Button
                      onClick={() => setIsDialogOpen(true)}
                      className="bg-[#002868] hover:bg-[#001d4c] text-white"
                      disabled={createBlogMutation.isPending}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Blog
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {blogs.map((blog) => (
                    <Card
                      key={blog.id}
                      className="bg-white rounded-lg hover:shadow-lg transition-shadow h-full flex flex-col"
                    >
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold text-[#002868] truncate">
                          {blog.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 flex-grow">
                        {blog.blog_cover ? (
                          <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                            <Image
                              src={blog.blog_cover}
                              alt={blog.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              priority={false}
                            />
                            <div className="absolute bottom-2 right-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    className="bg-white text-[#002868] hover:bg-gray-100"
                                    size="sm"
                                  >
                                    Change Cover
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-white rounded-lg">
                                  <DialogHeader>
                                    <DialogTitle className="text-[#002868]">
                                      Change Blog Cover
                                    </DialogTitle>
                                    <DialogDescription className="text-gray-700">
                                      Upload a new cover image for your blog.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <ImageUpload
                                    blogId={blog.id}
                                    onUploadSuccess={() =>
                                      queryClient.invalidateQueries({
                                        queryKey: ['blogs'],
                                      })
                                    }
                                  />
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        ) : (
                          <div className="p-6">
                            <ImageUpload
                              blogId={blog.id}
                              onUploadSuccess={() =>
                                queryClient.invalidateQueries({
                                  queryKey: ['blogs'],
                                })
                              }
                            />
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between items-center p-6">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`visibility-${blog.id}`}
                            checked={blog.isPublic}
                            onCheckedChange={() =>
                              toggleVisibilityMutation.mutate({ id: blog.id })
                            }
                            disabled={toggleVisibilityMutation.isPending}
                          />
                          <Label
                            htmlFor={`visibility-${blog.id}`}
                            className="text-gray-700"
                          >
                            {blog.isPublic ? 'Public' : 'Private'}
                          </Label>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            className="bg-[#002868] hover:bg-[#001d4c] text-white"
                            size="sm"
                            onClick={() =>
                              router.push(`/admin/blogs/${blog.id}`)
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            className="bg-[#bf0a30] hover:bg-[#a00926] text-white"
                            size="sm"
                            onClick={() => {
                              setBlogToDelete(blog.id);
                              setIsDeleteDialogOpen(true);
                            }}
                            disabled={deleteBlogMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
