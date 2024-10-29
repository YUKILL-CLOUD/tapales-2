// "use client"
// import { useEffect, useState } from 'react';
// import { useUser } from '@clerk/nextjs';
// import { redirect, useRouter} from 'next/navigation'; // Ensure you are using the correct import for redirect
// import { toast } from 'react-toastify'; // Make sure to have react-toastify installed for notifications
// import 'react-toastify/dist/ReactToastify.css';
// import { updateUserRole } from "@/lib/userUtils";
// import { createUserAfterSignUp } from '@/lib/users';

// export default function RedirectPage () {
//     const router = useRouter();
//   const { user, isLoaded } = useUser();
//   const [loading, setLoading] = useState(true); // State to manage loading

//   // Check if user is loaded
//   useEffect(() => {
//     if (!isLoaded) return;

//     if (!user) {
//       router.push('/sign-in');
//       return;
//     }

//     const initializeUser = async () => {
//       try {
//         // Create user in your database
//         await createUserAfterSignUp();
//         await updateUserRole();
//         const role = user.publicMetadata.role as string;
//         if (role) {
//           router.push(`/${role}`);
//         } else {
//           router.push('/user'); // Default route if no role is set
//         }
//         toast.success('Account setup completed successfully!');
//       } catch (error) {
//         console.error('Error during user initialization:', error);
//         toast.error('An unexpected error occurred. Please try again.');
//         router.push('/'); // Redirect to home page on error
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeUser();
//   }, [isLoaded, user, router]);

//   if (loading) return <div>Setting up your account...</div>;

//   return null;
// }

"use client"
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateUserRole } from "@/lib/userUtils";
import { createUserAfterSignUp } from '@/lib/users';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const MAX_ATTEMPTS = 3;
const RETRY_DELAY = 2000; // 2 seconds

export default function RedirectPage() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [attempts, setAttempts] = useState(0);


  useEffect(() => {
    
    let timeoutId: NodeJS.Timeout;

    if (!isLoaded || isProcessing) return;

    if (!user) {
      router.push('/sign-in');
      return;
    }
  // Prevent further attempts if max is reached
  if (attempts >= MAX_ATTEMPTS) {
    setError('Maximum attempts reached. Please contact support.');
    return;
  }
    const initializeUser = async () => {
      setIsProcessing(true);
      try {

        if (user.publicMetadata?.role) {
          router.push(`/${user.publicMetadata.role}`);
          return;
        }

        setStep(1);
        await createUserAfterSignUp();
        
        setStep(2);
        const { success, error } = await updateUserRole();
        if (!success) throw new Error(error || 'Failed to update user role');
        
        setStep(3);
        await user.reload();
        const role = user.publicMetadata.role as string;
        
        if (role) {
          router.push(`/${role}`);
          toast.success('Account setup completed successfully!');
        } else {
             // Instead of immediate retry, schedule next attempt
          setAttempts(prev => prev + 1);
          if (attempts + 1 < MAX_ATTEMPTS) {
            timeoutId = setTimeout(() => {
              setIsProcessing(false); // Allow next attempt after delay
            }, RETRY_DELAY);
          }
          throw new Error('Role not set after initialization');
        }
      } catch (error) {
        setAttempts(prev => prev + 1);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        setError(attempts + 1 >= MAX_ATTEMPTS 
          ? `${errorMessage}. Maximum attempts reached. Please contact support.`
          : errorMessage
        );
        toast.error(errorMessage);
      }finally {
        setIsProcessing(false);
      }
    };

    initializeUser();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoaded, user, router, isProcessing, attempts]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="text-red-500 text-xl">⚠️</div>
              <h2 className="text-xl font-semibold text-gray-900">Setup Error</h2>
              <p className="text-gray-500">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-mainColor-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Setting up your account</h2>
            <div className="space-y-2">
              <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-mainColor-600' : 'text-gray-400'}`}>
                <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                  {step > 1 && <div className="w-2 h-2 rounded-full bg-current" />}
                </div>
                <span>Creating your account</span>
              </div>
              <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-mainColor-600' : 'text-gray-400'}`}>
                <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                  {step > 2 && <div className="w-2 h-2 rounded-full bg-current" />}
                </div>
                <span>Setting up permissions</span>
              </div>
              <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-mainColor-600' : 'text-gray-400'}`}>
                <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                  {step > 3 && <div className="w-2 h-2 rounded-full bg-current" />}
                </div>
                <span>Preparing your dashboard</span>
              </div>
            </div>
            <p className="text-sm text-gray-500">Please wait while we set up your account...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
