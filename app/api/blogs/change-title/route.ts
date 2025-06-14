import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { blog_id, title } = await req.json();

  try {
    const data = await prisma.blogs.upsert({
      where: { id: blog_id },
      update: {
        title,
        updatedAt: new Date(),
      },
      create: {
        id: blog_id,
        title,
      },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
