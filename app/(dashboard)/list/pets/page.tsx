import FormModal from "@/components/FormModal";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { Appointment, HealthRecord, Pet, Prisma, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import { ITEM_PER_PAGE } from "@/lib/settings";
import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { role } from "@/lib/utils";
// import { CldImage } from 'next-cloudinary';

type PetList = Pet & {Appointments:Appointment[]} & {healthRecords:HealthRecord[]} & {user:User}

const columns = [
  {
    header: "Pet Name",
    accessor: "info",
  },
  {
    header: "user",
    accessor: "pets",
    className: "hidden md:table-cell",
  },
  {
    header: "Age",
    accessor: "age",
    className: "hidden md:table-cell",
  },
  {
    header: "Blood Type",
    accessor: "blood type",
    className: "hidden md:table-cell",
  },
  {
    header: "Sex",
    accessor: "sex",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];
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
const renderRow = (item: PetList) => (
    <tr
      key={ item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    > 
      <td className="flex items-center gap-4 p-4">
      <div className="md:hidden xl:block w-10 h-10 rounded-full overflow-hidden">{item.img ? (
    <img
      src={item.img}
      alt="User Avatar"
      className="w-full h-full object-cover"
    />
  ) : (
    <img src="/noAvatar.png" alt="" />
  )}
   </div> 
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs font-semibold text-gray-600">{item.type}</p>
          <p className="text-xs text-gray-500">{item.breed}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.user?.firstName} {item.user?.lastName}</td>
      <td className="hidden md:table-cell"> <span>{calculateAge(item.birthday)} old</span></td>
      <td className="hidden md:table-cell">{item.bloodType|| "-"}</td>
      <td className="hidden md:table-cell">{item.sex|| "-"}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/pets/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {(role === "admin" || role === "user") &&(
            <FormModal table="pet" type="update" data={item}/>
          )}
        </div>
      </td>
    </tr>
  );
const PetListPage = async ({
  searchParams,
}:{
  searchParams:{ [key:string]: string  | undefined;}
}) => {
  const { page, ...queryParams } = searchParams || {};
  const p = page ? parseInt(page) : 1;

  // Get the current user's information
  const { userId: clerkUserId } = auth();
  const user = await currentUser();
  const userRole = user?.publicMetadata?.role as string | undefined;

  // Get the database user
  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: clerkUserId || "" },
  });

  // console.log("User Role:", userRole);
  // console.log("Clerk User ID:", clerkUserId);

  // Fetch all pets (temporarily remove the filter)
  const allPets = await prisma.pet.findMany({
    include: {
      user: true,
    },
  });

  console.log("All pets in the database:", allPets.map(pet => ({ id: pet.id, name: pet.name, userId: pet.userId })));

  // Base query
  let query: Prisma.PetWhereInput = {};
  
  if (userRole !== "admin" && dbUser) {
    // For non-admin users, always include their own pets
    query.userId = dbUser.id;
  }

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "user":
            if (userRole === "admin") {
              // For admin, directly set the userId filter
              query.userId = value;
            }
            // For non-admin users, we keep the existing userId filter
            break;
          case "search":
            query.OR = [
              { name: { contains: value, mode: 'insensitive' } },
              { breed: { contains: value, mode: 'insensitive' } },
              { type: { contains: value, mode: 'insensitive' } }, 
              { sex: { contains: value, mode: 'insensitive' } }, 
            ];
            break;
          // Add other cases as needed
        }
      }
    }
  }
  
  console.log("Query:", JSON.stringify(query, null, 2)); // For debugging
  console.log("User ID:", clerkUserId); // Log the user ID

  const [data, count] = await prisma.$transaction([
    prisma.pet.findMany({
      where: query,
      include: {
        user: true,
        Appointment: true,
        healthRecords: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.pet.count({ where: query }),
  ]);

  console.log("Fetched pets:", data.map(pet => ({ id: pet.id, name: pet.name, userId: pet.userId }))); // For debugging

  return ( 
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          {userRole === "admin" ? "All Pets" : "My Pets"}
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {(userRole === "user" || userRole === "admin") && (
              <FormModal table="pet" type="create"/>
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default PetListPage;
