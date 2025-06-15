import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to resolve the id
    const { id: blogId } = await params;

    // Validate blogId
    if (!blogId || typeof blogId !== 'string') {
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });
    }

    const { searchParams } = req.nextUrl;
    const isPublic = searchParams.get('isPublic');

    const whereClause: { id: string; isPublic?: boolean } = { id: blogId };

    if (isPublic === 'true') {
      whereClause.isPublic = true;
    }

    const blog = await prisma.blogs.findUnique({
      where: whereClause,
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    console.error('Fetch blog error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const blogId = params.id;

  try {
    const deleted = await prisma.blogs.delete({
      where: { id: blogId },
    });

    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
