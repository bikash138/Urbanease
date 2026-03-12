/*
  Warnings:

  - Made the column `profileImage` on table `ProviderProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ProviderProfile" ALTER COLUMN "profileImage" SET NOT NULL;
