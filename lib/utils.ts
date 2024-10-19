import { auth } from "@clerk/nextjs/server";
import prisma from './prisma';

const {sessionClaims} = auth();

export const role = (sessionClaims?.metadata as {role?: string })?.role;

// export async function checkUserRole(userId: string, requiredRole: string): Promise<boolean> {
//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//     select: { role: true },
//   });

//   return user?.role === requiredRole;
// }
