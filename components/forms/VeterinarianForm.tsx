"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useState } from "react";
import { Veterinarian } from "@prisma/client";

const veterinarianSchema = z.object({
  name: z.string().min(1, "Name is required"),
  specialization: z.string().min(1, "Specialization is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  prclicNo: z.string().min(1, "PRC License Number is required"),
  prtNo: z.string().min(1, "PRT Number is required"),
  tinNo: z.string().min(1, "TIN Number is required"),
});

type VeterinarianSchema = z.infer<typeof veterinarianSchema>;

type VeterinarianFormProps = {
  initialData?: Partial<Veterinarian>;
  onSubmit: (formData: FormData) => Promise<void>;
  onClose: () => void;
};

export function VeterinarianForm({ initialData, onSubmit, onClose }: VeterinarianFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VeterinarianSchema>({
    resolver: zodResolver(veterinarianSchema),
    defaultValues: initialData || undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (data: VeterinarianSchema) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      await onSubmit(formData);
    } catch (error) {
      console.error("Failed to update veterinarian information:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6">Edit Veterinarian Information</h2>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <InputField
          label="Name"
          {...register("name")}
          error={errors.name}
          register={register}
        />
        <InputField
          label="Specialization"
          {...register("specialization")}
          error={errors.specialization}
          register={register}
        />
        <InputField
          label="Phone"
          {...register("phone")}
          error={errors.phone}
          register={register}
        />
        <InputField
          label="Email"
          {...register("email")}
          error={errors.email}
          register={register}
        />
        <InputField
          label="PRC License Number"
          {...register("prclicNo")}
          error={errors.prclicNo}
          register={register}
        />
        <InputField
          label="PRT Number"
          {...register("prtNo")}
          error={errors.prtNo}
          register={register}
        />
        <InputField
          label="TIN Number"
          {...register("tinNo")}
          error={errors.tinNo}
          register={register}
        />
        <div className="flex justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isSubmitting ? "Updating..." : "Update Veterinarian Information"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
