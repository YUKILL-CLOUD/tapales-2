import prisma from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ITEM_PER_PAGE } from "@/lib/settings";
import AppointmentsClient from './AppointmentsClient';

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { userId: clerkUserId } = auth();
  const user = await currentUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: clerkUserId || "" },
  });

  if (!dbUser) {
    return redirect('/sign-up');
  }

  const p = searchParams.page ? parseInt(searchParams.page as string) : 1;

  const [appointments, count] = await prisma.$transaction([
    prisma.appointment.findMany({
      where: { userId: dbUser.id },
      include: {
        pet: true,
        service: true,
        user: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.appointment.count({ where: { userId: dbUser.id } }),
  ]);

  const pets = await prisma.pet.findMany({
    where: { userId: dbUser.id },
    select: { id: true, name: true },
  });

  const services = await prisma.service.findMany({
    select: { id: true, name: true },
  });

  return (
    <AppointmentsClient
      initialAppointments={appointments}
      initialCount={count}
      pets={pets}
      services={services}
      userId={dbUser.id}
    />
  );
}