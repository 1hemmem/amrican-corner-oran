import 'dotenv/config';
import { auth } from '../lib/auth';
import { prisma } from '../lib/prisma';

async function seedAdmin(email: string, password: string, name: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return console.log(`Admin ${email} already exists`);

  await auth.api.signUpEmail({
    body: { email, password, name },
  });

  console.log(`Signed up admin: ${email}`);
}

async function main() {
  await seedAdmin(
    process.env.ADMIN1_EMAIL!,
    process.env.ADMIN1_PASSWORD!,
    process.env.ADMIN1_NAME!
  );

  await seedAdmin(
    process.env.ADMIN2_EMAIL!,
    process.env.ADMIN2_PASSWORD!,
    process.env.ADMIN2_NAME!
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
