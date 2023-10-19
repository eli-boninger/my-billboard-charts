/*
  Warnings:

  - You are about to drop the `TopArtist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TopArtistRank` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TopTrack` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TopTrackRank` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TopItemType" AS ENUM ('ARTIST', 'TRACK');

-- DropForeignKey
ALTER TABLE "TopArtist" DROP CONSTRAINT "TopArtist_userId_fkey";

-- DropForeignKey
ALTER TABLE "TopArtistRank" DROP CONSTRAINT "TopArtistRank_topItemId_fkey";

-- DropForeignKey
ALTER TABLE "TopTrack" DROP CONSTRAINT "TopTrack_userId_fkey";

-- DropForeignKey
ALTER TABLE "TopTrackRank" DROP CONSTRAINT "TopTrackRank_topItemId_fkey";

-- DropTable
DROP TABLE "TopArtist";

-- DropTable
DROP TABLE "TopArtistRank";

-- DropTable
DROP TABLE "TopTrack";

-- DropTable
DROP TABLE "TopTrackRank";

-- CreateTable
CREATE TABLE "TopItem" (
    "id" TEXT NOT NULL,
    "spotifyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isCurrentlyRanked" BOOLEAN NOT NULL DEFAULT true,
    "topItemType" "TopItemType" NOT NULL,
    "album" TEXT,
    "artists" TEXT[],

    CONSTRAINT "TopItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopItemRank" (
    "id" TEXT NOT NULL,
    "topItemId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "previousRank" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TopItemRank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TopItem_spotifyId_userId_topItemType_key" ON "TopItem"("spotifyId", "userId", "topItemType");

-- AddForeignKey
ALTER TABLE "TopItem" ADD CONSTRAINT "TopItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopItemRank" ADD CONSTRAINT "TopItemRank_topItemId_fkey" FOREIGN KEY ("topItemId") REFERENCES "TopItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
