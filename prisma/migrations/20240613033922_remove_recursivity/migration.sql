/*
  Warnings:

  - You are about to drop the column `userId` on the `AccountCutOff` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AccountCutOff" DROP CONSTRAINT "AccountCutOff_userId_fkey";

-- AlterTable
ALTER TABLE "AccountCutOff" DROP COLUMN "userId";
