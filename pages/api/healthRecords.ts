import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const healthRecord = await prisma.healthRecord.create({
        data: req.body,
      });
      res.status(201).json(healthRecord);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create health record' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
