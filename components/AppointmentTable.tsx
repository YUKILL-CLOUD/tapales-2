'use client'
import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { updateAppointment, deleteAppointment } from '@/lib/action';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Appointment, Pet, Service, User } from '@prisma/client';
import { UpdateAppointmentModal } from './UpdateAppointmentModal';
import { StatusBadge } from '@/components/StatusBadge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { MoreHorizontal, Calendar, Clock, X, Pencil } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type AppointmentWithRelations = Appointment & {
    pet: Pet;
    service: Service;
    petId: number;
    serviceId: number;
    user: User;
};

type AppointmentTableProps = {
    appointments: AppointmentWithRelations[];
    refreshAppointments: () => void;
  };

export function AppointmentTable({ appointments, refreshAppointments }: AppointmentTableProps) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithRelations | null>(null);

  const handleUpdate = (appointment: AppointmentWithRelations) => {
    setSelectedAppointment(appointment);
    setIsUpdateModalOpen(true);
  };

  const handleCancel = async (appointmentId: number) => {
    try {
      const result = await deleteAppointment({} as any, appointmentId);
      if (result.success) {
        toast.success('Appointment cancelled successfully');
        refreshAppointments();
      } else {
        toast.error(result.error || 'Failed to cancel appointment');
      }
    } catch (error) {
      toast.error('An error occurred while cancelling the appointment');
    }
  };

  const renderActions = (appointment: AppointmentWithRelations) => (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 flex items-center justify-center">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => handleUpdate(appointment)} className="flex items-center justify-between">
            Update <Pencil className="h-4 w-4 ml-2" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 flex items-center justify-center text-red-500 hover:text-red-700">
            <X className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the appointment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleCancel(appointment.id)} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  return (
    <>
      <Table>
        <TableCaption>A list of your appointments.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Pet</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{appointment.pet.name}</TableCell>
              <TableCell>{appointment.service.name}</TableCell>
              <TableCell>{format(new Date(appointment.date), 'yyyy-MM-dd')}</TableCell>
              <TableCell>{format(new Date(appointment.time), 'hh:mm a')}</TableCell>
              <TableCell><StatusBadge status={appointment.status} /></TableCell>
              <TableCell>{renderActions(appointment)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isUpdateModalOpen && selectedAppointment && (
        <UpdateAppointmentModal
          appointment={selectedAppointment}
          onClose={() => setIsUpdateModalOpen(false)}
          onUpdate={refreshAppointments}
        />
      )}
    </>
  );
}
