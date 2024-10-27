export type AppointmentStatus = 'pending' | 'scheduled' | 'completed' | 'cancelled' | 'missed';

export const APPOINTMENT_STATUSES = {
  PENDING: 'pending',
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  MISSED: 'missed',
} as const;
