// app/dashboard/list/appointments/[id].tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import React from 'react';

// Define the types for the appointment object
interface Pet {
    name: string;
}

interface Service {
    name: string;
}

interface Appointment {
    date: string;
    status: string;
    pet: Pet;
    service: Service;
}
interface AppointmentDetailsProps {
    appointment: Appointment;
}

const AppointmentDetailPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [appointment, setAppointment] = useState(null);

    useEffect(() => {
        const fetchAppointment = async () => {
            if (id) {
                const response = await fetch(`/api/appointments/${id}`);
                setAppointment(await response.json());
            }
        };

        fetchAppointment();
    }, [id]);

    if (!appointment) return <div>Loading...</div>;

    const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({ appointment }) => {
        return (
            <div>
                <h1>Appointment Details</h1>
                <p>Date: {new Date(appointment.date).toLocaleString()}</p>
                <p>Status: {appointment.status}</p>
                <p>Pet: {appointment.pet.name}</p>
                <p>Service: {appointment.service.name}</p>
                {/* Add more details as needed */}
            </div>
        );
    };
};

export default AppointmentDetailPage;