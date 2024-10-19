/*
  Warnings:

  - You are about to drop the column `clerkUserId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `Vaccination` table. All the data in the column will be lost.
  - Added the required column `dewormingName` to the `Deworming` table without a default value. This is not possible if the table is not empty.
  - Added the required column `manufacturer` to the `Deworming` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `manufacturer` to the `Vaccination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nextDueDate` to the `Vaccination` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_clerkUserId_key";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Deworming" ADD COLUMN     "dewormingName" TEXT NOT NULL,
ADD COLUMN     "manufacturer" TEXT NOT NULL,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "clerkUserId",
DROP COLUMN "email",
DROP COLUMN "firstName",
DROP COLUMN "imageUrl",
DROP COLUMN "lastName";

-- AlterTable
ALTER TABLE "Vaccination" DROP COLUMN "dueDate",
ADD COLUMN     "manufacturer" TEXT NOT NULL,
ADD COLUMN     "nextDueDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Veterinarian" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "prclicNo" TEXT NOT NULL,
    "prtNo" TEXT NOT NULL,
    "tinNo" TEXT NOT NULL,
    "clinicInfoId" INTEGER NOT NULL,

    CONSTRAINT "Veterinarian_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Veterinarian" ADD CONSTRAINT "Veterinarian_clinicInfoId_fkey" FOREIGN KEY ("clinicInfoId") REFERENCES "ClinicInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
