/*
  Warnings:

  - You are about to drop the `VaccinationRecord` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "VaccinationRecord" DROP CONSTRAINT "VaccinationRecord_petId_fkey";

-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "type" TEXT NOT NULL;

-- DropTable
DROP TABLE "VaccinationRecord";

-- CreateTable
CREATE TABLE "Vaccination" (
    "id" TEXT NOT NULL,
    "vaccineName" TEXT NOT NULL,
    "medicineName" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "petId" INTEGER NOT NULL,

    CONSTRAINT "Vaccination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deworming" (
    "id" TEXT NOT NULL,
    "medicineName" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "nextDueDate" TIMESTAMP(3) NOT NULL,
    "petId" INTEGER NOT NULL,

    CONSTRAINT "Deworming_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vaccination" ADD CONSTRAINT "Vaccination_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deworming" ADD CONSTRAINT "Deworming_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
