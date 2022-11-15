/*
  Warnings:

  - A unique constraint covering the columns `[day]` on the table `Day` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Specialization` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Day_day_key` ON `Day`(`day`);

-- CreateIndex
CREATE UNIQUE INDEX `Specialization_name_key` ON `Specialization`(`name`);
