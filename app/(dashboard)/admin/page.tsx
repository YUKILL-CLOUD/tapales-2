// import React from "react";
// import Announcements from "@/components/Announcements";
// import prisma from "@/lib/prisma";
// import StatCard from "@/components/StatCard";
// import PetCountChart from "@/components/PetCountChart";
// import AppointmentCountChart from "@/components/AppointmentCountChart";
// import { AdminAppointmentCalendar } from "@/components/adminAppointmentCalendar";

// const AdminPage = async () => {
//   // Fetch summary data
//   const [petCount, userCount, appointmentCount] = await Promise.all([
//     prisma.pet.count(),
//     prisma.user.count(),
//     prisma.appointment.count(),
//   ]);

//   // Fetch data for PetCountChart
//   const petCountData = await prisma.pet.groupBy({
//     by: ['createdAt'],
//     _count: {
//       id: true
//     },
//     orderBy: {
//       createdAt: 'asc'
//     },
//     take: 12 // Last 12 months
//   });

//   // Fetch data for AppointmentCountChart
//   const appointmentCountData = await prisma.appointment.groupBy({
//     by: ['date'],
//     _count: {
//       id: true
//     },
//     orderBy: {
//       date: 'asc'
//     },
//     take: 12 // Last 12 months
//   });

//   // Fetch upcoming appointments for the calendar
//   const upcomingAppointments = await prisma.appointment.findMany({
//     where: {
//       date: {
//         gte: new Date(),
//       },
//     },
//     include: {
//       pet: true,
//       service: true,
//       user: true,
//     },
//     orderBy: {
//       date: 'asc',
//     },
//     take: 100, // Adjust this number as needed
//   });

//   // Serialize the data
//   const serializedPetCountData = petCountData.map(item => ({
//     ...item,
//     createdAt: item.createdAt.toISOString(),
//   }));

//   const serializedAppointmentCountData = appointmentCountData.map(item => ({
//     ...item,
//     date: item.date.toISOString(),
//   }));

//   const serializedUpcomingAppointments = upcomingAppointments.map(appointment => ({
//     ...appointment,
//     date: appointment.date.toISOString(),
//     createdAt: appointment.createdAt.toISOString(),
//     updatedAt: appointment.updatedAt.toISOString(),
//     pet: {
//       ...appointment.pet,
//       createdAt: appointment.pet.createdAt.toISOString(),
//       updatedAt: appointment.pet.updatedAt.toISOString(),
//       birthday: appointment.pet.birthday.toISOString(),
//     },
//     user: {
//       ...appointment.user,
//       createdAt: appointment.user.createdAt.toISOString(),
//       updatedAt: appointment.user.updatedAt.toISOString(),
//     },
//   }));

//   return (
//     <div className="flex-1 space-y-4 p-8 pt-6">
//       <div className="flex items-center justify-between space-y-2">
//         <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
//       </div>
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <StatCard title="Total Pets" value={petCount} />
//         <StatCard title="Total Users" value={userCount} />
//         <StatCard title="Total Appointments" value={appointmentCount} />
//       </div>
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//         <div className="col-span-4">
//           <PetCountChart data={serializedPetCountData} />
//         </div>
//         <div className="col-span-3">
//           <AppointmentCountChart data={serializedAppointmentCountData} />
//         </div>
//       </div>
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//         <div className="col-span-4">
//           <AdminAppointmentCalendar appointments={serializedUpcomingAppointments} />
//         </div>
//         <div className="col-span-3">
//           <Announcements />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminPage;

import React from "react";
import EventCalendar from "@/components/EventCalendar";
import UserCard from "@/components/UseCard";
import CountChartContainer from "@/components/CountChartContainer";
import prisma from "@/lib/prisma";
import AppointmentChart from '@/components/FinanceChart';

interface AppointmentData {
  date: string;
  pending: number;
  scheduled: number;
  completed: number;
  missed: number;
}

const AdminPage = async () => {
  // Fetch upcoming appointments
  const upcomingAppointments = await prisma.appointment.findMany({
    where: {
      date: {
        gte: new Date(),
      },
    },
    include: {
      pet: true,
      service: true,
      user: true,
    },
    orderBy: {
      date: 'asc',
    },
    take: 10, // Limit to 10 upcoming appointments
  });
 // Format appointments for the EventCalendar component
 const formattedAppointments = upcomingAppointments.map(appointment => ({
  id: appointment.id,
  title: `${appointment.pet.name} - ${appointment.service.name}`,
  date: appointment.date,
  time: appointment.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  description: `Owner: ${appointment.user.firstName} ${appointment.user.lastName}`,
}));

  async function getAppointmentData(): Promise<AppointmentData[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const appointments = await prisma.appointment.groupBy({
      by: ['date', 'status'],
      where: {
        date: {
          gte: thirtyDaysAgo,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        date: 'asc', // Add this to sort by date ascending
      },
    });

    const processedData = appointments.reduce<Record<string, AppointmentData>>((acc, curr) => {
      const date = curr.date.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          pending: 0,
          scheduled: 0,
          completed: 0,
          missed: 0,
        };
      }
      if (curr.status) {
        acc[date][curr.status as keyof Omit<AppointmentData, 'date'>] = curr._count.id;
      }
      return acc;
    }, {});

    // Convert to array and sort by date
    return Object.values(processedData).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  const appointmentData = await getAppointmentData();
  
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between  flex-wrap">
            <UserCard type="user" />
            <UserCard type="pet" />
            <UserCard type="appointment" />
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px] shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CountChartContainer />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full h-[500px] shadow-lg hover:shadow-xl transition-shadow duration-300">
          <AppointmentChart data={appointmentData} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <div className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <EventCalendar appointments={formattedAppointments} />
        </div>
      </div>
    </div>
  );
};
export default AdminPage;
