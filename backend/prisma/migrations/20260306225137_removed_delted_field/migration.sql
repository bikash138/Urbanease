/*
  Warnings:

  - The values [DELETED] on the enum `ReviewStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReviewStatus_new" AS ENUM ('VISIBLE', 'FLAGGED', 'HIDDEN');
ALTER TABLE "public"."Review" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Review" ALTER COLUMN "status" TYPE "ReviewStatus_new" USING ("status"::text::"ReviewStatus_new");
ALTER TYPE "ReviewStatus" RENAME TO "ReviewStatus_old";
ALTER TYPE "ReviewStatus_new" RENAME TO "ReviewStatus";
DROP TYPE "public"."ReviewStatus_old";
ALTER TABLE "Review" ALTER COLUMN "status" SET DEFAULT 'VISIBLE';
COMMIT;
