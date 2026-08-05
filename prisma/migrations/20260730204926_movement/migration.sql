/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PAY_METHOD" AS ENUM ('CASH', 'TRANSFER', 'CARD');

-- CreateEnum
CREATE TYPE "STATUS_MOVEMENT" AS ENUM ('PAID', 'UNPAID', 'PARTIAL');

-- CreateEnum
CREATE TYPE "TYPE_MOVEMENT" AS ENUM ('INCOME', 'EXPENSE');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movements" (
    "id" SERIAL NOT NULL,
    "concept" TEXT NOT NULL,
    "customerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "payMethod" "PAY_METHOD" NOT NULL DEFAULT 'CASH',
    "type_movement" "TYPE_MOVEMENT" NOT NULL DEFAULT 'INCOME',
    "status" "STATUS_MOVEMENT" NOT NULL DEFAULT 'UNPAID',
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "movements_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movements" ADD CONSTRAINT "movements_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movements" ADD CONSTRAINT "movements_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
