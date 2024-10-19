'use client'
import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import { updateUserRole } from "@/lib/userUtils";
import { useUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications

export default function UserPage() {
  // const { user, isLoaded } = useUser();
  // const [loading, setLoading] = useState(true); // State to manage loading
  // const [error, setError] = useState(""); // State to manage errors

  // // Check if user is loaded
  // useEffect(() => {
  //   if (!isLoaded) return; // Wait until user data is loaded

  //   // Redirect to sign-in if not authenticated
  //   if (!user) {
  //     redirect('/sign-in');
  //     return;
  //   }

  //   // Call the server action to update user role
  //   const updateRole = async () => {
  //     try {
  //       const result = await updateUserRole(); // Pass the user ID to the update function

  //       if (!result || !result.success) {
  //         console.error(result?.error); // Log error if role assignment fails
  //         setError(result?.error || 'Error updating user role'); // Set error message
  //         toast.error(result?.error || 'Error updating user role'); // Show error notification
  //       } else {
  //         toast.success('User role updated successfully!'); // Show success notification
  //       }
  //     } catch (error) {
  //       console.error('Error during role update:', error);
  //       setError('An unexpected error occurred during role update');
  //       toast.error('An unexpected error occurred during role update'); // Show error notification
  //     } finally {
  //       setLoading(false); // Set loading to false after role assignment
  //     }
  //   };

  //   updateRole(); // Call the async function to update the role
  // }, [isLoaded, user]); // Dependency array includes isLoaded and user

  // if (loading) return <div>Loading...</div>; // Show loading state while checking

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule</h1>
          <BigCalendar />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
};

