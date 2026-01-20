-- AlterTable
ALTER TABLE "core"."tomadores" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
