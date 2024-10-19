import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { petId, date, vaccineName, medicineName, manufacturer, weight, nextDueDate, veterinarianId } = body;

    // Validate and parse the input data
    const parsedPetId = parseInt(petId);
    const parsedWeight = parseFloat(weight);
    const parsedVeterinarianId = parseInt(veterinarianId);

    if (isNaN(parsedPetId) || isNaN(parsedWeight) || isNaN(parsedVeterinarianId)) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    const vaccination = await prisma.vaccination.create({
      data: {
        pet: { connect: { id: parsedPetId } },
        date: new Date(date),
        vaccineName,
        medicineName,
        manufacturer,
        weight: parsedWeight,
        nextDueDate: nextDueDate ? new Date(nextDueDate) : null,
        veterinarian: { connect: { id: parsedVeterinarianId } },
      },
    });

    return NextResponse.json(vaccination, { status: 201 });
  } catch (error) {
    console.error("Failed to create vaccination record:", error);
    return NextResponse.json(
      { error: "Failed to create vaccination record" },
      { status: 500 }
    );
  }
}
