/*
  Warnings:

  - You are about to alter the column `ipAddress` on the `ClickStat` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(45)`.
  - You are about to alter the column `country` on the `ClickStat` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2)`.
  - You are about to alter the column `city` on the `ClickStat` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `shortCode` on the `Link` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `title` on the `Link` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "ClickStat" ADD COLUMN     "browser" VARCHAR(50),
ADD COLUMN     "device" VARCHAR(50),
ADD COLUMN     "os" VARCHAR(50),
ALTER COLUMN "ipAddress" SET DATA TYPE VARCHAR(45),
ALTER COLUMN "country" SET DATA TYPE VARCHAR(2),
ALTER COLUMN "city" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastClickAt" TIMESTAMP(3),
ADD COLUMN     "maxClicks" INTEGER,
ADD COLUMN     "password" VARCHAR(255),
ALTER COLUMN "shortCode" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255);

-- CreateIndex
CREATE INDEX "ClickStat_country_idx" ON "ClickStat"("country");

-- CreateIndex
CREATE INDEX "Link_isActive_idx" ON "Link"("isActive");
