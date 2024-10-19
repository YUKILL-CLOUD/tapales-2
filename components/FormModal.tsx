"use client";

import { deletePet } from "@/lib/action";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const PetForm = dynamic(() => import("./forms/PetForm"), {
  loading: () => <h1>Loading...</h1>,
});

const FormModal = ({
  table,
  type,
  data,
  id,
  onSubmitSuccess,
}: {
  table:
    | "pet"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
  onSubmitSuccess?: () => void; // New prop type
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (id) {
      const result = await deletePet({ success: false, error: null }, id); // Pass ActionResult and petId
      if (result.success) {
        toast.success("Pet has been deleted!");
        setOpen(false);
        router.refresh(); // Refresh to update the list
        if (onSubmitSuccess) onSubmitSuccess(); // Call success callback
      } else {
        toast.error(result.error || "Failed to delete pet.");
      }
    }
  };

  const Form = () => {
    if (type === "delete") {
      return (
        <form className="p-4 flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleDelete(); }}>
          <span className="text-center font-medium">
            All data will be lost. Are you sure you want to delete this {table}?
          </span>
          <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
            Delete
          </button>
        </form>
      );
    } else if (type === "create" || type === "update") {
      return (
        <PetForm type={type} data={data} onSubmitSuccess={() => {
          setOpen(false); // Close modal on success
          if (onSubmitSuccess) onSubmitSuccess(); // Call success callback
        }} />
      );
    }
    
    return <div>Form not found!</div>;
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;