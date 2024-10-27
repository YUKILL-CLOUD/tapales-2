
'use client'
import React, { useState } from 'react';
import { AppointmentForm } from './AppointmentForm';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type AppointmentFormModalProps = {
  pets: { id: number; name: string }[];
  services: { id: number; name: string }[];
  onAppointmentCreated: () => void;

};

export function AppointmentFormModal({ pets, services, onAppointmentCreated }: AppointmentFormModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add Appointment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Appointment</DialogTitle>
        </DialogHeader>
        <AppointmentForm pets={pets} services={services} onClose={handleClose} onAppointmentCreated={onAppointmentCreated} />
      </DialogContent>
    </Dialog>
  );
}