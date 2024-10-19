/*
  Warnings:

  - Added the required column `veterinarianId` to the `Deworming` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Deworming` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deworming" ADD COLUMN     "veterinarianId" INTEGER NOT NULL,
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "nextDueDate" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Deworming" ADD CONSTRAINT "Deworming_veterinarianId_fkey" FOREIGN KEY ("veterinarianId") REFERENCES "Veterinarian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
