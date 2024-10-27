import { updateMissedAppointments } from "./action";

export async function setupCronJobs() {
  // Run every hour
  setInterval(async () => {
    try {
      const updatedCount = await updateMissedAppointments();
      console.log(`Updated ${updatedCount} missed appointments`);
    } catch (error) {
      console.error('Error updating missed appointments:', error);
    }
  }, 1000 * 60 * 60); // Every hour
}