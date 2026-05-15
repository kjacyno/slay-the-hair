-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'HAIRDRESSER', 'ADMIN');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "photoUrl" TEXT,
    "role" "Role" NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" UUID NOT NULL,
    "hairdresserId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "startTime" INTEGER NOT NULL,
    "endTime" INTEGER NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" UUID NOT NULL,
    "clientId" UUID NOT NULL,
    "hairdresserId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "startTime" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Schedule_hairdresserId_date_idx" ON "Schedule"("hairdresserId", "date");

-- CreateIndex
CREATE INDEX "Appointment_clientId_date_idx" ON "Appointment"("clientId", "date");

-- CreateIndex
CREATE INDEX "Appointment_hairdresserId_date_startTime_idx" ON "Appointment"("hairdresserId", "date", "startTime");

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_hairdresserId_fkey" FOREIGN KEY ("hairdresserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_hairdresserId_fkey" FOREIGN KEY ("hairdresserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
