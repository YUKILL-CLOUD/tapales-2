'use client'
import { useState } from "react";
import BigCalendar from "@/components/BigCalendar";
import Announcements from "@/components/Announcements";
import UserProfileSummary from "@/components/UserProfileSummary";
import UpcomingAppointments from "@/components/UpcomingAppointments";
import PetSummary from "@/components/PetSummary";
import RecentActivities from "@/components/RecentActivities";
import { User, Pet } from "@prisma/client";
import { AppointmentWithRelations } from "@/components/AppointmentTable";
import { Announcement } from '@/types/announcement';

import { Activity } from '@/types/activity';

interface UserPageClientProps {
  initialUser: User | null;
  upcomingAppointments: AppointmentWithRelations[];
  userPets: Pet[];
  announcements: Announcement[];
  activities: Activity[];
}

export default function UserPageClient({ 
  initialUser, 
  upcomingAppointments, 
  userPets,
  announcements,
  activities
}: UserPageClientProps) {
  const [user] = useState<User | null>(initialUser);

  if (!user) return <div>User not found</div>;

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3 flex flex-col gap-4">
        <UserProfileSummary user={user} />
        <div className="bg-white p-4 rounded-md shadow-md hover:shadow-lg transition-shadow duration-200">
          <h1 className="text-xl font-semibold mb-4">Schedule</h1>
          <div style={{ height: '500px' }}>
          <BigCalendar
          events={upcomingAppointments.map(appointment => ({
            title: `${appointment.pet.name}`,
            fullTitle: `${appointment.pet.name} - ${appointment.service.name}`,
            start: new Date(appointment.date),
            end: new Date(appointment.date),
            allDay: true,
          }))}
          />
          
          </div>
        </div>
        <PetSummary pets={userPets} />
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <Announcements announcements={announcements} />
        <UpcomingAppointments appointments={upcomingAppointments} />
        <RecentActivities activities={activities} />
      </div>
    </div>
  );
}
