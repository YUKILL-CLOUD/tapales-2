'use server';

import { revalidatePath } from "next/cache";
import prisma from "./prisma";

export async function createPrescription(formData: FormData) {
  try {
    const petId = parseInt(formData.get('petId') as string);
    const veterinarianId = parseInt(formData.get('veterinarianId') as string);
    const userId = formData.get('userId') as string;
    const appointmentId = formData.get('appointmentId') ? 
      parseInt(formData.get('appointmentId') as string) : null;

    // Get medications from form data
    const entries = Array.from(formData.entries());
    const medications = entries
      .filter(([key]) => key.startsWith('medications'))
      .reduce((acc: any[], [key, value]) => {
        const [_, index, field] = key.split('.');
        if (!acc[parseInt(index)]) {
          acc[parseInt(index)] = {};
        }
        acc[parseInt(index)][field] = value;
        return acc;
      }, [])
      .filter(med => med.name && med.dosage && med.instructions);

    const prescription = await prisma.prescription.create({
      data: {
        pet: {
          connect: { id: petId }
        },
        veterinarian: {
          connect: { id: veterinarianId }
        },
        user: {
          connect: { id: userId }
        },
        ...(appointmentId && {
          appointment: {
            connect: { id: appointmentId }
          }
        }),
        medication: medications,
        status: 'active'
      },
      include: {
        pet: true,
        veterinarian: true,
        appointment: true,
      }
    });

    return { success: true, data: prescription };
  } catch (error) {
    console.error('Create prescription error:', error);
    return { success: false, error: 'Failed to create prescription' };
  }
}

export async function updatePrescriptionStatus(id: number, status: string) {
  try {
    await prisma.prescription.update({
      where: { id },
      data: { status },
    });
    revalidatePath('/list/prescriptions');
    revalidatePath(`/list/prescriptions/${id}`);
  } catch (error) {
    console.error('Failed to update prescription status:', error);
    throw new Error('Failed to update prescription status');
  }
}

export async function deletePrescription(id: number) {
  try {
    await prisma.prescription.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting prescription:', error);
    return { success: false, error: 'Failed to delete prescription' };
  }
}

export async function reactivatePrescription(id: number) {
  try {
    await prisma.prescription.update({
      where: { id },
      data: { status: 'active' },
    });
    return { success: true };
  } catch (error) {
    console.error('Error reactivating prescription:', error);
    return { success: false, error: 'Failed to reactivate prescription' };
  }
}
