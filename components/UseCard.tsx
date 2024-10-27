import prisma from "@/lib/prisma";
import { Icon } from "@iconify/react/dist/iconify.js";

const UserCard = async ({
  type,
}: {
  type: "user" | "pet" | "appointment";
}) => {
  let data;

  if (type === "appointment") {
    const [pendingCount, scheduledCount, completedCount, missedCount] = await Promise.all([
      prisma.appointment.count({ where: { status: 'pending' } }),
      prisma.appointment.count({ where: { status: 'scheduled' } }),
      prisma.appointment.count({ where: { status: 'completed' } }),
      prisma.appointment.count({ where: { status: 'missed' } })
    ]);

    data = {
      pending: pendingCount,
      scheduled: scheduledCount,
      completed: completedCount,
      missed: missedCount,
    };
  } else if (type === "pet") {
    const [dogCount, catCount, otherCount] = await Promise.all([
      prisma.pet.count({ where: { type: { equals: 'DOG', mode: 'insensitive' } } }),
      prisma.pet.count({ where: { type: { equals: 'CAT', mode: 'insensitive' } } }),
      prisma.pet.count({ 
        where: { 
          NOT: [
            { type: { equals: 'DOG', mode: 'insensitive' } },
            { type: { equals: 'CAT', mode: 'insensitive' } }
          ]
        } 
      })
    ]);

    data = {
      dog: dogCount,
      cat: catCount,
      other: otherCount,
    };
  } else if (type === "user") {
    const [adminCount, userCount] = await Promise.all([
      prisma.user.count({ where: { role: 'admin' } }),
      prisma.user.count({ where: { role: 'user' } })
    ]);

    data = {
      admin: adminCount,
      user: userCount,
    };
  }

  return (
    <div className="rounded-2xl odd:bg-mainColor-400 even:bg-mainColor-light p-4 flex-1 min-w-[130px] shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          {new Date().getFullYear()}
        </span>
        <Icon icon="mdi:dots-vertical" width="20" height="20" />
      </div>
      {type === "appointment" ? (
        <>
          <h1 className="text-sm font-medium text-gray-700 my-4">{data?.pending} Pending</h1>
          <h1 className="text-sm font-medium text-gray-700 my-4">{data?.scheduled} Scheduled</h1>
          <h1 className="text-sm font-medium text-gray-700 my-4">{data?.completed} Completed</h1>
          <h1 className="text-sm font-medium text-gray-700 my-4">{data?.missed} Missed</h1>
        </>
      ) : type === "pet" ? (
        <>
          <h1 className="text-sm font-medium text-gray-700 my-4">{data?.dog} Dogs</h1>
          <h1 className="text-sm font-medium text-gray-700 my-4">{data?.cat} Cats</h1>
          <h1 className="text-sm font-medium text-gray-700 my-4">{data?.other} Others</h1>
        </>
      ) : (
        <>
          <h1 className="text-sm font-medium text-gray-700 my-4">{data?.admin} Admins</h1>
          <h1 className="text-sm font-medium text-gray-700 my-4">{data?.user} Users</h1>
        </>
      )}
      <h2 className="capitalize text-lg font-2xl text-gray-250">{type}s</h2>
    </div>
  );
};

export default UserCard;
