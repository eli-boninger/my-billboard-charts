/*
  Warnings:

  - A unique constraint covering the columns `[spotifyId,userId]` on the table `TopItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TopItem_spotifyId_userId_key" ON "TopItem"("spotifyId", "userId");
