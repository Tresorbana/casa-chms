// Environment variables loaded via --env-file flag (local) or process.env (Vercel)
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('⏳ Connecting to database...');
  await prisma.$connect();
  console.log('✅ Connected!\n');

  // --- Seed admin user (idempotent – safe to run on every build) ---
  const email = process.env.ADMIN_EMAIL || 'admin@gmail.com';
  const rawPassword = process.env.ADMIN_PASSWORD || 'admin@1234567890';

  // Hash the password with bcrypt (the login route uses bcrypt.compare)
  const hashedPassword = await bcrypt.hash(rawPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      // Update password hash on every seed so .env changes are reflected
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
    create: {
      email,
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log(`👤 Admin ready: ${admin.email} (role: ${admin.role})`);

  console.log('\n🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
