/*
  Warnings:

  - The primary key for the `Appointment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Appointment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Schedule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Schedule` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[clientId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stylistId]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- 1. Drop foreign key constraints that depend on User_pkey
ALTER TABLE "Schedule"
    DROP CONSTRAINT IF EXISTS "Schedule_stylistId_fkey";
ALTER TABLE "Appointment"
    DROP CONSTRAINT IF EXISTS "Appointment_clientId_fkey";
ALTER TABLE "Appointment"
    DROP CONSTRAINT IF EXISTS "Appointment_stylistId_fkey";

-- AlterTable
ALTER TABLE "Appointment"
    DROP CONSTRAINT "Appointment_pkey",
    DROP COLUMN IF EXISTS "id",
    ADD COLUMN "id" SERIAL NOT NULL,
    ADD CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Schedule"
    DROP CONSTRAINT "Schedule_pkey",
    DROP COLUMN IF EXISTS "id",
    ADD COLUMN "id" SERIAL NOT NULL,
    ADD CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User"
    DROP CONSTRAINT "User_pkey",
    ADD COLUMN IF NOT EXISTS "id" SERIAL NOT NULL,
    ALTER COLUMN "isApproved" SET DEFAULT true,
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- Create UNIQUE index on User(userId) FIRST
CREATE UNIQUE INDEX IF NOT EXISTS "User_userId_key" ON "User"("userId");

-- Re-add foreign key constraints NOW that User(userId) is guaranteed UNIQUE
ALTER TABLE "Schedule"
    ADD CONSTRAINT "Schedule_stylistId_fkey"
        FOREIGN KEY ("stylistId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Appointment"
    ADD CONSTRAINT "Appointment_clientId_fkey"
        FOREIGN KEY ("clientId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Appointment"
    ADD CONSTRAINT "Appointment_stylistId_fkey"
        FOREIGN KEY ("stylistId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE;

