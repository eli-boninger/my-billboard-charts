-- AlterTable
ALTER TABLE "User" ADD COLUMN     "spotifyAuthorized" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "spotifyRefreshToken" TEXT NOT NULL DEFAULT '';
