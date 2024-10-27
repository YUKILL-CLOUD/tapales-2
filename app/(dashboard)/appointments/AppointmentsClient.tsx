
'use client'

import { useState } from 'react';
import { AppointmentFormModal } from '@/components/AppointmentFormModal';
import { AppointmentTable, AppointmentWithRelations } from '@/components/AppointmentTable';
import Pagination from '@/components/Pagination'; 
import { fetchAppointments } from '@/lib/action';

type AppointmentsClientProps = {
  initialAppointments: AppointmentWithRelations[];
  initialCount: number;
  pets: { id: number; name: string }[];
  services: { id: number; name: string }[];
  userId: string;
};

export default function AppointmentsClient({ initialAppointments, initialCount, pets, services }: AppointmentsClientProps) {
  const [appointments, setAppointments] = useState<AppointmentWithRelations[]>(initialAppointments);
  const [count, setCount] = useState(initialCount);
  const [page, setPage] = useState(1);

  const refreshAppointments = async () => {
    const { appointments: newAppointments, count: newCount } = await fetchAppointments(page);
    setAppointments(newAppointments);
    setCount(newCount);
  };

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    const { appointments: newAppointments, count: newCount } = await fetchAppointments(newPage);
    setAppointments(newAppointments);
    setCount(newCount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Appointments</h1>
        <AppointmentFormModal pets={pets} services={services} onAppointmentCreated={refreshAppointments} />
      </div>
      <AppointmentTable appointments={appointments} refreshAppointments={refreshAppointments} />
      <Pagination page={page} count={count} onPageChange={handlePageChange} />
    </div>
  );
}
