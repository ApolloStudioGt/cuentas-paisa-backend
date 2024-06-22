/*
  Warnings:

  - Added the required column `docReference` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "bankId" TEXT,
ADD COLUMN     "docAuthorization" TEXT,
ADD COLUMN     "docReference" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Bank" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bank_description_key" ON "Bank"("description");

-- CreateIndex
CREATE INDEX "Bank_isActive_idx" ON "Bank"("isActive");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE SET NULL ON UPDATE CASCADE;
