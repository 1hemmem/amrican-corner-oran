/*
  Warnings:

  - Added the required column `blog_cover_url` to the `Blogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blogs" ADD COLUMN     "blog_cover_url" TEXT NOT NULL;
