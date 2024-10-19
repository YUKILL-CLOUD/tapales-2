/*
  Warnings:

  - Added the required column `veterinarianId` to the `Vaccination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Vaccination` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vaccination" ADD COLUMN     "veterinarianId" INTEGER NOT NULL,
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL;

-- AddForeignKey
ALTER TABLE "Vaccination" ADD CONSTRAINT "Vaccination_veterinarianId_fkey" FOREIGN KEY ("veterinarianId") REFERENCES "Veterinarian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
