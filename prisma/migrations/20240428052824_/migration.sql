/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `services` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "services" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");
