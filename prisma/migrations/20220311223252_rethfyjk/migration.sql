/*
  Warnings:

  - The `likes` column on the `Media` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `dislikes` column on the `Media` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Media" DROP COLUMN "likes",
ADD COLUMN     "likes" INTEGER[],
DROP COLUMN "dislikes",
ADD COLUMN     "dislikes" INTEGER[];

-- CreateTable
CREATE TABLE "Favourites" (
    "id" SERIAL NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Favourites_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Favourites" ADD CONSTRAINT "Favourites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favourites" ADD CONSTRAINT "Favourites_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
