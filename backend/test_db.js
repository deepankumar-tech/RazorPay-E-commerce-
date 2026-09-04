const { PrismaClient } = require('@prisma/client');

const passwords = [
  'postgres', 'postgrespassword', 'admin', 'root', '123456', '12345678', 'password',
  'Chiranjeevi', 'chiranjeevi', 'Razorpay', 'razorpay', '1234', '12345',
  'postgres123', 'root123', 'Password@123', 'Admin@123', 'P@ssword123', 'Pass@123'
];

async function test() {
  for (const p of passwords) {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: `postgresql://postgres:${encodeURIComponent(p)}@localhost:5432/postgres?schema=public`
        }
      }
    });
    try {
      await prisma.$connect();
      console.log('✅ MATCH_FOUND_PASSWORD:', p);
      await prisma.$disconnect();
      return p;
    } catch (e) {
      console.log('❌ Failed for password:', p, e.message ? e.message.split('\n')[0] : '');
      await prisma.$disconnect();
    }
  }
}

test();
