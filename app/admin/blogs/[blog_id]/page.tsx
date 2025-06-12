'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';

export default function Page({
  params,
}: {
  params: Promise<{ blog_id: string }>;
}) {
  const { blog_id } = use(params);

  const {
    data: blog,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['blog', blog_id],
    queryFn: async () => {
      const res = await fetch(`/api/blogs/${blog_id}`);
      if (!res.ok) throw new Error('Failed to fetch blog');
      const { data } = await res.json();
      return data;
    },
    enabled: !!blog_id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading blog</div>;

  return (
    <div>
      hello {blog_id}
      <br />
      title: {blog.title}
      <SimpleEditor
        blog_id={blog_id}
        title={blog.title}
        content={blog.content}
      />
    </div>
  );
}
