-- AlterTable
ALTER TABLE "recipes" ADD COLUMN "cuisine" TEXT;
ALTER TABLE "recipes" ADD COLUMN "instructions" TEXT[] DEFAULT ARRAY[]::TEXT[];
