"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import InputField from "../InputField";
import { petSchema, PetSchema } from "@/lib/formValidationSchema";
import { createPet, deletePet, updatePet } from "@/lib/action";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CldUploadWidget } from 'next-cloudinary';
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

const PetForm = ({
  type,
  data,
  onSubmitSuccess,
}: {
  type: "create" | "update";
  data?: PetSchema & { id: number };
  onSubmitSuccess?: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PetSchema>({
    resolver: zodResolver(petSchema),
    defaultValues: data,
  });

  const { user } = useUser();
  const [img, setImg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (formData: PetSchema) => {
    if (!user?.id) {
      toast.error("Unable to find user, please try again.");
      return;
    }

    setIsSubmitting(true);
    const result = type === "create"
      ? await createPet({ success: false, error: null }, {
          ...formData,
          img: img,
          userId: user.id, // Pass the Clerk user ID
        })
      : await updatePet({ success: false, error: null }, {
          ...formData,
          img: img,
          id: data!.id,
          userId: user.id, // Pass the Clerk user ID for updates as well
        });
    setIsSubmitting(false);

    if (result.success) {
      toast.success(`Pet ${type === "create" ? "created" : "updated"} successfully!`);
      if (onSubmitSuccess) onSubmitSuccess(); // Call the success callback
      if (type === "create") {
        reset();
        setImg(null);
      }
    } else {
      toast.error(result.error || `Failed to ${type} pet. Please try again.`);
    }
  };

  const handleDelete = async () => {
    if (!data?.id) return;

    if (window.confirm("Are you sure you want to delete this pet?")) {
      setIsSubmitting(true);
      const result = await deletePet({ success: false, error: null }, data.id);
      setIsSubmitting(false);

      if (result.success) {
        toast.success("Pet deleted successfully!");
        // You might want to redirect the user or update the UI here
      } else {
        toast.error(result.error || "Failed to delete pet. Please try again.");
      }
    }
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Add your pet" : "Update your pet"}</h1>
      <span className="text-xs text-gray-400 font-medium">Basic Information</span>
      {user && (
        <p className="text-sm text-gray-500">
          Owner: <strong>{user.firstName} {user.lastName}</strong>
        </p>
      )}
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Pet name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Type</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("type")}
            defaultValue={data?.type}
          >
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
          </select>
          {errors.type?.message && (
            <p className="text-xs text-red-400">{errors.type.message.toString()}</p>
          )}
        </div>
        <InputField
          label="Breed"
          name="breed"
          defaultValue={data?.breed}
          register={register}
          error={errors?.breed}
        />
        {/* Removed userId input field */}
      </div>
      <span className="text-xs text-gray-400 font-medium">Personal Information</span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Blood Type"
          name="bloodType"
          defaultValue={data?.bloodType}
          register={register}
          error={errors.bloodType}
        />
        <InputField 
          label="Birthday" 
          name="birthday" 
          type="date" 
          defaultValue={data?.birthday ? data.birthday.toISOString().split("T")[0] : ''}
          register={register} 
          error={errors.birthday} 
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">{errors.sex.message.toString()}</p>
          )}
        </div>
        <CldUploadWidget uploadPreset="tapales" onSuccess={(result: any) => {
          setImg(result.info.secure_url);
        }}>
          {({ open }) => (
            <div
              className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
              onClick={() => open()}
            >
              <Image src="/upload.png" alt="" width={28} height={28} />
              <span>Upload a photo</span>
            </div>
          )}
        </CldUploadWidget>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-400 text-white p-2 rounded-md"
      >
        {isSubmitting ? 'Submitting...' : (type === "create" ? "Create" : "Update")}
      </button>
      
      {type === "update" && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={isSubmitting}
          className="bg-red-400 text-white p-2 rounded-md"
        >
          {isSubmitting ? 'Deleting...' : 'Delete Pet'}
        </button>
      )}
    </form>
  );
};

export default PetForm;
