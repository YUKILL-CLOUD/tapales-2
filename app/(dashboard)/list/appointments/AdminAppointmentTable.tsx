import React from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppointmentWithRelations } from '@/components/AppointmentTable';
import { StatusBadge } from '@/components/StatusBadge';

type AdminAppointmentTableProps = {
  appointments: AppointmentWithRelations[];
  actions: (appointment: AppointmentWithRelations) => React.ReactNode;
  title?: string;  // Make title optional
};

export function AdminAppointmentTable({ appointments, actions }: AdminAppointmentTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[150px]">Pet</TableHead>
            <TableHead className="w-[200px]">Owner</TableHead>
            <TableHead className="w-[150px]">Service</TableHead>
            <TableHead className="w-[120px]">Date</TableHead>
            <TableHead className="w-[100px]">Time</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                No appointments found
              </TableCell>
            </TableRow>
          ) : (
            appointments.map((appointment) => (
              <TableRow key={appointment.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{appointment.pet.name}</TableCell>
                <TableCell>{appointment.user.firstName} {appointment.user.lastName}</TableCell>
                <TableCell>{appointment.service.name}</TableCell>
                <TableCell>{format(new Date(appointment.date), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{format(new Date(appointment.time), 'hh:mm a')}</TableCell>
                <TableCell>
                  <StatusBadge status={appointment.status} />
                </TableCell>
                <TableCell className="text-right">{actions(appointment)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
