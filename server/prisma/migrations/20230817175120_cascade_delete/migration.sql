-- DropForeignKey
ALTER TABLE `Attendance` DROP FOREIGN KEY `Attendance_practitionerId_fkey`;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_practitionerId_fkey` FOREIGN KEY (`practitionerId`) REFERENCES `Practitioner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
