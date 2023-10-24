/*
  Warnings:

  - You are about to drop the `Password` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TopItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TopItemRank` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "top_item_type" AS ENUM ('ARTIST', 'TRACK');

-- DropForeignKey
ALTER TABLE "Password" DROP CONSTRAINT "Password_userId_fkey";

-- DropForeignKey
ALTER TABLE "TopItem" DROP CONSTRAINT "TopItem_userId_fkey";

-- DropForeignKey
ALTER TABLE "TopItemRank" DROP CONSTRAINT "TopItemRank_topItemId_fkey";

-- DropTable
DROP TABLE "Password";

-- DropTable
DROP TABLE "TopItem";

-- DropTable
DROP TABLE "TopItemRank";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "TopItemType";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "spotify_authorized" BOOLEAN NOT NULL DEFAULT false,
    "spotify_refresh_toekn" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_update_job" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password" (
    "hash" TEXT NOT NULL,
    "user_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "top_item" (
    "id" TEXT NOT NULL,
    "spotify_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_currently_ranked" BOOLEAN NOT NULL DEFAULT true,
    "top_item_type" "top_item_type" NOT NULL,
    "album" TEXT,
    "artists" TEXT[],

    CONSTRAINT "top_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "top_item_rank" (
    "id" TEXT NOT NULL,
    "top_item_id" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "previous_rank" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "top_item_rank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "password_user_id_key" ON "password"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "top_item_spotify_id_user_id_top_item_type_key" ON "top_item"("spotify_id", "user_id", "top_item_type");

-- AddForeignKey
ALTER TABLE "password" ADD CONSTRAINT "password_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "top_item" ADD CONSTRAINT "top_item_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "top_item_rank" ADD CONSTRAINT "top_item_rank_top_item_id_fkey" FOREIGN KEY ("top_item_id") REFERENCES "top_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
