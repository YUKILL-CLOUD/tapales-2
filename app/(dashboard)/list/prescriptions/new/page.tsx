import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ErrorBoundary from "@/components/ErrorBoundary";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PrescriptionForm } from "@/components/forms/PrescriptionForm";
import { currentUser } from "@clerk/nextjs/server";

export default async function NewPrescriptionPage({
  searchParams,
}: {
  searchParams: { petId?: string; appointmentId?: string };
}) {
  const { userId } = auth();
  const user = await currentUser();
  
  if (!userId || !user) {
    redirect("/sign-in");
  }

  const isAdmin = user.publicMetadata.role === "admin";
  console.log('NewPrescriptionPage - Auth check:', { userId, isAdmin });

  try {
    const [pets, veterinarians, appointments] = await Promise.all([
      prisma.pet.findMany({
        where: {
          AND: [
            searchParams.petId ? { id: parseInt(searchParams.petId) } : {},
            // Only filter by userId if not admin
            ...(!isAdmin ? [{ userId: userId }] : [])
          ]
        },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      }),
      prisma.veterinarian.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      }),
      searchParams.petId ? prisma.appointment.findMany({
        where: { 
          petId: parseInt(searchParams.petId),
          status: 'completed'
        },
        orderBy: { date: 'desc' },
        take: 10,
      }) : null,
    ]);

    return (
      <div className="w-full mx-auto px-6 sm:px-8 lg:px-12 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">New Prescription</h1>
            <Link href="/list/prescriptions">
              <Button variant="outline">Back to List</Button>
            </Link>
          </div>
          <ErrorBoundary>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <PrescriptionForm
                pets={pets}
                veterinarians={veterinarians}
                appointments={appointments}
                userId={userId}
              />
            </div>
          </ErrorBoundary>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading form data:', error);
    throw error;
  }
}
