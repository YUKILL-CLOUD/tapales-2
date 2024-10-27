/*
  Warnings:

  - You are about to drop the column `dosage` on the `Prescription` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Prescription` table. All the data in the column will be lost.
  - You are about to drop the column `instructions` on the `Prescription` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Prescription` table. All the data in the column will be lost.
  - The `medication` column on the `Prescription` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Prescription" DROP COLUMN "dosage",
DROP COLUMN "endDate",
DROP COLUMN "instructions",
DROP COLUMN "startDate",
DROP COLUMN "medication",
ADD COLUMN     "medication" JSONB[];
