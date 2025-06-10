import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { blog_id } = await req.json();

  try {
    const data = await prisma.blogs.findUnique({ where: { id: blog_id } });

    if (!data) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const updated = await prisma.blogs.update({
      where: { id: blog_id },
      data: { isPublic: !data.isPublic },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
