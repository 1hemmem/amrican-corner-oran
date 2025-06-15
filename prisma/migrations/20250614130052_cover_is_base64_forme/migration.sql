/*
  Warnings:

  - You are about to drop the column `blog_cover_url` on the `Blogs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blogs" DROP COLUMN "blog_cover_url",
ADD COLUMN     "blog_cover" TEXT;
