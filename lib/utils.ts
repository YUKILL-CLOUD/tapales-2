import { auth } from "@clerk/nextjs/server";
import prisma from './prisma';

const {sessionClaims} = auth();

export const role = (sessionClaims?.metadata as {role?: string })?.role;

// export async function getUserRole(userId: string): Promise<string | null> {
//   const user = await prisma.user.findUnique({
//     where: { clerkUserId: userId },
//     select: { role: true },
//   });

//   return user?.role || null;
// export async function checkUserRole(userId: string, requiredRole: string): Promise<boolean> {
//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//     select: { role: true },
//   });

//   return user?.role === requiredRole;
// }

export function getUserRole() {
const { sessionClaims } = auth();
  return (sessionClaims?.metadata as { role?: string })?.role;
}

export function isAdmin() {
  const role = getUserRole();
  return role === 'admin';
}

export function isUser() {
  const role = getUserRole();
  return role === 'user';
}

// export function checkPermission(requiredRole: 'admin' | 'user') {
//   const role = getUserRole();
//   return role === requiredRole;
// }