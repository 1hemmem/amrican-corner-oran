'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Blog } from '@/types/blog';
import { use } from 'react';
// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function Page({
  params,
}: {
  params: Promise<{ blog_id: string }>;
}) {
  const { blog_id } = use(params);
  const queryClient = useQueryClient();
  const [editedTitle, setEditedTitle] = useState('');
  const router = useRouter();

  // Debounce the title input
  const debouncedTitle = useDebounce(editedTitle, 2000);

  // Fetch blog
  const {
    data: blog,
    isLoading,
    isError,
    error,
  } = useQuery<Blog, Error>({
    queryKey: ['blog', blog_id],
    queryFn: async () => {
      const res = await fetch(`/api/blogs/${blog_id}`);
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Failed to fetch blog');
      }
      const { data } = await res.json();
      setEditedTitle(data.title); // Initialize the edited title
      return data;
    },
    enabled: !!blog_id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });

  // Mutation for updating title
  const updateTitleMutation = useMutation({
    mutationFn: async (newTitle: string) => {
      const res = await fetch(`/api/blogs/change-title`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, blog_id: blog_id }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Failed to update title');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog', blog_id] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] }); // Refresh blog list
      toast({
        title: 'Success',
        description: 'Title updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
      });
    },
  });

  // Mutation for updating visibility with optimistic update
  const toggleVisibilityMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/blogs/change-visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blog_id: blog_id }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Failed to update visibility');
      }
      return res.json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['blog', blog_id] });
      const previousBlog = queryClient.getQueryData<Blog>(['blog', blog_id]);
      queryClient.setQueryData<Blog>(['blog', blog_id], (old) =>
        old ? { ...old, isPublic: !old.isPublic } : old
      );
      return { previousBlog };
    },
    onError: (err, _variables, context) => {
      queryClient.setQueryData(['blog', blog_id], context?.previousBlog);
      toast({
        title: 'Error',
        description: err.message,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['blog', blog_id] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `Blog is now ${blog?.isPublic ? 'public' : 'private'}`,
      });
    },
  });

  // Auto-save title when debouncedTitle changes
  useEffect(() => {
    if (
      debouncedTitle.trim() &&
      debouncedTitle !== blog?.title &&
      !updateTitleMutation.isPending
    ) {
      updateTitleMutation.mutate(debouncedTitle);
    }
  }, [debouncedTitle, blog?.title, updateTitleMutation]);

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
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#002868] mb-4">
            Error loading blog
          </h2>
          <p className="text-gray-700 mb-6">{error.message}</p>
          <Button
            className="bg-[#002868] hover:bg-[#001d4c] text-white"
            onClick={() =>
              queryClient.refetchQueries({ queryKey: ['blog', blog_id] })
            }
          >
            Retry
          </Button>
        </div>
      </section>
    );
  }

  if (!blog) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto text-center text-gray-700">
          Blog not found
        </div>
      </section>
    );
  }

  return (
    <section className="py-2 bg-white">
      <div className="container mx-auto">
        <header className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 flex items-center gap-4 flex-wrap">
              <button
                className="text-[#bf0a30] gap-2 flex items-center whitespace-nowrap"
                onClick={() => router.push('/admin/blogs')}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blogs
              </button>
              <span className="font-bold text-[#002868] whitespace-nowrap">
                Title:{' '}
              </span>
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="text-3xl font-bold text-[#002868] border-gray-300 focus:border-[#002868] rounded-lg min-w-[200px] flex-1"
                placeholder="Blog title"
                disabled={updateTitleMutation.isPending}
              />
              {updateTitleMutation.isPending && (
                <span className="text-sm text-gray-700 whitespace-nowrap">
                  Saving...
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="visibility-toggle"
                  checked={blog.isPublic}
                  onCheckedChange={() => toggleVisibilityMutation.mutate()}
                  disabled={toggleVisibilityMutation.isPending}
                />
                <Label
                  htmlFor="visibility-toggle"
                  className="flex items-center gap-2 text-gray-700"
                >
                  {blog.isPublic ? (
                    <>
                      <Eye className="h-4 w-4 text-[#bf0a30]" />
                      <span>Public</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4 text-[#bf0a30]" />
                      <span>Private</span>
                    </>
                  )}
                </Label>
              </div>
            </div>
          </div>
        </header>
        <div className="prose max-w-none">
          <SimpleEditor
            blog_id={blog_id}
            title={blog.title}
            content={blog.content}
          />
        </div>
      </div>
    </section>
  );
}
