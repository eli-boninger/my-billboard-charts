/*
  Warnings:

  - You are about to drop the column `spotify_refresh_toekn` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "spotify_refresh_toekn",
ADD COLUMN     "spotify_refresh_token" TEXT NOT NULL DEFAULT '';
