/*
  Warnings:

  - Added the required column `expireTime` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `RefreshToken` ADD COLUMN `expireTime` DATETIME(3) NOT NULL;
