/*
  Warnings:

  - Made the column `event_id` on table `guests` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "price" INTEGER;

-- AlterTable
ALTER TABLE "guests" ALTER COLUMN "event_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;
