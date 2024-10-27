import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  };

  const stream = new ReadableStream({
    async start(controller) {
      const sendNotification = async () => {
        const notifications = await prisma.notification.findMany({
          where: { userId, isRead: false },
          orderBy: { sentAt: 'desc' },
        });

        if (notifications.length > 0) {
          controller.enqueue(`data: ${JSON.stringify(notifications)}\n\n`);
        }

        setTimeout(sendNotification, 5000); // Check for new notifications every 5 seconds
      };

      sendNotification();
    },
  });

  return new NextResponse(stream, { headers });
}