'use client';

import { use, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Blog } from '@/types/blog';

export default function Page({
  params,
}: {
  params: Promise<{ blog_id: string }>;
}) {
  const { blog_id } = use(params);
  const queryClient = useQueryClient();
  const [editedTitle, setEditedTitle] = useState('');

  const {
    data: blog,
    isLoading,
    error,
  } = useQuery<Blog, Error>({
    queryKey: ['blog', blog_id],
    queryFn: async () => {
      const res = await fetch(`/api/blogs/${blog_id}`);
      if (!res.ok) throw new Error('Failed to fetch blog');
      const { data } = await res.json();
      setEditedTitle(data.title); // Initialize the edited title
      return data;
    },
    enabled: !!blog_id,
  });

  // Mutation for updating title
  const { mutate: updateTitle, isPending: isUpdatingTitle } = useMutation({
    mutationFn: async (newTitle: string) => {
      const res = await fetch(`/api/blogs/change-title`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle, blog_id: blog_id }),
      });
      if (!res.ok) throw new Error('Failed to update title');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog', blog_id] });
      toast({
        title: 'Success',
        description: 'Title updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Mutation for updating visibility
  const { mutate: toggleVisibility, isPending: isUpdatingVisibility } =
    useMutation({
      mutationFn: async () => {
        const res = await fetch(`/api/blogs/change-visibility`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ blog_id: blog_id }),
        });
        if (!res.ok) throw new Error('Failed to update visibility');
        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['blog', blog_id] });
        toast({
          title: 'Success',
          description: `Blog is now ${blog?.isPublic ? 'private' : 'public'}`,
        });
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      },
    });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-destructive">
        Error loading blog: {error.message}
      </div>
    );
  }

  if (!blog) {
    return <div className="container mx-auto p-6">Blog not found</div>;
  }

  const handleTitleSave = () => {
    if (editedTitle.trim() && editedTitle !== blog.title) {
      updateTitle(editedTitle);
    }
  };

  return (
    <div className="container mx-auto p-2 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 flex items-center gap-2">
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="text-3xl font-bold focus-visible:ring-1"
          />
          <Button
            size="sm"
            onClick={handleTitleSave}
            disabled={
              isUpdatingTitle ||
              !editedTitle.trim() ||
              editedTitle === blog.title
            }
          >
            {isUpdatingTitle ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
          </Button>
          {isUpdatingTitle && (
            <span className="text-sm text-muted-foreground">Saving...</span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="visibility-toggle"
              checked={blog.isPublic}
              onCheckedChange={() => toggleVisibility()}
              disabled={isUpdatingVisibility}
            />
            <Label
              htmlFor="visibility-toggle"
              className="flex items-center gap-2"
            >
              {blog.isPublic ? (
                <>
                  <Eye className="h-4 w-4" />
                  <span>Public</span>
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4" />
                  <span>Private</span>
                </>
              )}
            </Label>
          </div>
        </div>
      </div>

      <div className="prose max-w-none">
        <SimpleEditor
          blog_id={blog_id}
          title={blog.title}
          content={blog.content}
        />
      </div>
    </div>
  );
}
