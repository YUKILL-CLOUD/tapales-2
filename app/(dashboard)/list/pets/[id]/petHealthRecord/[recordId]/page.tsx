// import prisma from "@/lib/prisma";
// import { notFound } from "next/navigation";
// import Link from "next/link";
// import { auth } from "@clerk/nextjs/server";
// import { role } from "@/lib/utils";

// export default async function HealthRecordPage({
//   params: { id, recordId },
// }: {
//   params: { id: string; recordId: string };
// }) {

//   const petId = parseInt(id);
//   const healthRecordId = parseInt(recordId);

//   if (isNaN(petId) || isNaN(healthRecordId)) {
//     throw new Error("Invalid pet ID or health record ID");
//   }

//   const healthRecord = await prisma.healthRecord.findUnique({
//     where: { id: healthRecordId },
//     include: { pet: true },
//   });

//   if (!healthRecord || healthRecord.petId !== petId) {
//     notFound();
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Health Record Details</h1>
//       <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
//         <div className="mb-4">
//           <p className="font-bold">Pet Name:</p>
//           <p>{healthRecord.pet.name}</p>
//         </div>
//         <div className="mb-4">
//           <p className="font-bold">Date:</p>
//           <p>{new Date(healthRecord.date).toLocaleDateString()}</p>
//         </div>
//         <div className="mb-4">
//           <p className="font-bold">Weight:</p>
//           <p>{healthRecord.weight} kg</p>
//         </div>
//         <div className="mb-4">
//           <p className="font-bold">Temperature:</p>
//           <p>{healthRecord.temperature}°C</p>
//         </div>
//         <div className="mb-4">
//           <p className="font-bold">Diagnosis:</p>
//           <p>{healthRecord.diagnosis}</p>
//         </div>
//         <div className="mb-4">
//           <p className="font-bold">Treatment:</p>
//           <p>{healthRecord.treatment}</p>
//         </div>
//         {healthRecord.notes && (
//           <div className="mb-4">
//             <p className="font-bold">Notes:</p>
//             <p>{healthRecord.notes}</p>
//           </div>
//         )}
//       </div>
//       <div className="flex space-x-4">
//         <Link href={`/list/pets/${petId}`}>
//           <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//             Back to Pet Details
//           </button>
//         </Link>
//         <Link href={`/list/pets/${petId}/petHealthRecord/${healthRecord.id}/edit`}>
//           <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
//                     Edit Health Record
//           </button>
//         </Link>
//       </div>
//     </div>
//   );
// }

import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { role } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";

function HealthRecordProfile({ healthRecord }: { healthRecord: any }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Pet Name</label>
                <p className="mt-1 text-gray-900">{healthRecord.pet.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date</label>
                <p className="mt-1 text-gray-900">{new Date(healthRecord.date).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Weight</label>
                <p className="mt-1 text-gray-900">{healthRecord.weight} kg</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Temperature</label>
                <p className="mt-1 text-gray-900">{healthRecord.temperature}°C</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Diagnosis</label>
                <p className="mt-1 text-gray-900">{healthRecord.diagnosis}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Treatment</label>
                <p className="mt-1 text-gray-900">{healthRecord.treatment}</p>
              </div>
              {healthRecord.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Notes</label>
                  <p className="mt-1 text-gray-900">{healthRecord.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function HealthRecordPage({
  params: { id, recordId },
}: {
  params: { id: string; recordId: string };
}) {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/sign-in');
  }
  // Get user role from database
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { role: true, id: true }
  });

  if (!user) {
    redirect('/sign-in');
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Health Record Details</h1>
      <HealthRecordProfile healthRecord={healthRecord} />
      
      <div className="mt-6 flex space-x-4">
        <Link href={`/list/pets/${petId}`}>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200">
            Back to Pet Details
          </button>
        </Link>
        {user.role === "admin" && (
          <Link href={`/list/pets/${petId}/petHealthRecord/${healthRecord.id}/edit`}>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200">
                  Edit Health Record
            </button>
        </Link>
        )}
      </div>
    </div>
  );
}