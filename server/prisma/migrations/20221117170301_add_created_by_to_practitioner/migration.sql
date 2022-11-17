/*
  Warnings:

  - Added the required column `createdByUserId` to the `Practitioner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Practitioner` ADD COLUMN `createdByUserId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Practitioner` ADD CONSTRAINT `Practitioner_createdByUserId_fkey` FOREIGN KEY (`createdByUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
