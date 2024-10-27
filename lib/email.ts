import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type AppointmentEmailData = {
  petName: string;
  serviceName: string;
  date: Date;
  time: Date;
  status?: string;
  notes?: string | null;
};

export async function sendAppointmentEmail(
  to: string,
  type: 'created' | 'updated' | 'cancelled' | 'status_changed' | 'missed',
  data: AppointmentEmailData
) {
  console.log(`Attempting to send ${type} email to ${to}`, data);

  const emailTemplates = {
    created: {
      subject: 'New Appointment Confirmation',
      html: `
        <h2>New Appointment Confirmation</h2>
        <p>Your appointment has been created and is pending approval.</p>
        <p>Details:</p>
        <ul>
          <li>Pet: ${data.petName}</li>
          <li>Service: ${data.serviceName}</li>
          <li>Date: ${data.date.toLocaleDateString()}</li>
          <li>Time: ${data.time.toLocaleTimeString()}</li>
          ${data.notes ? `<li>Notes: ${data.notes}</li>` : ''}
        </ul>
      `
    },
    updated: {
      subject: 'Appointment Updated',
      html: `
        <h2>Appointment Updated</h2>
        <p>Your appointment has been updated.</p>
        <p>New Details:</p>
        <ul>
          <li>Pet: ${data.petName}</li>
          <li>Service: ${data.serviceName}</li>
          <li>Date: ${data.date.toLocaleDateString()}</li>
          <li>Time: ${data.time.toLocaleTimeString()}</li>
          ${data.notes ? `<li>Notes: ${data.notes}</li>` : ''}
        </ul>
      `
    },
    cancelled: {
      subject: 'Appointment Cancelled',
      html: `
        <h2>Appointment Cancelled</h2>
        <p>Your appointment has been cancelled.</p>
        <p>Cancelled Appointment Details:</p>
        <ul>
          <li>Pet: ${data.petName}</li>
          <li>Service: ${data.serviceName}</li>
          <li>Date: ${data.date.toLocaleDateString()}</li>
          <li>Time: ${data.time.toLocaleTimeString()}</li>
        </ul>
      `
    },
    status_changed: {
      subject: `Appointment Status Updated: ${data.status}`,
      html: `
        <h2>Appointment Status Update</h2>
        <p>Your appointment status has been changed to: ${data.status}</p>
        <p>Appointment Details:</p>
        <ul>
          <li>Pet: ${data.petName}</li>
          <li>Service: ${data.serviceName}</li>
          <li>Date: ${data.date.toLocaleDateString()}</li>
          <li>Time: ${data.time.toLocaleTimeString()}</li>
        </ul>
      `
    },
    missed: {
      subject: 'Missed Appointment Notification',
      html: `
        <h2>Missed Appointment Notification</h2>
        <p>Your appointment was marked as missed.</p>
        <p>Details:</p>
        <ul>
          <li>Pet: ${data.petName}</li>
          <li>Service: ${data.serviceName}</li>
          <li>Date: ${data.date.toLocaleDateString()}</li>
          <li>Time: ${data.time.toLocaleTimeString()}</li>
        </ul>
        <p>Please contact us to reschedule your appointment.</p>
      `
    }
  };

  const template = emailTemplates[type];

  try {
    const result = await resend.emails.send({
      from: process.env.NEXT_PUBLIC_EMAIL_FROM || 'onboarding@resend.dev',
      to,
      subject: template.subject,
      html: template.html,
    });
    console.log('Email sent successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send email:', {
      to,
      type,
      data,
      error
    });
    return { success: false, error };
  }
}
