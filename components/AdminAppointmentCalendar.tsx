'use client'

import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { AppointmentWithRelations } from './AppointmentTable';

const localizer = momentLocalizer(moment);

type AdminAppointmentCalendarProps = {
  appointments: AppointmentWithRelations[];
};

export const AdminAppointmentCalendar: React.FC<AdminAppointmentCalendarProps> = ({ appointments }) => {
  const events = appointments.map(appointment => ({
    title: `${appointment.pet.name} - ${appointment.service.name}`,
    start: new Date(appointment.date),
    end: new Date(appointment.date),
  }));

  return (
    <div className="h-full">
      <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 400 }}
      />
    </div>
  );
};