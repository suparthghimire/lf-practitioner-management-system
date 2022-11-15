/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Day` table. All the data in the column will be lost.
  - You are about to drop the column `practitionerId` on the `Day` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Day` table. All the data in the column will be lost.
  - You are about to drop the column `practitionerId` on the `Specialization` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Day` DROP FOREIGN KEY `Day_practitionerId_fkey`;

-- DropForeignKey
ALTER TABLE `Specialization` DROP FOREIGN KEY `Specialization_practitionerId_fkey`;

-- AlterTable
ALTER TABLE `Day` DROP COLUMN `createdAt`,
    DROP COLUMN `practitionerId`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `Specialization` DROP COLUMN `practitionerId`;

-- CreateTable
CREATE TABLE `_PractitionerToSpecialization` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PractitionerToSpecialization_AB_unique`(`A`, `B`),
    INDEX `_PractitionerToSpecialization_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DayToPractitioner` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DayToPractitioner_AB_unique`(`A`, `B`),
    INDEX `_DayToPractitioner_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_PractitionerToSpecialization` ADD CONSTRAINT `_PractitionerToSpecialization_A_fkey` FOREIGN KEY (`A`) REFERENCES `Practitioner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PractitionerToSpecialization` ADD CONSTRAINT `_PractitionerToSpecialization_B_fkey` FOREIGN KEY (`B`) REFERENCES `Specialization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DayToPractitioner` ADD CONSTRAINT `_DayToPractitioner_A_fkey` FOREIGN KEY (`A`) REFERENCES `Day`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DayToPractitioner` ADD CONSTRAINT `_DayToPractitioner_B_fkey` FOREIGN KEY (`B`) REFERENCES `Practitioner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
