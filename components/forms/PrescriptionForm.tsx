"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { MedicationFields } from "./MedicationFields";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createPrescriptionAction } from "@/lib/actions/prescriptionActions";

// Schema definitions remain the same
const medicationSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  instructions: z.string().min(1, "Instructions are required"),
});

const prescriptionSchema = z.object({
  petId: z.number().min(1, "Pet is required"),
  veterinarianId: z.number().min(1, "Veterinarian is required"),
  appointmentId: z.number().optional(),
  medications: z.array(medicationSchema).min(1, "At least one medication is required"),
  status: z.enum(["active", "completed", "cancelled"]).default("active"),
  userId: z.string(), // Add this line to match schema
});

type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

type PrescriptionFormProps = {
  pets: { id: number; name: string }[];
  veterinarians: { id: number; name: string }[];
  appointments: any[] | null;
  userId: string;
};

export function PrescriptionForm({
  pets,
  veterinarians,
  appointments,
  userId,
}: PrescriptionFormProps) {
  console.log('PrescriptionForm - Props received:', { pets, veterinarians, appointments, userId });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const form = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      petId: undefined,
      veterinarianId: undefined,
      appointmentId: undefined,
      medications: [{ name: '', dosage: '', instructions: '' }],
      status: "active",
      userId: userId, // Add this line
    },
  });

  async function onSubmit(data: PrescriptionFormData) {
    console.log('Form - Submit data:', data);
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      
      formData.append('petId', data.petId.toString());
      formData.append('veterinarianId', data.veterinarianId.toString());
      formData.append('userId', userId);
      if (data.appointmentId) {
        formData.append('appointmentId', data.appointmentId.toString());
      }
      formData.append('medications', JSON.stringify(data.medications));
      formData.append('status', data.status);

      console.log('Form - FormData created:', Object.fromEntries(formData.entries()));
      
      const result = await createPrescriptionAction(formData);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }
      
      toast.success('Prescription created successfully');
      router.push('/list/prescriptions');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="petId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pet</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a pet" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {pets.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id.toString()}>
                        {pet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="veterinarianId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Veterinarian</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a veterinarian" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {veterinarians.map((vet) => (
                      <SelectItem key={vet.id} value={vet.id.toString()}>
                        {vet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {appointments && (
            <FormField
              control={form.control}
              name="appointmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Related Appointment</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an appointment" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {appointments.map((apt) => (
                        <SelectItem key={apt.id} value={String(apt.id)}>
                          {format(apt.date, 'PPP')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="space-y-4">
            <label className="block text-sm font-medium">Medications</label>
            <MedicationFields />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Prescription'}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
