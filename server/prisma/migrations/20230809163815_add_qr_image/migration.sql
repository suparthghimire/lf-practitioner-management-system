/*
  Warnings:

  - You are about to drop the column `expiresIn` on the `PractitionerTwoFA` table. All the data in the column will be lost.
  - You are about to drop the column `expiresIn` on the `UserTwoFA` table. All the data in the column will be lost.
  - Added the required column `qrImage` to the `PractitionerTwoFA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qrImage` to the `UserTwoFA` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `PractitionerTwoFA` DROP COLUMN `expiresIn`,
    ADD COLUMN `qrImage` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `UserTwoFA` DROP COLUMN `expiresIn`,
    ADD COLUMN `qrImage` VARCHAR(191) NOT NULL;
