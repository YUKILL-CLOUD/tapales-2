/*
  Warnings:

  - You are about to drop the column `clinicInfoId` on the `Veterinarian` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Veterinarian" DROP CONSTRAINT "Veterinarian_clinicInfoId_fkey";

-- AlterTable
ALTER TABLE "Veterinarian" DROP COLUMN "clinicInfoId";
