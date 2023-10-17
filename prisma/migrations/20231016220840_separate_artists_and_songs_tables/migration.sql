/*
  Warnings:

  - You are about to drop the `TopItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TopItemRank` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TopItem" DROP CONSTRAINT "TopItem_userId_fkey";

-- DropForeignKey
ALTER TABLE "TopItemRank" DROP CONSTRAINT "TopItemRank_topItemId_fkey";

-- DropTable
DROP TABLE "TopItem";

-- DropTable
DROP TABLE "TopItemRank";

-- DropEnum
DROP TYPE "TopItemType";

-- CreateTable
CREATE TABLE "TopArtist" (
    "id" TEXT NOT NULL,
    "spotifyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isCurrentlyRanked" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TopArtist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopArtistRank" (
    "id" TEXT NOT NULL,
    "topItemId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TopArtistRank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopTrack" (
    "id" TEXT NOT NULL,
    "spotifyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "artists" TEXT[],
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isCurrentlyRanked" BOOLEAN NOT NULL DEFAULT true,
    "album" TEXT NOT NULL,

    CONSTRAINT "TopTrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopTrackRank" (
    "id" TEXT NOT NULL,
    "topItemId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TopTrackRank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TopArtist_spotifyId_userId_key" ON "TopArtist"("spotifyId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "TopTrack_spotifyId_userId_key" ON "TopTrack"("spotifyId", "userId");

-- AddForeignKey
ALTER TABLE "TopArtist" ADD CONSTRAINT "TopArtist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopArtistRank" ADD CONSTRAINT "TopArtistRank_topItemId_fkey" FOREIGN KEY ("topItemId") REFERENCES "TopArtist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopTrack" ADD CONSTRAINT "TopTrack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopTrackRank" ADD CONSTRAINT "TopTrackRank_topItemId_fkey" FOREIGN KEY ("topItemId") REFERENCES "TopTrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
