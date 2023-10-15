-- CreateEnum
CREATE TYPE "TopItemType" AS ENUM ('ARTIST', 'SONG');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastUpdateJob" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "TopItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TopItemType" NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TopItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopItemRank" (
    "id" TEXT NOT NULL,
    "topItemId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TopItemRank_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TopItem" ADD CONSTRAINT "TopItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopItemRank" ADD CONSTRAINT "TopItemRank_topItemId_fkey" FOREIGN KEY ("topItemId") REFERENCES "TopItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
