/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `ProviderProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `ServiceCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `ProviderProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `ServiceCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProviderProfile" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ServiceCategory" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProviderProfile_slug_key" ON "ProviderProfile"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_slug_key" ON "ServiceCategory"("slug");
