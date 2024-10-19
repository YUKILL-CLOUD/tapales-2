import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Pet, Appointment, User, Vaccination, Deworming, HealthRecord } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import FormModal from "@/components/FormModal";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { HealthRecordsTableClient } from "@/components/HealthRecordsTableClient";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { VaccinationsTableClient } from '@/components/VaccinationsTableClient';
import { DewormingsTableClient } from "@/components/DewormingTableClient";

type PetWithRelations = Pet & {
  appointment: Appointment[];
  user: User;
  vaccination: Vaccination[];
  deworming: Deworming[];
};

const SinglePetPage = async ({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const petId = parseInt(id);
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;

  if (isNaN(petId)) {
    throw new Error("Invalid pet ID");
  }

  const pet = await prisma.pet.findUnique({
    where: { id: petId },
    include: {
      user: true,
      Appointment: true,
      Vaccination: true,
      Deworming: true,
    },
  });

  if (!pet) {
    return notFound();
  }

  const [healthRecords, totalHealthRecords] = await prisma.$transaction([
    prisma.healthRecord.findMany({
      where: { petId: petId },
      orderBy: { date: 'desc' },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    }),
    prisma.healthRecord.count({ where: { petId: petId } }),
  ]);

  const [vaccinations, totalVaccinations] = await prisma.$transaction([
    prisma.vaccination.findMany({
      where: { petId: petId },
      orderBy: { date: 'desc' },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    }),
    prisma.vaccination.count({ where: { petId: petId } }),
  ]);
  const [dewormings, totalDewormings] = await prisma.$transaction([
    prisma.deworming.findMany({
      where: { petId: petId },
      orderBy: { date: 'desc' },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    }),
    prisma.vaccination.count({ where: { petId: petId } }),
  ]);

  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const calculateAge = (birthday: Date) => {
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    const years = Math.abs(ageDate.getUTCFullYear() - 1970);
    const months = ageDate.getUTCMonth();
    const weeks = Math.floor(ageDifMs / (7 * 24 * 60 * 60 * 1000));
    
    if (years === 0) {
      if (months === 0) {
        return `${weeks} week${weeks !== 1 ? 's' : ''}`;
      } else {
        return `${months} month${months !== 1 ? 's' : ''}`;
      }
    } else {
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
  };

  return (
    <div className="flex-1 p-4 flex flex-col gap-4">
      {/* Pet Info Card */}
      <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/3 flex justify-center items-center">
          <Image
            src={pet.img || "/noAvatar.png"}
            alt={pet.name}
            width={144}
            height={144}
            className="w-24 h-24 sm:w-36 sm:h-36 rounded-full object-cover"
          />
        </div>
        <div className="w-full sm:w-2/3 flex flex-col justify-between gap-2">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">{pet.name}</h1>
            {role === "admin" && (
              <FormModal
                table="pet"
                type="update"
                data={pet}
              />
            )}
          </div>
          <p className="text-sm text-gray-500 font-semibold">
            {pet.type}
          </p>
          <p className="text-sm text-gray-500">
            {pet.breed}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
            <div className="flex items-center gap-2">
              <Icon icon="mdi:blood-bag" width="14" height="14" />
              <span>{pet.bloodType}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="mdi:calendar" width="14" height="14" />
              <span>{pet.birthday.toDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="mdi:gender-male-female" width="14" height="14" />
              <span>{pet.sex}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="mdi:cake-variant" width="14" height="14" />
              <span>{calculateAge(pet.birthday)} old</span>
            </div>
          </div>
        </div>
      </div>

      {/* Health Records Table */}
      <div className="bg-white rounded-md p-4 shadow-md transition-shadow duration-300 hover:shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Health Records</h2>
        {healthRecords.length > 0 ? (
          <HealthRecordsTableClient 
            healthRecords={healthRecords} 
            petId={pet.id} 
            currentPage={page}
            totalRecords={totalHealthRecords}
          />
        ) : (
          <p className="text-gray-500 italic">No health records available</p>
        )}
      </div>

      {/* Vaccinations Table */}
      <div className="bg-white rounded-md p-4 shadow-md transition-shadow duration-300 hover:shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Vaccinations</h2>
        {vaccinations.length > 0 ? (
          <VaccinationsTableClient 
            vaccinations={vaccinations} 
            petId={pet.id} 
            currentPage={page}
            totalRecords={totalVaccinations}
          />
        ) : (
          <p className="text-gray-500 italic">No vaccinations recorded</p>
        )}
      </div>

      {/* Dewormings Table */}
      <div className="bg-white rounded-md p-4 shadow-md transition-shadow duration-300 hover:shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Dewormings</h2>
        {dewormings.length > 0 ? (
          <DewormingsTableClient
            deworming={dewormings} 
            petId={pet.id} 
            currentPage={page}
            totalRecords={totalDewormings}
          />
        ) : (
          <p className="text-gray-500 italic">No dewormings recorded</p>
        )}
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        {/* UPCOMING APPOINTMENTS */}
        <div className="bg-white p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Upcoming Appointments</h2>
          {pet.Appointment.filter(app => new Date(app.date) > new Date()).length > 0 ? (
            pet.Appointment.filter(app => new Date(app.date) > new Date()).map((app) => (
              <div key={app.id} className="mb-2 p-2 bg-gray-100 rounded">
                <p className="font-medium">{app.date.toDateString()}</p>
                <p>Status: {app.status}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No upcoming appointments</p>
          )}
        </div>

        {/* SHORTCUTS */}
        <div className="bg-white p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Shortcuts</h2>
          <div className="flex flex-wrap gap-2">
            <Link href={`/appointments/new?petId=${pet.id}`} className="p-2 bg-lamaSkyLight rounded-md text-sm flex items-center">
              <Icon icon="mdi:calendar-plus" className="mr-1" />
              Schedule Appointment
            </Link>
            <Link href={`/vaccinations/new?petId=${pet.id}`} className="p-2 bg-lamaYellowLight rounded-md text-sm flex items-center">
              <Icon icon="mdi:needle" className="mr-1" />
              Add Vaccination
            </Link>
            <Link href={`/users/${pet.user.id}`} className="p-2 bg-lamaGreenLight rounded-md text-sm flex items-center">
              <Icon icon="mdi:account" className="mr-1" />
              View Owner Information
            </Link>
            <Link href={`/health-records/new?petId=${pet.id}`} className="p-2 bg-lamaPurpleLight rounded-md text-sm flex items-center">
              <Icon icon="mdi:stethoscope" className="mr-1" />
              Add Health Record
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePetPage;
