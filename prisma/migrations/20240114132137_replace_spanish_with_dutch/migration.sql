/*
  Warnings:

  - You are about to drop the column `spanish` on the `LanguageCard` table. All the data in the column will be lost.
  - Added the required column `dutch` to the `LanguageCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LanguageCard" DROP COLUMN "spanish",
ADD COLUMN     "dutch" TEXT NOT NULL;
