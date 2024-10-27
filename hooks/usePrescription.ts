import { useState } from "react";
import { PrescriptionWithRelations, PrescriptionStatus } from "@/types/prescriptions";
import { updatePrescriptionStatus } from "@/lib/action";

export function usePrescription(initialPrescription: PrescriptionWithRelations) {
  const [prescription, setPrescription] = useState(initialPrescription);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (newStatus: PrescriptionStatus) => {
    setIsUpdating(true);
    setError(null);
    try {
      const result = await updatePrescriptionStatus(prescription.id, newStatus);
      if (result.success) {
        setPrescription({ ...prescription, status: newStatus });
      } else {
        setError(result.error || 'Failed to update prescription status');
      }
    } catch (err) {
      setError('Failed to update prescription status');
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    prescription,
    isUpdating,
    error,
    updateStatus,
  };
}

