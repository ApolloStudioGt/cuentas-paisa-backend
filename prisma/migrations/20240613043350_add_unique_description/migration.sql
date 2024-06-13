/*
  Warnings:

  - A unique constraint covering the columns `[description]` on the table `SaleType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SaleType_description_key" ON "SaleType"("description");
