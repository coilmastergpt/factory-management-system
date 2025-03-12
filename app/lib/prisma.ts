import { PrismaClient } from '@prisma/client';

// PrismaClient 인스턴스를 전역 변수로 선언하여 핫 리로딩 시 여러 인스턴스가 생성되는 것을 방지
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 개발 환경에서는 전역 변수를 사용하고, 프로덕션 환경에서는 새 인스턴스 생성
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma; 