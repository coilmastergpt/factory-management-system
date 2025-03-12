import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 관리자 계정 생성
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: 'admin123',
      name: '관리자',
      role: 'ADMIN',
      department: '시스템관리부',
    },
  });

  // 매니저 계정 생성
  const manager = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      email: 'manager@example.com',
      password: 'manager123',
      name: '매니저',
      role: 'MANAGER',
      department: '개발부',
    },
  });

  // 일반 사용자 계정 생성
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: 'user123',
      name: '사용자',
      role: 'WORKER',
      department: '고객지원부',
    },
  });

  console.log({ admin, manager, user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 