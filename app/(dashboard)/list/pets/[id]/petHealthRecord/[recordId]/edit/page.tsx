import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { HealthRecordForm } from "@/components/forms/HealthRecordForm";

export default async function EditHealthRecordPage({
  params: { id, recordId },
}: {
  params: { id: string; recordId: string };
}) {
  const { userId } = auth();
  if (!userId) {
    return redirect('/sign-in');
  }

  const petId = parseInt(id);
  const healthRecordId = parseInt(recordId);

  if (isNaN(petId) || isNaN(healthRecordId)) {
    throw new Error("Invalid pet ID or health record ID");
  }

  const healthRecord = await prisma.healthRecord.findUnique({
    where: { id: healthRecordId },
    include: { pet: true },
  });

  if (!healthRecord || healthRecord.petId !== petId) {
    notFound();
  }

  const pet = await prisma.pet.findUnique({
    where: { id: petId },
    select: { id: true, name: true },
  });

  if (!pet) {
    notFound();
  }

  const updateHealthRecord = async (formData: FormData) => {
    'use server';
    
    const weight = parseFloat(formData.get('weight') as string);
    const temperature = parseFloat(formData.get('temperature') as string);
    const diagnosis = formData.get('diagnosis') as string;
    const treatment = formData.get('treatment') as string;
    const notes = formData.get('notes') as string;
    const date = new Date(formData.get('date') as string);

    await prisma.healthRecord.update({
      where: { id: healthRecordId },
      data: {
        weight,
        temperature,
        diagnosis,
        treatment,
        notes,
        date,
        // updatedAt will be automatically set by Prisma
      },
    });

    redirect(`/list/pets/${petId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Health Record for {pet.name}</h1>
      <HealthRecordForm
        pets={[pet]}
        preSelectedPetId={pet.id}
        initialData={healthRecord}
        onSubmit={updateHealthRecord}
      />
      {healthRecord.updatedAt && (
        <p className="mt-4 text-sm text-gray-500">
          Last updated: {new Date(healthRecord.updatedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
