/*
  Warnings:

  - A unique constraint covering the columns `[practitionerId]` on the table `PractitionerTwoFA` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `UserTwoFA` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `PractitionerTwoFA` ADD COLUMN `verified` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `UserTwoFA` ADD COLUMN `verified` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `PractitionerTwoFA_practitionerId_key` ON `PractitionerTwoFA`(`practitionerId`);

-- CreateIndex
CREATE UNIQUE INDEX `UserTwoFA_userId_key` ON `UserTwoFA`(`userId`);
