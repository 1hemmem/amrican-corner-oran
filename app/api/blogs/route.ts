// app/api/blogs/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const isPublic = searchParams.get('isPublic');

  try {
    const blogs = await prisma.blogs.findMany({
      where: isPublic === 'true' ? { isPublic: true } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: blogs });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
