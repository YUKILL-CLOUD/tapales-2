'use server'
// app/actions/updateUserRole.ts
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import prisma from './prisma';

export async function updateUserRole() {
  const user = await currentUser();

  if (!user) {
    return { success: false, error: 'You need to sign in first.' };
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
    select: { role: true },
  });
  
  const currentRole = user.publicMetadata?.role;

  if (currentRole) {
    return { success: true, error: null }; // User already has a role
  }

  try {
    await clerkClient.users.updateUserMetadata(user.id, {
      publicMetadata: { role: 'user' }, // Assign 'user' role
    });
    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error: 'Failed to update user role' };
  }
}