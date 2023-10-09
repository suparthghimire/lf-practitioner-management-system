/*
  Warnings:

  - A unique constraint covering the columns `[date,practitionerId]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Attendance_date_key` ON `Attendance`;

-- CreateIndex
CREATE UNIQUE INDEX `Attendance_date_practitionerId_key` ON `Attendance`(`date`, `practitionerId`);
