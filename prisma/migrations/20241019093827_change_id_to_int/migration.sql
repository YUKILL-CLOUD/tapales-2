/*
  Warnings:

  - The primary key for the `Deworming` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Deworming` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Vaccination` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Vaccination` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Veterinarian` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Veterinarian` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Deworming" DROP CONSTRAINT "Deworming_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Deworming_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Vaccination" DROP CONSTRAINT "Vaccination_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Vaccination_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Veterinarian" DROP CONSTRAINT "Veterinarian_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Veterinarian_pkey" PRIMARY KEY ("id");
