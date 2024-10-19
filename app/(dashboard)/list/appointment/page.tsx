// "use client"
// // app/dashboard/list/appointments/index.tsx
// import { useEffect, useState } from 'react';
// import { useUser } from '@clerk/nextjs';
// import { Button} from '@/components/ui/button'; // Adjust based on your setup
// import { Input } from '@/components/ui/input';

// interface Appointment {
//     id: string;
//     date: string;
//     status: string;
//     pet: {
//         name: string;
//         userId: string; // Include user ID to identify the owner
//     };
// }

// const AppointmentsPage = () => {
//     const { user } = useUser();

//     // Check if the user is an admin
//     if (!user || user.publicMetadata.role !== 'admin') {
//         return <div>You do not have access to this page.</div>;
//     }

//     const [appointments, setAppointments] = useState<Appointment[]>([]);
//     const [searchTerm, setSearchTerm] = useState<string>('');

//     useEffect(() => {
//         const fetchAppointments = async () => {
//             const response = await fetch('/api/appointments');
//             setAppointments(await response.json());
//         };

//         fetchAppointments();
//     }, []);

//     const handleAction = async (appointmentId: string, action: string) => {
//         if (action === 'accept' && !confirm('Are you sure you want to accept this appointment?')) return;

//         await fetch(`/api/appointments/${appointmentId}`, {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ action }),
//         });
        
//         // Refresh the list or show a success message
//         setAppointments((prev) => prev.filter((appt) => appt.id !== appointmentId));
//     };

//     const filteredAppointments = appointments.filter((appointment) =>
//         appointment.pet.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div>
//             <h1>All Appointments</h1>
//             <Input 
//                 placeholder="Search by Pet Name" 
//                 value={searchTerm} 
//                 onChange={(e) => setSearchTerm(e.target.value)} 
//             />
//             <ul>
//                 {filteredAppointments.map((appointment) => (
//                     <li key={appointment.id}>
//                         {new Date(appointment.date).toLocaleString()} - {appointment.status} 
//                         (Pet: {appointment.pet.name}, Owner ID: {appointment.pet.userId})
//                         <Button onClick={() => handleAction(appointment.id, 'accept')}>Accept</Button>
//                         <Button onClick={() => handleAction(appointment.id, 'reschedule')}>Reschedule</Button>
//                         <Button onClick={() => handleAction(appointment.id, 'cancel')}>Cancel</Button>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default AppointmentsPage;