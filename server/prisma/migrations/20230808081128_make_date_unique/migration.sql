/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Attendance_date_key` ON `Attendance`(`date`);
