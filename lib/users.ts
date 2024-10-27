'use server'
import { Role, User } from '@prisma/client';
import prisma from './prisma';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function createUser(data: Partial<User>) {
  try {
    const user = await prisma.user.create({
      data: {
        clerkUserId: data.clerkUserId!,
        email: data.email!,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        imageUrl: data.imageUrl || null,
        // role: data.role || 'user' as Role, //changed
      }
    });
    return { user };
  } catch (error) {
    console.error('Error in createUser:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getUserById({
  id,
  clerkUserId,
  email
}: {
  id?: string;
  clerkUserId?: string;
  email?: string;
}) {
  try {
    if (!id && !clerkUserId && !email) {
      throw new Error('id or clerkUserId is required');
    }

    let user;
    if (id) {
      user = await prisma.user.findUnique({ 
        where: { id }
      });
    } 
    else if (clerkUserId) {
      user = await prisma.user.findUnique({ 
        where: { clerkUserId }
      });
    }
    else if (email) {
        user = await prisma.user.findUnique({ 
          where: { email }
        });
      }

    return { user };
  } catch (error) {
    return { error};
  }
}

export async function updateUser(id: string, data: Partial<User>) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data
    });
    return { user };
  } catch (error) {
    return { error};
  }
}

export async function createUserAfterSignUp() {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const clerkUser = await clerkClient.users.getUser(userId);

  const userData = {
    clerkUserId: userId,
    email: clerkUser.emailAddresses[0]?.emailAddress || '',
    firstName: clerkUser.firstName || '',
    lastName: clerkUser.lastName || '',
    imageUrl: clerkUser.imageUrl || null,
    // role: 'user' as Role, // Set initial role //changed
  };

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { clerkUserId: userId }
  });

  if (existingUser) {
    // User already exists, return the existing user
    return existingUser;
  }

  const { user, error } = await createUser(userData);

  if (error) {
    console.error('Error creating user:', error);
    throw new Error(`Failed to create user: ${error}`);
  }

  return user;
}
