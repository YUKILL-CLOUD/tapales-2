import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { role } from "@/lib/utils";
import { Appointment, Pet, Prisma, User } from "@prisma/client";
// import { Appointment, Pet, Prisma, Profile, Role, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";


type UserList = User & {pets:Pet[]} & {Appointment:Appointment[]}

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
    header: "Actions",
    accessor: "action",
  },
];
const renderRow = (item: UserList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
      <div className="md:hidden xl:block w-10 h-10 rounded-full overflow-hidden">{item.imageUrl ? (
    <img
      src={item.imageUrl}
      alt="User Avatar"
      className="w-full h-full object-cover"
    />
  ) : (
    <img src="/noAvatar.png" alt="" />
  )}
    </div>  
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.firstName} {item.lastName}</h3>
          <p className="text-xs text-gray-500">{item?.id}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item?.email}</td>
      <td className="hidden md:table-cell">{item.pets?.map((pet) => pet.name).join(', ') || "-"}</td>
      <td className="hidden md:table-cell"> {item.createdAt.toLocaleDateString()}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/users/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
            //   <Image src="/delete.png" alt="" width={16} height={16} />
            // </button>
            <FormModal table="pet" type="delete" id={Number(item.id)}/>
          )}
        </div>
      </td>
    </tr>
  );
const TeacherListPage = async ({
  searchParams,
}:{
  searchParams:{ [key:string]: string  | undefined;}
}) => {
  const{page, ...queryParams } = searchParams || {}
  const p = page ? parseInt(page): 1;

  //url params


      // URL PARAMS CONDITIONS 

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
                  query.firstName = {contains: value, mode:"insensitive"}
                  query.lastName = {contains: value, mode:"insensitive"}
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

 
  // console.log(data)

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All User</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
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

export default TeacherListPage;
