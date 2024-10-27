import { Pet, Veterinarian, Appointment, Prescription } from "@prisma/client";

export type PrescriptionStatus = 'active' | 'completed' | 'cancelled';

export interface PrescriptionBase {
  id: number;
  petId: number;
  veterinarianId: number;
  appointmentId?: number;
  medication: string;
  dosage: string;
  instructions: string;
  startDate: Date;
  endDate?: Date;
  status: PrescriptionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type PrescriptionWithRelations = {
  id: number;
  petId: number;
  userId: string;
  appointmentId?: number | null;
  veterinarianId: number;
  medication: any[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
  pet: {
    id: number;
    name: string;
    type: string;
    breed: string;
    user: {
      id: string;
      firstName?: string | null;
      lastName?: string | null;
    };
  };
  user: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
  };
  veterinarian: {
    id: number;
    name: string;
    prclicNo: string;
  };
  appointment?: {
    id: number;
    date: Date;
  } | null;
};

export interface ClinicInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  license: string;
  logo?: string;
}

export interface PrintableContent {
  prescription: PrescriptionWithRelations;
  clinicInfo: ClinicInfo;
  qrCode?: string;
}

export type Medication = {
  name: string;
  dosage: string;
  instructions: string;
};

export type PrescriptionFormData = {
  petId: number;
  veterinarianId: number;
  appointmentId?: number;
  medication: Medication[];
  status: 'active' | 'completed' | 'cancelled';
};
