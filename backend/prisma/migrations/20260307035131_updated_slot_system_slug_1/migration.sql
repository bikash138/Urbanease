/*
  Warnings:

  - You are about to drop the column `providerId` on the `ProviderSlot` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[providerSlug,date,slot]` on the table `ProviderSlot` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `providerSlug` to the `ProviderSlot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProviderSlot" DROP CONSTRAINT "ProviderSlot_providerId_fkey";

-- DropIndex
DROP INDEX "ProviderSlot_providerId_date_slot_key";

-- AlterTable
ALTER TABLE "ProviderSlot" DROP COLUMN "providerId",
ADD COLUMN     "providerSlug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProviderSlot_providerSlug_date_slot_key" ON "ProviderSlot"("providerSlug", "date", "slot");

-- AddForeignKey
ALTER TABLE "ProviderSlot" ADD CONSTRAINT "ProviderSlot_providerSlug_fkey" FOREIGN KEY ("providerSlug") REFERENCES "ProviderProfile"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
