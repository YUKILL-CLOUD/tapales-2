import prisma from "./prisma";



export async function getPets(userId: string) {
  const pets = await prisma.pet.findMany({
    where: { userId: userId },
    select: { id: true, name: true },
  });
  return pets;
}
