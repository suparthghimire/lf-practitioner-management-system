-- CreateTable
CREATE TABLE `Attendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `checkInTime` DATETIME(3) NOT NULL,
    `checkOutTime` DATETIME(3) NOT NULL,
    `duration` INTEGER NOT NULL,
    `wasLate` BOOLEAN NOT NULL DEFAULT false,
    `practitionerId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_practitionerId_fkey` FOREIGN KEY (`practitionerId`) REFERENCES `Practitioner`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
