-- DropForeignKey
ALTER TABLE "Favourites" DROP CONSTRAINT "Favourites_mediaId_fkey";

-- AddForeignKey
ALTER TABLE "Favourites" ADD CONSTRAINT "Favourites_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
