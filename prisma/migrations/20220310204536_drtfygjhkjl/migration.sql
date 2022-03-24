/*
  Warnings:

  - You are about to drop the column `followersId` on the `Followers` table. All the data in the column will be lost.
  - You are about to drop the column `followingId` on the `Following` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Followers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Following` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Followers" DROP CONSTRAINT "Followers_followersId_fkey";

-- DropForeignKey
ALTER TABLE "Following" DROP CONSTRAINT "Following_followingId_fkey";

-- AlterTable
ALTER TABLE "Followers" DROP COLUMN "followersId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Following" DROP COLUMN "followingId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Following" ADD CONSTRAINT "Following_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Followers" ADD CONSTRAINT "Followers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
