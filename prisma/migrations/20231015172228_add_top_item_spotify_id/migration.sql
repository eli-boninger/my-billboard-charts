/*
  Warnings:

  - Added the required column `spotifyId` to the `TopItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TopItem" ADD COLUMN     "spotifyId" TEXT NOT NULL;
