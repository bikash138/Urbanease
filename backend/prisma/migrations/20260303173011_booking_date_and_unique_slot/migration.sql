/*
  Warnings:

  - A unique constraint covering the columns `[providerServiceId,slotId,date]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "date" DATE NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_providerServiceId_slotId_date_key" ON "Booking"("providerServiceId", "slotId", "date");
