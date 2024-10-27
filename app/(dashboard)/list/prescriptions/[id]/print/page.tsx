import { auth, currentUser } from "@clerk/nextjs/server";
import { PrintablePrescription } from "@/components/PrintablePrescription";
import { Button } from "@/components/ui/button";
import { PrintButton } from "@/components/PrintButton";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { PrintablePrescriptionView } from "@/components/PrintablePrescriptionView";

export default async function PrintPrescriptionPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { userId } = auth();
  const user = await currentUser();
  
  if (!userId || !user) {
    redirect("/sign-in");
  }

  const prescription = await prisma.prescription.findUnique({
    where: { id: parseInt(id) },
    include: {
      pet: {
        include: {
          user: true
        }
      },
      veterinarian: true,
      appointment: true,
    },
  });

  if (!prescription) {
    notFound();
  }

  // Check if user has permission to view this prescription
  const isAdmin = user.publicMetadata.role === "admin";
  const isOwner = prescription.pet.user.clerkUserId === userId;

  // Only redirect if user is neither admin nor owner
  if (!isAdmin && !isOwner) {
    redirect("/unauthorized");
  }

  const clinicInfo = {
    name: "Tapales Vet CLinic",
    address: "399 Huervana St, La Paz, Iloilo City, 5000 Iloilo",
    phone: "(123) 456-7890",
    email: "TapalesVetClinic@gmail.com",
    license: "VET-12345",
};

  return (
    <div className="container mx-auto py-8 print:py-0">
      <PrintablePrescriptionView 
        prescription={prescription}
        clinicInfo={clinicInfo}
        id={id}
      />
    </div>
  );
}
