import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { role } from "@/lib/utils";

export default async function VaccinationRecordPage({
  params: { id, recordId },
}: {
  params: { id: string; recordId: string };
}) {
  const petId = parseInt(id);
  const vaccinationId = parseInt(recordId);

  if (isNaN(petId) || isNaN(vaccinationId)) {
    throw new Error("Invalid pet ID or vaccination record ID");
  }

  const vaccinationRecord = await prisma.vaccination.findUnique({
    where: { id: vaccinationId },
    include: { pet: true },
  });

  if (!vaccinationRecord || vaccinationRecord.petId !== petId) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vaccination Record Details</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <p className="font-bold">Pet Name:</p>
          <p>{vaccinationRecord.pet.name}</p>
        </div>
        <div className="mb-4">
          <p className="font-bold">Date:</p>
          <p>{new Date(vaccinationRecord.date).toLocaleDateString()}</p>
        </div>
        <div className="mb-4">
          <p className="font-bold">Vaccine Name:</p>
          <p>{vaccinationRecord.vaccineName}</p>
        </div>
        <div className="mb-4">
          <p className="font-bold">Medicine Name:</p>
          <p>{vaccinationRecord.medicineName}</p>
        </div>
        <div className="mb-4">
          <p className="font-bold">Manufacturer:</p>
          <p>{vaccinationRecord.manufacturer}</p>
        </div>
        {vaccinationRecord.nextDueDate && (
          <div className="mb-4">
            <p className="font-bold">Next Due Date:</p>
            <p>{new Date(vaccinationRecord.nextDueDate).toLocaleDateString()}</p>
          </div>
        )}
      </div>
      <div className="flex space-x-4">
        <Link href={`/list/pets/${petId}`}>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Back to Pet Details
          </button>
        </Link>
          <Link href={`/list/pets/${petId}/petVaccination/${vaccinationRecord.id}/edit`}>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Edit Vaccination Record
            </button>
          </Link>
      </div>
    </div>
  );
}
