/*
  Warnings:

  - You are about to drop the column `html` on the `Blogs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blogs" DROP COLUMN "html",
ALTER COLUMN "content" SET DATA TYPE TEXT;
