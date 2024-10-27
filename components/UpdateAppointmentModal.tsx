// components/UpdateAppointmentModal.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UpdateAppointmentForm } from './UpdateAppointmentForm';
import { AppointmentWithRelations } from './AppointmentTable';

type UpdateAppointmentModalProps = {
  appointment: AppointmentWithRelations;
  onClose: () => void;
  onUpdate: () => void;
};

export function UpdateAppointmentModal({ appointment, onClose, onUpdate }: UpdateAppointmentModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Appointment</DialogTitle>
        </DialogHeader>
        <UpdateAppointmentForm appointment={appointment} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}

