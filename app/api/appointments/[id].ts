// pages/api/appointments/[id].ts
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method === 'PATCH') {
        try {
            const { action } = req.body;

            let updatedAppointment;

            if (action === 'cancel') {
                updatedAppointment = await prisma.appointment.update({
                    where: { id },
                    data: { status: 'canceled' },
                });
            } else if (action === 'reschedule') {
                updatedAppointment = await prisma.appointment.update({
                    where: { id },
                    data: { status: 'rescheduled' },
                });
            } else if (action === 'accept') {
                updatedAppointment = await prisma.appointment.update({
                    where: { id },
                    data: { status: 'accepted' },
                });

                // Notify the user about the accepted appointment here.
                
            }

            return res.json(updatedAppointment);
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        
    }

    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}