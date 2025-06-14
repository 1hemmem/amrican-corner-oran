import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Update type to reflect Promise
) {
  const resolvedParams = await params; // Await the params Promise
  const blogId = resolvedParams.id; // Access id from resolved params

  try {
    const blog = await prisma.blogs.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
