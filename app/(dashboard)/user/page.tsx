'use server'
import { auth } from '@clerk/nextjs/server';
import { getUserById } from "@/lib/users";
import UserPageClient from './UserPageClient';
import { redirect } from 'next/navigation';
import { fetchUserAppointments, getAnnouncements, fetchActivities } from '@/lib/action';
import { PrismaClient } from '@prisma/client';
// Implied import for getAnnouncements

const prisma = new PrismaClient();

export default async function UserPage() {
  const { userId } = auth();
  if (!userId) return redirect('/sign-in');

  const { user, error } = await getUserById({ clerkUserId: userId });

  if (error) {
    console.error("Failed to fetch user data:", error);
    return <div>Error loading user data</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  const upcomingAppointments = await fetchUserAppointments(user.id);

  const userPets = await prisma.pet.findMany({
    where: { userId: user.id },
    take: 5, // Limit to 5 pets for the summary
  });

  const announcements = await getAnnouncements(3); // Get latest 3 announcements
  console.log('Fetched announcements:', announcements); // Debug log
  
  const activities = await fetchActivities(user.id);

  return (
    <UserPageClient 
      initialUser={user}
      upcomingAppointments={upcomingAppointments}
      userPets={userPets}
      announcements={announcements}
      activities={activities}
    />
  );
}
