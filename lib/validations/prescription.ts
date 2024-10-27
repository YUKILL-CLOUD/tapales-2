import { z } from "zod";

export const prescriptionSchema = z.object({
  petId: z.number().positive(),
  veterinarianId: z.number().positive(),
  appointmentId: z.number().positive().optional(),
  medication: z.string().min(1, "Medication is required"),
  dosage: z.string().min(1, "Dosage is required"),
  instructions: z.string(),
  startDate: z.date(),
  endDate: z.date().optional(),
  status: z.enum(["active", "completed", "cancelled"]).default("active"),
});

export type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

