import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  contextPromise: Promise<{ params: { id: string } }>
) {
  const { params } = await contextPromise;
  const { searchParams } = req.nextUrl;
  const blogId = params.id;
  const isPublic = searchParams.get('isPublic');

  try {
    const whereClause: any = { id: blogId };

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
    console.error('Fetch error:', error);
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
