/*
  Warnings:

  - You are about to drop the `AuthOnUsers` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[authId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AuthOnUsers" DROP CONSTRAINT "AuthOnUsers_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authId" TEXT;

-- DropTable
DROP TABLE "AuthOnUsers";

-- CreateIndex
CREATE UNIQUE INDEX "User_authId_key" ON "User"("authId");
