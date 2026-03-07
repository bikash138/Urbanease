/*
  Warnings:

  - You are about to drop the `ProviderUnavailability` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Slot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProviderServiceToSlot` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `slotId` on table `Booking` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `image` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `ServiceCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_slotId_fkey";

-- DropForeignKey
ALTER TABLE "ProviderUnavailability" DROP CONSTRAINT "ProviderUnavailability_providerId_fkey";

-- DropForeignKey
ALTER TABLE "ProviderUnavailability" DROP CONSTRAINT "ProviderUnavailability_slotId_fkey";

-- DropForeignKey
ALTER TABLE "Slot" DROP CONSTRAINT "Slot_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "_ProviderServiceToSlot" DROP CONSTRAINT "_ProviderServiceToSlot_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProviderServiceToSlot" DROP CONSTRAINT "_ProviderServiceToSlot_B_fkey";

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "slotId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ServiceCategory" ADD COLUMN     "image" TEXT NOT NULL;

-- DropTable
DROP TABLE "ProviderUnavailability";

-- DropTable
DROP TABLE "Slot";

-- DropTable
DROP TABLE "_ProviderServiceToSlot";

-- CreateTable
CREATE TABLE "ProviderSlot" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "slot" "SlotLabel" NOT NULL,
    "totalSlots" INTEGER NOT NULL,
    "bookedSlots" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProviderSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProviderSlot_providerId_date_slot_key" ON "ProviderSlot"("providerId", "date", "slot");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "ProviderSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderSlot" ADD CONSTRAINT "ProviderSlot_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
