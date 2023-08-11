-- AlterTable
ALTER TABLE `Attendance` ADD COLUMN `wasOvertime` BOOLEAN NULL,
    MODIFY `wasLate` BOOLEAN NULL,
    ALTER COLUMN `minHrAchieved` DROP DEFAULT;
