-- DropForeignKey
ALTER TABLE "ProviderSlot" DROP CONSTRAINT "ProviderSlot_providerId_fkey";

-- AddForeignKey
ALTER TABLE "ProviderSlot" ADD CONSTRAINT "ProviderSlot_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
