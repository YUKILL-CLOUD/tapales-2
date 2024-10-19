
import { User } from '@prisma/client';
import prisma from './prisma';

export async function createUser(data: User) {
  try {
    const user = await prisma.user.create({ data })
    return { user }
  } catch (error) {
    return { error}
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
