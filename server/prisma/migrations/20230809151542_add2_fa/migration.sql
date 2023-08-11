-- CreateTable
CREATE TABLE `UserTwoFA` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `secret` VARCHAR(191) NOT NULL,
    `expiresIn` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PractitionerTwoFA` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `practitionerId` INTEGER NOT NULL,
    `secret` VARCHAR(191) NOT NULL,
    `expiresIn` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserTwoFA` ADD CONSTRAINT `UserTwoFA_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PractitionerTwoFA` ADD CONSTRAINT `PractitionerTwoFA_practitionerId_fkey` FOREIGN KEY (`practitionerId`) REFERENCES `Practitioner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
