-- CreateTable
CREATE TABLE "Stats" (
    "id" SERIAL NOT NULL,
    "followingId" INTEGER NOT NULL,
    "followersId" INTEGER NOT NULL,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_followersId_fkey" FOREIGN KEY ("followersId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
