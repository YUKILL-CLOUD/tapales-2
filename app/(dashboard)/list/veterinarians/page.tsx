"use client";

import { useState, useEffect } from 'react';
import { VeterinarianForm } from '@/components/forms/VeterinarianForm';
import VeterinarianProfile from '@/components/VeterinarianProfile';
import { handleSubmit, getVeterinarianData } from './actions';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Veterinarian } from '@prisma/client';

export default function VeterinarianPage() {
    const [veterinarian, setVeterinarian] = useState<Veterinarian | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchVeterinarianData();
    }, []);

    const fetchVeterinarianData = async () => {
        const data = await getVeterinarianData();
        setVeterinarian(data);
    };

    const onSubmit = async (formData: FormData) => {
        const result = await handleSubmit(formData);
        if (result.success) {
            toast.success("Veterinarian information updated successfully!");
            fetchVeterinarianData();
            setIsEditing(false);
        } else {
            toast.error(result.error || "Failed to update veterinarian information");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Veterinarian Information</h1>
            
            {!isEditing && (
                <>
                    <VeterinarianProfile veterinarian={veterinarian} />
                    <button
                        onClick={() => setIsEditing(true)}
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Edit Information
                    </button>
                </>
            )}

            {isEditing && (
                <VeterinarianForm 
                    initialData={veterinarian || undefined}
                    onSubmit={onSubmit}
                    onClose={() => setIsEditing(false)}
                />
            )}
        </div>
    );
}
