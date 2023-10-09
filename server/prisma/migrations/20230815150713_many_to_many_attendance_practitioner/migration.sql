/*
  Warnings:

  - You are about to drop the `_AttendanceToPractitioner` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `practitionerId` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_AttendanceToPractitioner` DROP FOREIGN KEY `_AttendanceToPractitioner_A_fkey`;

-- DropForeignKey
ALTER TABLE `_AttendanceToPractitioner` DROP FOREIGN KEY `_AttendanceToPractitioner_B_fkey`;

-- AlterTable
ALTER TABLE `Attendance` ADD COLUMN `practitionerId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_AttendanceToPractitioner`;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_practitionerId_fkey` FOREIGN KEY (`practitionerId`) REFERENCES `Practitioner`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
