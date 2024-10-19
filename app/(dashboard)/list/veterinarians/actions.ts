'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from 'next/cache';
import { Veterinarian } from '@prisma/client';

export async function getVeterinarianData(): Promise<Veterinarian | null> {
    return await prisma.veterinarian.findFirst();
}

export async function handleSubmit(formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    
    try {
        await prisma.veterinarian.upsert({
            where: { id: 1 }, // Assuming there's only one veterinarian with ID 1
            update: {
                name: data.name as string,
                specialization: data.specialization as string,
                phone: data.phone as string,
                email: data.email as string,
                prclicNo: data.prclicNo as string,
                prtNo: data.prtNo as string,
                tinNo: data.tinNo as string,
            },
            create: {
                name: data.name as string,
                specialization: data.specialization as string,
                phone: data.phone as string,
                email: data.email as string,
                prclicNo: data.prclicNo as string,
                prtNo: data.prtNo as string,
                tinNo: data.tinNo as string,
            },
        });

        revalidatePath('/list/veterinarians');
        return { success: true };
    } catch (error) {
        console.error("Error updating veterinarian:", error);
        return { success: false, error: "Failed to update veterinarian" };
    }
}
