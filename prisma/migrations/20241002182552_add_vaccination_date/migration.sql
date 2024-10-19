-- CreateTable
CREATE TABLE "VaccinationRecord" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "vaccineName" TEXT NOT NULL,
    "dateAdministered" TIMESTAMP(3) NOT NULL,
    "nextDueDate" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "VaccinationRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VaccinationRecord" ADD CONSTRAINT "VaccinationRecord_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
