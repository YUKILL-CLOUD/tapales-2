"use server";

import { PetSchema } from '@/lib/formValidationSchema';
import prisma from "@/lib/prisma";
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/users';
import { auth } from '@clerk/nextjs/server';
import { ITEM_PER_PAGE } from "@/lib/settings";
import { revalidatePath } from 'next/cache';
import { RehomingPet, Role } from '@prisma/client';
import { clerkClient } from '@clerk/nextjs/server';
import { sendAppointmentEmail } from '@/lib/email';
type ActionResult = {
  success: boolean;
  error: string | null;
  data?: any;
};

async function createNotification(userId: string, message: string, type: string) {
  await prisma.notification.create({
    data: {
      userId,
      message,
      isRead: false,
      type: type,
    },
  });
}

export async function fetchUserNotifications(userId: string) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { sentAt: 'desc' },
    });
    return notifications;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }
}
async function syncUserRole(userId: string, role: Role) {
  await prisma.user.update({
    where: { clerkUserId: userId },
    data: { role },
  });

  await clerkClient.users.updateUser(userId, {
    publicMetadata: { role },
  });
}

// Utility function to get user or redirect to sign-up
async function getUserOrRedirect(clerkUserId: string) {
  const { user } = await getUserById({ clerkUserId });

  if (!user) {
    redirect('/sign-up');
  }

  return user;
}

// Pet Actions
export const createPet = async (
  _: ActionResult,
  data: PetSchema & { userId: string }
): Promise<ActionResult> => {
  try {
    console.log("Creating pet with data:", data);
    
    const user = await currentUser();
    if (!user?.id) {
      return { success: false, error: 'User is not authenticated' };
    }

    const dbUser = await getUserOrRedirect(user.id);

    const pet = await prisma.pet.create({
      data: {
        name: data.name,
        type: data.type,
        breed: data.breed,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        userId: dbUser.id, // Use the database user ID, not the Clerk user ID
      },
    });
    console.log("Created pet:", pet);
    return { success: true, error: null, data: pet };
  } catch (err) {
    console.error("Error creating pet:", err);
    return { success: false, error: 'Failed to create pet. Please try again.' };
  }
};

export const updatePet = async (
  _: ActionResult,
  data: PetSchema & { id: number; userId: string }
): Promise<ActionResult> => {
  try {
    console.log("Updating pet with data:", data); // Log the incoming data
    const updatedPet = await prisma.pet.update({
      where: { id: data.id },
      data: {
        name: data.name,
        type: data.type,
        breed: data.breed,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
      },
    });
    console.log("Updated pet:", updatedPet); // Log the updated pet
    return { success: true, error: null, data: updatedPet };
  } catch (err) {
    console.error("Error updating pet:", err);
    return { success: false, error: 'Failed to update pet. Please try again.' };
  }
};

export const deletePet = async (
  _: ActionResult,
  petId: number   
): Promise<ActionResult> => {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return { success: false, error: 'User is not authenticated' };
    }

    const dbUser = await getUserOrRedirect(user.id);
    
    // Use role from publicMetadata
    const role = user.publicMetadata.role;

    const existingPet = await prisma.pet.findUnique({
      where: { id: petId },
    });

    if (!existingPet || (role !== 'admin' && existingPet.userId !== dbUser.id)) {
      return { success: false, error: 'Pet not found or does not belong to the user' };
    }

    await prisma.pet.delete({
      where: { id: petId },
    });

    return { success: true, error: null };
  } catch (err) {
    console.error(err);
    return { success: false, error: 'Failed to delete pet. Please try again.' };
  }
};

// Service Actions
export const createService = async (
  _: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
  try {
    const data = Object.fromEntries(formData.entries());
    const newService = await prisma.service.create({
      data: {
        name: data.name as string,
        description: data.description as string,
        duration: parseInt(data.duration as string),
        price: parseFloat(data.price as string),
      },
    });
    return { success: true, error: null, data: newService };
  } catch (err) {
    console.error("Error creating service:", err);
    return { success: false, error: 'Failed to create service. Please try again.' };
  }
};

export const updateService = async (
  _: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
  try {
    const data = Object.fromEntries(formData.entries());
    const updatedService = await prisma.service.update({
      where: { id: parseInt(data.id as string) },
      data: {
        name: data.name as string,
        description: data.description as string,
        duration: parseInt(data.duration as string),
        price: parseFloat(data.price as string),
      },
    });
    return { success: true, error: null, data: updatedService };
  } catch (err) {
    console.error("Error updating service:", err);
    return { success: false, error: 'Failed to update service. Please try again.' };
  }
};

export const deleteService = async (
  _: ActionResult,
  serviceId: number
): Promise<ActionResult> => {
  try {
    await prisma.service.delete({
      where: { id: serviceId },
    });
    return { success: true, error: null };
  } catch (err) {
    console.error("Error deleting service:", err);
    return { success: false, error: 'Failed to delete service. Please try again.' };
  }
};


//  Appointment Actions
export const createAppointment = async (
  _: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return { success: false, error: 'User is not authenticated' };
    }

    const dbUser = await getUserOrRedirect(user.id);

   
    const data = Object.fromEntries(formData.entries());
    const date = new Date(data.date as string);
    const [hours, minutes] = (data.time as string).split(':');
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        date: date,
        time: date,
      },
    });

    if (existingAppointment) {
      return { success: false, error: 'This time slot has just been booked. Please choose another time.' };
    }

     const newAppointment = await prisma.appointment.create({
      data: {
        petId: parseInt(data.petId as string),
        userId: dbUser.id,
        serviceId: parseInt(data.serviceId as string),
        date: date,
        time: date,
        status: "pending",
        notes: data.notes as string || null,
      },
      include: { // Add this to get related data
        pet: true,
        service: true,
        user: true,
      },
    });

    // Send email notification
    if (newAppointment.user.email) {
      await sendAppointmentEmail(
        newAppointment.user.email,
        'created',
        {
          petName: newAppointment.pet.name,
          serviceName: newAppointment.service.name,
          date: newAppointment.date,
          time: newAppointment.time,
          notes: newAppointment.notes,
        }
      );
    }

    return { success: true, error: null, data: newAppointment };
  } catch (err) {
    console.error("Error creating appointment:", err);
    return { success: false, error: 'Failed to create appointment. Please try again.' };
  }
};

export const updateAppointment = async (
  _: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
  try {
    const data = Object.fromEntries(formData.entries());
    const [time, period] = (data.time as string).split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);
    if (period.toLowerCase() === 'pm' && hour !== 12) {
      hour += 12;
    } else if (period.toLowerCase() === 'am' && hour === 12) {
      hour = 0;
    }
    const date = new Date(data.date as string);
    const timeDate = new Date(2000, 0, 1, hour, parseInt(minutes, 10));

    const updatedAppointment = await prisma.appointment.update({
      where: { id: parseInt(data.id as string) },
      data: {
        petId: parseInt(data.petId as string),
        serviceId: parseInt(data.serviceId as string),
        date: date,
        time: timeDate,
        status: data.status as string,
        notes: data.notes as string || null,
      },
    });
    
    // Add revalidation
    revalidatePath('/appointments');
    revalidatePath('/list/appointments');
    revalidatePath('/admin');
    
    return { success: true, error: null, data: updatedAppointment };
  } catch (err) {
    console.error("Error updating appointment:", err);
    return { success: false, error: 'Failed to update appointment. Please try again.' };
  }
};


// delete appointment original
export const deleteAppointment = async (
  _: ActionResult,
  appointmentId: number
): Promise<ActionResult> => {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return { success: false, error: 'User is not authenticated' };
    }

    const dbUser = await getUserOrRedirect(user.id);
    
    const role = user.publicMetadata.role;

    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!existingAppointment || (role !== 'admin' && existingAppointment.userId !== dbUser.id)) {
      return { success: false, error: 'Appointment not found or does not belong to the user' };
    }

    await prisma.appointment.delete({
      where: { id: appointmentId },
    });

    await createNotification(existingAppointment.userId, 'Your appointment has been canceled.', 'appointment_canceled');

    // Add revalidation
    revalidatePath('/appointments');
    revalidatePath('/list/appointments');
    revalidatePath('/admin');

    return { success: true, error: null };
  } catch (err) {
    console.error("Error deleting appointment:", err);
    return { success: false, error: 'Failed to delete appointment. Please try again.' };
  }
};

export async function updateAppointmentStatus(
  _: ActionResult,
  { id, status }: { id: number; status: string }
): Promise<ActionResult> {
  try {
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        pet: true,
        service: true,
        user: true,
      },
    });

    // Send email notification
    if (updatedAppointment.user.email) {
      await sendAppointmentEmail(
        updatedAppointment.user.email,
        'status_changed',
        {
          petName: updatedAppointment.pet.name,
          serviceName: updatedAppointment.service.name,
          date: updatedAppointment.date,
          time: updatedAppointment.time,
          status: status,
        }
      );
    }

    // Add revalidation
    revalidatePath('/appointments');
    revalidatePath('/list/appointments');
    revalidatePath('/admin');

    return { success: true, error: null, data: updatedAppointment };
  } catch (err) {
    console.error("Error updating appointment status:", err);
    return { success: false, error: 'Failed to update appointment status. Please try again.' };
  }
}
//users
export async function fetchAppointments(page: number) {
  // First update any missed appointments
  await updateMissedAppointments();
  
  // Rest of the existing code remains the same
  const { userId: clerkUserId } = auth();

  if (!clerkUserId) {
    throw new Error('User not authenticated');
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!dbUser) {
    throw new Error('User not found');
  }

  const [appointments, count] = await prisma.$transaction([
    prisma.appointment.findMany({
      where: { userId: dbUser.id },
      include: {
        pet: true,
        service: true,
        user: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    }),
    prisma.appointment.count({ where: { userId: dbUser.id } }),
  ]);

  revalidatePath('/appointments');
  return { appointments, count };
}
//admins
export async function fetchUserAppointments(userId: string, limit: number = 5) {
  const appointments = await prisma.appointment.findMany({
    where: { 
      userId: userId,
      date: {
        gte: new Date(),
      },
    },
    include: {
      pet: true,
      service: true,
      user: true,
    },
    orderBy: {
      date: 'asc',
    },
    take: limit,
  });

  return appointments;
}
export async function fetchAdminAppointments(
  pendingPage: number, 
  scheduledPage: number,
  completedPage: number,
  missedPage: number
) {
  // First update any missed appointments
  await updateMissedAppointments();
  
  const [
    pendingAppointments, 
    scheduledAppointments,
    completedAppointments,
    missedAppointments,
    pendingCount,
    scheduledCount,
    completedCount,
    missedCount
  ] = await prisma.$transaction([
    prisma.appointment.findMany({
      where: { status: 'pending' },
      include: {
        pet: true,
        service: true,
        user: true,
      },
      orderBy: { date: 'asc' },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (pendingPage - 1),
    }),
    prisma.appointment.findMany({
      where: { status: 'scheduled' },
      include: {
        pet: true,
        service: true,
        user: true,
      },
      orderBy: { date: 'asc' },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (scheduledPage - 1),
    }),
    prisma.appointment.findMany({
      where: { status: 'completed' },
      include: {
        pet: true,
        service: true,
        user: true,
      },
      orderBy: { date: 'desc' },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (completedPage - 1),
    }),
    prisma.appointment.findMany({
      where: { status: 'missed' },
      include: {
        pet: true,
        service: true,
        user: true,
      },
      orderBy: { date: 'desc' },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (missedPage - 1),
    }),
    prisma.appointment.count({ where: { status: 'pending' } }),
    prisma.appointment.count({ where: { status: 'scheduled' } }),
    prisma.appointment.count({ where: { status: 'completed' } }),
    prisma.appointment.count({ where: { status: 'missed' } }),
  ]);

  return { 
    pendingAppointments, 
    scheduledAppointments, 
    completedAppointments,
    missedAppointments,
    pendingCount,
    scheduledCount,
    completedCount,
    missedCount
  };
}
export async function updateMissedAppointments() {
  const now = new Date();
  
  const missedAppointments = await prisma.appointment.findMany({
    where: {
      status: 'scheduled',
      OR: [
        { date: { lt: now } },
        { date: now, time: { lt: now } }
      ]
    },
    include: {
      pet: true,
      service: true,
      user: true
    }
  });

  for (const appointment of missedAppointments) {
    await prisma.$transaction([
      prisma.appointment.update({
        where: { id: appointment.id },
        data: { status: 'missed' }
      }),
    ]);

    // Send missed appointment email
    if (appointment.user.email) {
      await sendAppointmentEmail(
        appointment.user.email,
        'missed',
        {
          petName: appointment.pet.name,
          serviceName: appointment.service.name,
          date: appointment.date,
          time: appointment.time,
        }
      );
    }
  }

  return missedAppointments.length;
}

export async function getBookedTimes(date: string): Promise<Date[]> {
  try {
    const bookedTimes = await prisma.appointment.findMany({
      where: {
        date: new Date(date),
      },
      select: {
        time: true,
      },
    });

    return bookedTimes.map(appointment => appointment.time);
  } catch (error) {
    console.error('Error fetching booked times:', error);
    return [];
  }
}

// Pet Rehoming Actions
export const createRehomingPet = async (
  _: ActionResult,
  data: Omit<RehomingPet, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ActionResult> => {
  try {
    console.log("Creating rehoming pet with data:", data);
    const user = await currentUser();
    if (!user?.id) {
      return { success: false, error: 'User is not authenticated' };
    }
    if (user.publicMetadata.role !== 'admin') {
      return { success: false, error: 'Only administrators can add pets for rehoming' };
    }

    const newPet = await prisma.rehomingPet.create({
      data: {
        ...data,
      },
    });

    return { success: true, error: null, data: newPet };
  } catch (err) {
    console.error("Error creating rehoming pet:", err);
    return { success: false, error: 'Failed to create rehoming pet. Please try again.' };
  }
};

export const updateRehomingPet = async (
  _: ActionResult,
  data: RehomingPet & { id: number; userId: string }
): Promise<ActionResult> => {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return { success: false, error: 'User is not authenticated' };
    }

    const dbUser = await getUserOrRedirect(user.id);

    const updatedPet = await prisma.rehomingPet.update({
      where: { id: data.id },
      data: {
        name: data.name,
        age: data.age,
        gender: data.gender,
        breed: data.breed,
        type: data.type,
        imageUrl: data.imageUrl,
        sellerName: data.sellerName,
        sellerPhone: data.sellerPhone,
        sellerEmail: data.sellerEmail,
      },
    });

    return { success: true, error: null, data: updatedPet };
  } catch (err) {
    console.error("Error updating rehoming pet:", err);
    return { success: false, error: 'Failed to update rehoming pet. Please try again.' };
  }
};
export const deleteRehomingPet = async (
  _: ActionResult,
  petId: number
): Promise<ActionResult> => {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return { success: false, error: 'User is not authenticated' };
    }

    const role = user.publicMetadata.role;

    if (role !== 'admin') {
      return { success: false, error: 'Only admins can delete rehoming pets' };
    }

    await prisma.rehomingPet.delete({
      where: { id: petId },
    });

    return { success: true, error: null };
  } catch (err) {
    console.error(err);
    return { success: false, error: 'Failed to delete rehoming pet. Please try again.' };
  }
};


export const updateUserRole = async (userId: string, newRole: Role): Promise<ActionResult> =>  {
  try {
    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Update Clerk metadata
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { ...user.publicMetadata, role: newRole },
    });

    // Update database
    await prisma.user.update({
      where: { clerkUserId: userId },
      data: { role: newRole },
    });

    return { success: true, error: null };
  } catch (err) {
    console.error("Error updating user role:", err);
    return { success: false, error: 'Failed to update user role. Please try again.' };
  }
};

export async function fetchHealthRecords(petId: number, page: number) {
  const [records, count] = await prisma.$transaction([
    prisma.healthRecord.findMany({
      where: { petId },
      orderBy: { date: 'desc' },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    }),
    prisma.healthRecord.count({ where: { petId } }),
  ]);

  return { records, count };
}

// Add similar functions for fetchVaccinations and fetchDewormings

// Add these to your existing action.ts
export const createAnnouncement = async (
  formData: FormData
): Promise<ActionResult> => {
  try {
    const { userId } = auth()
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!dbUser || dbUser.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin access required' };
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const startDate = new Date(formData.get("startDate") as string);
    const endDate = new Date(formData.get("endDate") as string);

    console.log('Creating announcement with:', {
      title,
      content,
      startDate,
      endDate
    });

    const newAnnouncement = await prisma.announcement.create({
      data: {
        title,
        content,
        startDate,
        endDate,
        status: "active",
      },
    });

    console.log('Created announcement:', newAnnouncement);

    revalidatePath('/list/announcements');
    revalidatePath('/user');
    
    return { 
      success: true, 
      error: null, 
      data: newAnnouncement 
    };
  } catch (err) {
    console.error("Error creating announcement:", err);
    return { 
      success: false, 
      error: 'Failed to create announcement' 
    };
  }
};

export const getAnnouncements = async (limit?: number) => {
  try {
    const announcements = await prisma.announcement.findMany({
      where: {
        status: "active",
        endDate: { gte: new Date() }, // Only check if not expired
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    
    console.log('Retrieved announcements:', announcements);
    return announcements;
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }
};

export const fetchActivities = async (userId: string) => {
  try {
    const [appointments, pets, healthRecords] = await Promise.all([
      prisma.appointment.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 5,
        include: {
          pet: true,
          service: true,
        },
      }),
      prisma.pet.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.healthRecord.findMany({
        where: {
          pet: {
            userId,
          },
        },
        include: {
          pet: true,
        },
        orderBy: { date: 'desc' },
        take: 5,
      }),
    ]);

    return [
      ...appointments.map(apt => ({
        id: `apt-${apt.id}`,
        date: apt.date.toISOString(),
        description: `Appointment for ${apt.pet.name} - ${apt.service.name}`,
        type: 'appointment'
      })),
      ...pets.map(pet => ({
        id: `pet-${pet.id}`,
        date: pet.createdAt.toISOString(),
        description: `Added new pet: ${pet.name}`,
        type: 'pet'
      })),
      ...healthRecords.map(record => ({
        id: `health-${record.id}`,
        date: record.date.toISOString(),
        description: `Health record updated for ${record.pet.name}`,
        type: 'health'
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
     .slice(0, 10);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
};

// Prescription Actions
export async function createPrescriptionAction(formData: FormData) {
  try {
    const petId = parseInt(formData.get('petId') as string);
    const veterinarianId = parseInt(formData.get('veterinarianId') as string);
    const userId = formData.get('userId') as string;
    const appointmentId = formData.get('appointmentId') ? 
      parseInt(formData.get('appointmentId') as string) : 
      undefined;
    const medications = JSON.parse(formData.get('medications') as string);
    const status = formData.get('status') as string;

    const prescription = await prisma.prescription.create({
      data: {
        petId,
        veterinarianId,
        userId,
        appointmentId,
        medication: medications,
        status,
      },
    });

    revalidatePath('/list/prescriptions');
    return { success: true, data: prescription };
  } catch (error) {
    console.error('Error in createPrescriptionAction:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function updatePrescriptionStatus(id: number, status: string): Promise<ActionResult> {
  try {
    const prescription = await prisma.prescription.update({
      where: { id },
      data: { status }
    });
    revalidatePath('/list/prescriptions');
    return { success: true, error: null, data: prescription };
  } catch (error) {
    console.error('Error updating prescription status:', error);
    return { success: false, error: 'Failed to update prescription status' };
  }
}

export async function deletePrescription(id: number): Promise<ActionResult> {
  try {
    await prisma.prescription.delete({
      where: { id }
    });
    revalidatePath('/list/prescriptions');
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting prescription:', error);
    return { success: false, error: 'Failed to delete prescription' };
  }
}

export async function reactivatePrescription(id: number): Promise<ActionResult> {
  try {
    const prescription = await prisma.prescription.update({
      where: { id },
      data: { status: 'active' }
    });
    revalidatePath('/list/prescriptions');
    return { success: true, error: null, data: prescription };
  } catch (error) {
    console.error('Error reactivating prescription:', error);
    return { success: false, error: 'Failed to reactivate prescription' };
  }
}

