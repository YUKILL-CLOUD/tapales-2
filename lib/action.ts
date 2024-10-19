"use server";

import { PetSchema } from '@/lib/formValidationSchema';
import prisma from "@/lib/prisma";
import { currentUser } from '@clerk/nextjs/server';

type ActionResult = {
  success: boolean;
  error: string | null;
  data?: any;
};

// Utility function to get or create a user
async function getOrCreateUser(clerkUserId: string) {
  let dbUser = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        clerkUserId,
        firstName: '', // Default value or handle this differently
        lastName: '',
        email: '', // Adjust as necessary
        imageUrl: null, // Adjust as necessary
      },
    });
  }

  return dbUser;
}

export const createPet = async (
  _: ActionResult,
  data: PetSchema & { userId: string }
): Promise<ActionResult> => {
  try {
    console.log("Creating pet with data:", data);
    
    const user = await currentUser();
    if (!user?.id) {
      return { success: false, error: 'User is not authenticated' };
    }

    const dbUser = await getOrCreateUser(user.id);

    const pet = await prisma.pet.create({
      data: {
        name: data.name,
        type: data.type,
        breed: data.breed,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        userId: dbUser.id, // Use the database user ID, not the Clerk user ID
      },
    });
    console.log("Created pet:", pet);
    return { success: true, error: null, data: pet };
  } catch (err) {
    console.error("Error creating pet:", err);
    return { success: false, error: 'Failed to create pet. Please try again.' };
  }
};

export const updatePet = async (
  _: ActionResult,
  data: PetSchema & { id: number; userId: string }
): Promise<ActionResult> => {
  try {
    console.log("Updating pet with data:", data); // Log the incoming data
    const updatedPet = await prisma.pet.update({
      where: { id: data.id },
      data: {
        name: data.name,
        type: data.type,
        breed: data.breed,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        userId: data.userId, // Ensure userId is updated
      },
    });
    console.log("Updated pet:", updatedPet); // Log the updated pet
    return { success: true, error: null, data: updatedPet };
  } catch (err) {
    console.error("Error updating pet:", err);
    return { success: false, error: 'Failed to update pet. Please try again.' };
  }
};

export const deletePet = async (
  _: ActionResult,
  petId: number   
): Promise<ActionResult> => {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return { success: false, error: 'User is not authenticated' };
    }

    const dbUser = await getOrCreateUser(user.id);
    
    // Use role from publicMetadata
    const role = user.publicMetadata.role;

    const existingPet = await prisma.pet.findUnique({
      where: { id: petId },
    });

    if (!existingPet || (role !== 'admin' && existingPet.userId !== dbUser.id)) {
      return { success: false, error: 'Pet not found or does not belong to the user' };
    }

    await prisma.pet.delete({
      where: { id: petId },
    });

    return { success: true, error: null };
  } catch (err) {
    console.error(err);
    return { success: false, error: 'Failed to delete pet. Please try again.' };
  }
};
