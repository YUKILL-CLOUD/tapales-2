"use client"
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { redirect, useRouter} from 'next/navigation'; // Ensure you are using the correct import for redirect
import { toast } from 'react-toastify'; // Make sure to have react-toastify installed for notifications
import { updateUserRole } from "@/lib/userUtils";

export default function RedirectPage () {
    const router = useRouter();
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(""); // State to manage errors

  // Check if user is loaded
  useEffect(() => {
    const role = user?.publicMetadata.role;
    if (role){
        router.push(`/${role}`)
      }

    if (!isLoaded) return; 
    // Wait until user data is loaded

    // Redirect to sign-in if not authenticated
    if (!user) {
      router.push('/user');
      return;
      
    }

    // Call the server action to update user role
        const updateRole = async () => {
        try {
            const result = await updateUserRole(); // Pass the user ID to the update function

            if (!result || !result.success) {
            console.error(result?.error); // Log error if role assignment fails
            setError(result?.error || 'Error updating user role'); // Set error message
            toast.error(result?.error || 'Error updating user role'); // Show error notification
            } else {
            toast.success('User role updated successfully!'); // Show success notification
              // 3 seconds delay before redirection
            }
        } catch (error) {
            console.error('Error during role update:', error);
            setError('An unexpected error occurred during role update');
            toast.error('An unexpected error occurred during role update'); // Show error notification
        } finally {
            setLoading(false); // Set loading to false after role assignment
        }
        };

    updateRole(); // Call the async function to update the role
  }, [isLoaded, user, router ]); // Dependency array includes isLoaded and user

  if (loading) return <div>Loading...</div>; // Show loading state while checking

    return (
    <div>
        <h1>Role Update Successful</h1>
        <p>Your role has been updated. You will be redirected shortly...</p>
    </div>
    );
};