'use client'

import { useEffect, useState } from 'react';
import { AdminAppointmentTable } from './AdminAppointmentTable';
import { AppointmentWithRelations } from '@/components/AppointmentTable';
import Pagination from "@/components/Pagination";
import { updateAppointmentStatus, deleteAppointment, fetchAdminAppointments } from '@/lib/action';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { MoreHorizontal } from "lucide-react"
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type AdminAppointmentsClientProps = {
  initialPendingAppointments: AppointmentWithRelations[];
  initialScheduledAppointments: AppointmentWithRelations[];
  initialCompletedAppointments: AppointmentWithRelations[];
  initialMissedAppointments: AppointmentWithRelations[];
  initialCounts: {
    pending: number;
    scheduled: number;
    completed: number;
    missed: number;
  };
};

export default function AdminAppointmentsClient({
  initialPendingAppointments,
  initialScheduledAppointments,
  initialCompletedAppointments,
  initialMissedAppointments,
  initialCounts,
}: AdminAppointmentsClientProps) {
  const [appointments, setAppointments] = useState({
    pending: initialPendingAppointments,
    scheduled: initialScheduledAppointments,
    completed: initialCompletedAppointments,
    missed: initialMissedAppointments,
  });

  const [counts, setCounts] = useState(initialCounts);
  const [pages, setPages] = useState({
    pending: 1,
    scheduled: 1,
    completed: 1,
    missed: 1,
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Update pages state when URL parameters change
    const pendingPage = parseInt(searchParams?.get('pendingPage') || '1');
    const scheduledPage = parseInt(searchParams?.get('scheduledPage') || '1');
    const completedPage = parseInt(searchParams?.get('completedPage') || '1');
    const missedPage = parseInt(searchParams?.get('missedPage') || '1');

    setPages({
      pending: pendingPage,
      scheduled: scheduledPage,
      completed: completedPage,
      missed: missedPage,
    });
  }, [searchParams]);

  const refreshAppointments = async () => {
    const { 
      pendingAppointments, 
      scheduledAppointments, 
      completedAppointments,
      missedAppointments,
      pendingCount, 
      scheduledCount,
      completedCount,
      missedCount 
    } = await fetchAdminAppointments(
      pages.pending, 
      pages.scheduled,
      pages.completed,
      pages.missed
    );
    
    setAppointments(prev => ({
      pending: pendingAppointments,
      scheduled: scheduledAppointments,
      completed: completedAppointments,
      missed: missedAppointments
    }));
    
    setCounts(prev => ({
      pending: pendingCount,
      scheduled: scheduledCount,
      completed: completedCount,
      missed: missedCount
    }));
  };

  const getAvailableStatusTransitions = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending':
        return ['scheduled', 'cancelled'];
      case 'scheduled':
        return ['completed', 'cancelled', 'missed'];
      case 'completed':
        return ['scheduled']; // Allow rescheduling
      case 'missed':
        return ['scheduled']; // Allow rescheduling
      default:
        return [];
    }
  };

  const handleStatusChange = async (appointmentId: number, newStatus: string) => {
    try {
      const result = await updateAppointmentStatus({} as any, { id: appointmentId, status: newStatus });
      if (result.success) {
        toast.success(`Appointment status updated to ${newStatus}`);
        refreshAppointments();
      } else {
        toast.error(result.error || 'Failed to update appointment status');
      }
    } catch (error) {
      toast.error('An error occurred while updating the appointment status');
    }
  };

  const handleDelete = async (appointmentId: number) => {
    try {
      const result = await deleteAppointment({} as any, appointmentId);
      if (result.success) {
        toast.success('Appointment cancelled successfully');
        // Update the local state
        setAppointments(prev => ({
          ...prev,
          pending: prev.pending.filter(a => a.id !== appointmentId),
          scheduled: prev.scheduled.filter(a => a.id !== appointmentId)
        }));
        setCounts(prev => ({
          ...prev,
          pending: prev.pending - 1,
          scheduled: prev.scheduled - 1
        }));
      } else {
        toast.error(result.error || 'Failed to cancel appointment');
      }
    } catch (error) {
      toast.error('An error occurred while cancelling the appointment');
    }
  };

  const renderActions = (appointment: AppointmentWithRelations) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {getAvailableStatusTransitions(appointment.status).map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleStatusChange(appointment.id, status)}
          >
            Mark as {status}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600"
          onClick={() => handleDelete(appointment.id)}
        >
          Cancel Appointment
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );


  const handlePageChange = (type: 'pending' | 'scheduled' | 'completed' | 'missed', newPage: number) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set(`${type}Page`, newPage.toString());
    router.push(`/list/appointments?${params.toString()}`);
  };

  useEffect(() => {
    refreshAppointments();
  }, [pages.pending, pages.scheduled, pages.completed, pages.missed, refreshAppointments]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Appointment Management</h1>
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">
            Pending ({counts.pending})
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            Scheduled ({counts.scheduled})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({counts.completed})
          </TabsTrigger>
          <TabsTrigger value="missed">
            Missed ({counts.missed})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminAppointmentTable 
                appointments={appointments.pending}
                actions={renderActions}
              />
              <div className="mt-4">
                <Pagination 
                  page={pages.pending} 
                  count={counts.pending} 
                  onPageChange={(page) => handlePageChange('pending', page)} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminAppointmentTable 
                appointments={appointments.scheduled}
                actions={renderActions}
              />
              <div className="mt-4">
                <Pagination 
                  page={pages.scheduled} 
                  count={counts.scheduled} 
                  onPageChange={(page) => handlePageChange('scheduled', page)} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminAppointmentTable 
                appointments={appointments.completed}
                actions={renderActions}
              />
              <div className="mt-4">
                <Pagination 
                  page={pages.completed} 
                  count={counts.completed} 
                  onPageChange={(page) => handlePageChange('completed', page)} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="missed">
          <Card>
            <CardHeader>
              <CardTitle>Missed Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminAppointmentTable 
                appointments={appointments.missed}
                actions={renderActions}
              />
              <div className="mt-4">
                <Pagination 
                  page={pages.missed} 
                  count={counts.missed} 
                  onPageChange={(page) => handlePageChange('missed', page)} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
