/*
  Warnings:

  - The values [MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY] on the enum `Day_day` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Day` MODIFY `day` ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL;
