// pages/api/appointments/index.ts
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            const { userId } = req.query;

            // Fetch appointments for a specific user if userId is provided.
            const appointments = await prisma.appointment.findMany({
                where: userId ? { pet: { userId } } : {},
                include: {
                    pet: true,
                    service: true,
                },
                orderBy: {
                    date: 'asc',
                },
            });

            return res.json(appointments);
        
        } else if (req.method === 'POST') {
            // Create a new appointment request.
            const { userId, date, serviceId, petId, message } = req.body;

            const newAppointment = await prisma.appointment.create({
                data: {
                    petId,
                    serviceId,
                    date: new Date(date),
                    status: 'requested', // Initial status when requested.
                    user: {
                        connect: { id: userId },
                    },
                    message,
                },
            });

            return res.status(201).json(newAppointment);
        
        }

        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}