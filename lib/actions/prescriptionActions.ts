'use server';

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function createPrescriptionAction(formData: FormData) {
  try {
    console.log('Action - Received FormData:', Object.fromEntries(formData.entries()));
    
    const petId = parseInt(formData.get('petId') as string);
    const veterinarianId = parseInt(formData.get('veterinarianId') as string);
    const appointmentId = formData.get('appointmentId') ? 
      parseInt(formData.get('appointmentId') as string) : 
      null;
    const medications = JSON.parse(formData.get('medications') as string);
    const status = formData.get('status') as string || 'active';

    console.log('Action - Parsed data:', { 
      petId, veterinarianId, appointmentId, medications, status 
    });

    // First, get the pet to find its owner
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      include: { user: true }
    });

    if (!pet) {
      throw new Error('Pet not found');
    }

    const prescription = await prisma.prescription.create({
      data: {
        pet: {
          connect: { id: petId }
        },
        veterinarian: {
          connect: { id: veterinarianId }
        },
        user: {
          connect: { id: pet.userId } // Connect to pet owner's ID
        },
        appointment: appointmentId ? {
          connect: { id: appointmentId }
        } : undefined,
        medication: medications,
        status: status,
      },
      include: {
        pet: true,
        veterinarian: true,
        appointment: true,
        user: true
      }
    });

    console.log('Action - Created prescription:', prescription);
    revalidatePath('/list/prescriptions');
    return { success: true, data: prescription };
  } catch (error) {
    console.error('Error in createPrescriptionAction:', error);
    return { error: 'An unexpected error occurred' };
  }
}