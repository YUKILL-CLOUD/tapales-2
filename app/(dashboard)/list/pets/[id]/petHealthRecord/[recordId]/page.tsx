import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { role } from "@/lib/utils";

export default async function HealthRecordPage({
  params: { id, recordId },
}: {
  params: { id: string; recordId: string };
}) {

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Health Record Details</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <p className="font-bold">Pet Name:</p>
          <p>{healthRecord.pet.name}</p>
        </div>
        <div className="mb-4">
          <p className="font-bold">Date:</p>
          <p>{new Date(healthRecord.date).toLocaleDateString()}</p>
        </div>
        <div className="mb-4">
          <p className="font-bold">Weight:</p>
          <p>{healthRecord.weight} kg</p>
        </div>
        <div className="mb-4">
          <p className="font-bold">Temperature:</p>
          <p>{healthRecord.temperature}°C</p>
        </div>
        <div className="mb-4">
          <p className="font-bold">Diagnosis:</p>
          <p>{healthRecord.diagnosis}</p>
        </div>
        <div className="mb-4">
          <p className="font-bold">Treatment:</p>
          <p>{healthRecord.treatment}</p>
        </div>
        {healthRecord.notes && (
          <div className="mb-4">
            <p className="font-bold">Notes:</p>
            <p>{healthRecord.notes}</p>
          </div>
        )}
      </div>
      <div className="flex space-x-4">
        <Link href={`/list/pets/${petId}`}>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Back to Pet Details
          </button>
        </Link>
        <Link href={`/list/pets/${petId}/petHealthRecord/${healthRecord.id}/edit`}>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Edit Health Record
          </button>
        </Link>
      </div>
    </div>
  );
}

