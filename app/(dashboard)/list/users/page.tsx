import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Appointment, Pet, Prisma, User, Role } from "@prisma/client";
// import { Appointment, Pet, Prisma, Profile, Role, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { updateUserRole } from '@/lib/action';
import UserRow from './UserRow';
import { clerkClient } from "@clerk/nextjs/server";
import AdminUserRow from "./AdminUserRow";
import PaginationWrapper from "./PaginationWrapper";

type UserList = User & {pets:Pet[]} & {Appointment:Appointment[]} & {role?: string}

const columns = [
  {
    header: "Users",
    accessor: "info",
  },
  {
    header: "Email",
    accessor: "email",
    className: "hidden md:table-cell",
  },
  {
    header: "Pets",
    accessor: "pet",
    className: "hidden md:table-cell",
  },
  {
    header: "Created At",
    accessor: "date",
    className: "hidden md:table-cell",
  },
  {
    header: "Role",
    accessor: "role",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];
const UserListPage = async ({
  searchParams,
}:{
  searchParams:{ [key:string]: string  | undefined;}
}) => {
  async function syncRoles(users: User[]) {
    for (const user of users) {
      const clerkUser = await clerkClient.users.getUser(user.clerkUserId);
      const clerkRole = clerkUser.publicMetadata.role as Role | undefined;
      if (clerkRole && clerkRole !== user.role) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: clerkRole },
        });
      }
    }
  }

  // Sync roles before fetching users
  await syncRoles(await prisma.user.findMany());

  const{page, ...queryParams } = searchParams || {}
  const p = page ? parseInt(page): 1;

  // ... (rest of the component code)

      const query: Prisma.UserWhereInput = {};

      if (queryParams){
        for(const [key,value] of Object.entries(queryParams)){
          if(value !== undefined){
            switch(key){
              case "petId": 
                query.pets = {
                  some: {
                      id: parseInt(value),
                  }
                };
                break;
              case "search":
                query.OR = [
                  { firstName: { contains: value, mode: "insensitive" } },
                  { lastName: { contains: value, mode: "insensitive" } },
                  { email: { contains: value, mode: "insensitive" } },
                ];
                break;
            } 
          }
        }
      }
  
  const [data, count] = await prisma.$transaction([
  prisma.user.findMany({
    where: query, 
    include: {
      pets: true,
      Appointment: true,
    },
    take: ITEM_PER_PAGE,
    skip: ITEM_PER_PAGE  * (p - 1),
  }),
    prisma.user.count({where:query}),
  ]);
 // Fetch Clerk user data to get roles
 const clerkUsers = await clerkClient.users.getUserList({
  userId: data.map(user => user.clerkUserId),
});

// Merge Clerk role data with Prisma user data
const clerkUsersResponse = await clerkClient.users.getUserList({
  userId: data.map(user => user.clerkUserId),
});

const usersWithRoles: UserList[] = data.map(user => {
  const clerkUser = clerkUsersResponse.data.find(cu => cu.id === user.clerkUserId);
  const userRole = clerkUser?.publicMetadata?.role as Role | undefined;
  return {
    ...user,
    role: userRole || 'user',
  };
});

const renderRow = (item: UserList) => {
  // Assuming the current user's role is available here
  const currentUserRole = 'admin'; // Replace this with the actual current user's role
  const isAdmin = currentUserRole === 'admin';
  
  return <UserRow key={item.id} item={item} isAdmin={isAdmin} />;
};

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Users</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          {/* <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
          </div> */}
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={usersWithRoles} />
      {/* PAGINATION */}
      <PaginationWrapper page={p} count={count} />
    </div>
  );
};

export default UserListPage;
