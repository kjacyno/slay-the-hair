/*
  Warnings:

  - The values [HAIRDRESSER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `hairdresserId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `hairdresserId` on the `Schedule` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - Added the required column `stylistId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stylistId` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - The required column `userId` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('CLIENT', 'STYLIST', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_hairdresserId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_hairdresserId_fkey";

-- DropIndex
DROP INDEX "Appointment_hairdresserId_date_startTime_idx";

-- DropIndex
DROP INDEX "Schedule_hairdresserId_date_idx";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "hairdresserId",
ADD COLUMN     "stylistId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "hairdresserId",
ADD COLUMN     "stylistId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");

-- CreateIndex
CREATE INDEX "Appointment_stylistId_date_startTime_idx" ON "Appointment"("stylistId", "date", "startTime");

-- CreateIndex
CREATE INDEX "Schedule_stylistId_date_idx" ON "Schedule"("stylistId", "date");

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_stylistId_fkey" FOREIGN KEY ("stylistId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_stylistId_fkey" FOREIGN KEY ("stylistId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
