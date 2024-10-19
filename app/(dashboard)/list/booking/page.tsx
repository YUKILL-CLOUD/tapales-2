// 'use client'
// // app/dashboard/list/booking/index.tsx
// import { useEffect, useState } from 'react';
// import { useSession } from '@clerk/nextjs';
// import { Button} from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select } from '@/components/ui/select';
// // import { Button, Input, Select, DatePicker } from  // Adjust based on your setup

// const BookingPage = () => {
//     const { userId } = useSession();
    
//     const [date, setDate] = useState('');
//     const [serviceId, setServiceId] = useState('');
//     const [petId, setPetId] = useState('');
//     const [message, setMessage] = useState('');

//     // Fetch pets and services when the component mounts.
//     useEffect(() => {
//         // Fetch pets and services here if needed.
//     }, []);

//     // Handle appointment request submission.
//     const handleSubmitRequest = async (e: React.FormEvent) => {
//         e.preventDefault();
        
//         await fetch('/api/appointments', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ userId, date, serviceId, petId, message }),
//         });

//         // Optionally reset form or show success message after submitting the request.
//         alert('Appointment requested successfully!');
        
//         // Reset form fields after submission.
//         setDate('');
//         setServiceId('');
//         setPetId('');
//         setMessage('');
//     };

//     return (
//         <div>
//             <h1>Request an Appointment</h1>
//             <form onSubmit={handleSubmitRequest}>
//                 <DatePicker onChange={(date) => setDate(date.toISOString())} required />
//                 <Select onChange={(e) => setServiceId(e.target.value)} required>
//                     <option value="">Select Service</option>
//                     {/* Populate services here */}
//                 </Select>
//                 <Select onChange={(e) => setPetId(e.target.value)} required>
//                     <option value="">Select Pet</option>
//                     {/* Populate pets here */}
//                 </Select>
//                 <Input 
//                     type="text" 
//                     placeholder="Additional Notes" 
//                     value={message} 
//                     onChange={(e) => setMessage(e.target.value)} 
//                 />
//                 <Button type="submit">Request Appointment</Button>
//             </form>
//         </div>
//     );
// };

// export default BookingPage;