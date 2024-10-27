import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import PrescriptionsClient from "./PrescriptionsClient";
import { Suspense } from "react";
import { LoadingState } from "@/components/LoadingState";
import { Prisma } from "@prisma/client";
import { PrescriptionWithRelations } from "@/types/prescriptions";

export default async function PrescriptionsPage({
  searchParams,
}: {
  searchParams: { 
    page?: string;
    search?: string;
    status?: string;
  };
}) {
  const { userId } = auth();
  const user = await currentUser();
  
  if (!userId || !user) {
    redirect("/sign-in");
  }

  const isAdmin = user.publicMetadata.role === "admin";
  
  const page = Number(searchParams?.page) || 1;
  const search = searchParams?.search || "";
  const status = searchParams?.status;

  const where: Prisma.PrescriptionWhereInput = {
    ...(search && {
      OR: [
        { pet: { name: { contains: search, mode: 'insensitive' } } },
        { veterinarian: { name: { contains: search, mode: 'insensitive' } } },
      ],
    }),
    ...(status && { status }),
    // Only show prescriptions for pets owned by the user if not admin
    ...(!isAdmin && {
      pet: {
        user: {
          clerkUserId: userId
        }
      } // Direct link to user
    })
  };

  try {
    const [prescriptions, count] = await prisma.$transaction([
      prisma.prescription.findMany({
        where,
        include: {
          pet: {
            include: {
              user: true
            }
          },
          veterinarian: true,
          appointment: true,
          user: true,
        },
        orderBy: { createdAt: 'desc' },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (page - 1),
      }),
      prisma.prescription.count({ where }),
    ]);

    return (
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<LoadingState />}>
          <PrescriptionsClient 
            prescriptions={prescriptions as unknown as PrescriptionWithRelations[]} 
            count={count}
            isAdmin={isAdmin}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error loading prescriptions:', error);
    throw new Error('Failed to load prescriptions. Please try again later.');
  }
}
