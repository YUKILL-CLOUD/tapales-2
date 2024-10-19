/*
  Warnings:

  - Added the required column `birthday` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "birthday" TIMESTAMP(3) NOT NULL;
