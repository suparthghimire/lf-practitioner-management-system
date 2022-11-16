-- DropIndex
DROP INDEX `Practitioner_image_key` ON `Practitioner`;

-- AlterTable
ALTER TABLE `Practitioner` MODIFY `address` VARCHAR(191) NOT NULL,
    MODIFY `image` LONGTEXT NOT NULL;
