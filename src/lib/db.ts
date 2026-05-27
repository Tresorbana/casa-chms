import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const maxRetries = 3;
          let retries = 0;
          while (retries < maxRetries) {
            try {
              return await query(args);
            } catch (error: any) {
              // Retry on connection errors (like P1001 or timeout)
              if (
                error?.message?.includes("Can't reach database server") || 
                error?.message?.includes('timeout') || 
                error?.code === 'P1001'
              ) {
                retries++;
                console.warn(`[Neon Cold Start] Database connection failed. Retrying... (${retries}/${maxRetries})`);
                // Exponential backoff: 1s, 2s, 4s
                await new Promise(res => setTimeout(res, 1000 * Math.pow(2, retries - 1)));
              } else {
                throw error;
              }
            }
          }
          // If we reach here, it failed after all retries
          return query(args);
        },
      },
    },
  })
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
