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
    const { petId, date, weight, temperature, diagnosis, treatment, notes } = body;

    // Validate and parse the input data
    const parsedPetId = parseInt(petId);
    const parsedWeight = parseFloat(weight);
    const parsedTemperature = parseFloat(temperature);

    if (isNaN(parsedPetId) || isNaN(parsedWeight) || isNaN(parsedTemperature)) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    const healthRecord = await prisma.healthRecord.create({
      data: {
        pet: { connect: { id: parsedPetId } },
        date: new Date(date),
        weight: parsedWeight,
        temperature: parsedTemperature,
        diagnosis,
        treatment,
        notes,
      },
    });

    return NextResponse.json(healthRecord, { status: 201 });
  } catch (error) {
    console.error("Failed to create health record:", error);
    return NextResponse.json(
      { error: "Failed to create health record" },
      { status: 500 }
    );
  }
}
