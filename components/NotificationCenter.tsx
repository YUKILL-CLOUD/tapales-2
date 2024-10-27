'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type Notification = {
  id: number;
  userId: string;
  message: string;
  type: string;
  sentAt: Date;
  readAt: Date | null;
  isRead: boolean;
};

interface NotificationCenterProps {
  notifications: Notification[];
}

export default function NotificationCenter({ notifications = []}: NotificationCenterProps) {
  useEffect(() => {
    // Show a toast for each new notification
    notifications.forEach((notification: Notification) => {
      toast.info(notification.message);
    });
  }, [notifications]);

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-2">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No new notifications</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li key={notification.id} className="border-b pb-2">
              <p className="text-sm">{notification.message}</p>
              <small className="text-gray-500">{new Date(notification.sentAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}