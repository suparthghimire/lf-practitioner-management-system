/*
  Warnings:

  - You are about to drop the column `practitionerId` on the `Attendance` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Attendance` DROP FOREIGN KEY `Attendance_practitionerId_fkey`;

-- AlterTable
ALTER TABLE `Attendance` DROP COLUMN `practitionerId`;

-- CreateTable
CREATE TABLE `_AttendanceToPractitioner` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_AttendanceToPractitioner_AB_unique`(`A`, `B`),
    INDEX `_AttendanceToPractitioner_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_AttendanceToPractitioner` ADD CONSTRAINT `_AttendanceToPractitioner_A_fkey` FOREIGN KEY (`A`) REFERENCES `Attendance`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AttendanceToPractitioner` ADD CONSTRAINT `_AttendanceToPractitioner_B_fkey` FOREIGN KEY (`B`) REFERENCES `Practitioner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
