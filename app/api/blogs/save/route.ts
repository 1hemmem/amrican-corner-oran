import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { blog_id, title, content } = await req.json();

  try {
    const data = await prisma.blogs.upsert({
      where: { id: blog_id },
      update: {
        title,
        content,
        updatedAt: new Date(),
      },
      create: {
        id: blog_id,
        title,
        content,
        // createdAt & updatedAt will be auto-filled
      },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

//TODO: Finish the implementation of this + the creation of new empty blog api + the deletion of an api
//TODO: plus the publishement of a blog ...
