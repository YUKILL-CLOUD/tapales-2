/*
  Warnings:

  - You are about to drop the column `description` on the `HealthRecord` table. All the data in the column will be lost.
  - You are about to drop the column `vaccinations` on the `HealthRecord` table. All the data in the column will be lost.
  - Added the required column `diagnosis` to the `HealthRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `temperature` to the `HealthRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `treatment` to the `HealthRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `HealthRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `HealthRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HealthRecord" DROP COLUMN "description",
DROP COLUMN "vaccinations",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "diagnosis" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "temperature" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "treatment" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "HealthRecord_petId_idx" ON "HealthRecord"("petId");

-- CreateIndex
CREATE INDEX "Pet_userId_idx" ON "Pet"("userId");
