/*
  Warnings:

  - You are about to drop the column `userId` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `saleTypeId` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "saleTypeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "SaleType" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SaleType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SaleType_isActive_idx" ON "SaleType"("isActive");

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_saleTypeId_fkey" FOREIGN KEY ("saleTypeId") REFERENCES "SaleType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
