'use client'

import { User, Pet, Appointment } from "@prisma/client";
import { updateUserRole } from '@/lib/action';
import { toast } from 'react-toastify';

type AdminUserRowProps = {
  item: User & {pets: Pet[]} & {Appointment: Appointment[]};
};

export default function AdminUserRow({ item }: AdminUserRowProps) {
  const handleDemoteToUser = async () => {
    const result = await updateUserRole(item.clerkUserId, 'user');
    if (result.success) {
      toast.success(`User ${item.firstName} ${item.lastName} demoted to regular user`);
      // You might want to refresh the page or update the UI here
    } else {
      toast.error("Failed to demote user");
    }
  };

  return (
    <tr className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4">
        <div className="md:hidden xl:block w-10 h-10 rounded-full overflow-hidden">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <img src="/noAvatar.png" alt="" />
          )}
        </div>  
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.firstName} {item.lastName}</h3>
          <p className="text-xs text-gray-500">{item.id}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.email}</td>
      <td className="hidden md:table-cell">{item.pets?.map((pet) => pet.name).join(', ') || "-"}</td>
      <td className="hidden md:table-cell">{item.createdAt.toLocaleDateString()}</td>
      <td>
        <button
          onClick={handleDemoteToUser}
          className="px-2 py-1 rounded-md text-xs bg-yellow-500 text-white"
        >
          Demote to User
        </button>
      </td>
    </tr>
  );
}