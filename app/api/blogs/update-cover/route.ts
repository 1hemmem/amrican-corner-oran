import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Buffer } from 'buffer';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const blogId = formData.get('blog_id') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    if (!blogId) {
      return NextResponse.json(
        { error: 'No blog_id provided' },
        { status: 400 }
      );
    }

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/svg+xml',
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'Invalid file type. Only JPG, PNG, GIF, and SVG are allowed.',
        },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // ✅ Embed full data URI in base64 string
    const base64File = `data:${file.type};base64,${buffer.toString('base64')}`;

    const savedBlog = await prisma.blogs.update({
      where: {
        id: blogId,
      },
      data: {
        blog_cover: base64File,
      },
      select: {
        id: true,
        blog_cover: true,
      },
    });

    return NextResponse.json(
      {
        message: 'File uploaded successfully',
        blogId: savedBlog.id,
        blog_cover_url: savedBlog.blog_cover, // ✅ Already full data URI
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
