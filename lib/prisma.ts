import { PrismaClient } from '@prisma/client'

// Ensure a single PrismaClient instance across hot reloads and serverless invocations
// eslint-disable-next-line no-var
declare global { var prismaGlobal: PrismaClient | undefined }

export const prisma: PrismaClient = globalThis.prismaGlobal ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
})

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}

export default prisma

