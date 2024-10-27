import React, { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { AppointmentWithRelations } from './AppointmentTable';

type AppointmentCalendarProps = {
  appointments: AppointmentWithRelations[];
  onDateSelect: (date: Date) => void;
};

export function AppointmentCalendar({ appointments, onDateSelect }: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onDateSelect(date);
    }
  };

  const appointmentDates = useMemo(() => {
    return appointments.reduce((acc, appointment) => {
      const dateString = new Date(appointment.date).toDateString();
      acc[dateString] = (acc[dateString] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [appointments]);

  const getDateClassName = (date: Date) => {
    const count = appointmentDates[date.toDateString()] || 0;
    if (count === 0) return 'bg-green-100';
    if (count < 5) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={handleDateSelect}
      className="rounded-md border"
      modifiers={{
        booked: (date) => appointmentDates[date.toDateString()] > 0,
      }}
      modifiersClassNames={{
        booked: 'booked-date',
      }}
      components={{
        Day: ({ date, ...props }) => (
          <div className={getDateClassName(date)} {...props}>
            {date.getDate()}
          </div>
        ),
      }}
    />
  );
}