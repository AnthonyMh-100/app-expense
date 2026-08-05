-- AlterTable
ALTER TABLE "company" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "email" TEXT,
ADD COLUMN "password" TEXT,
ADD COLUMN "status" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "updatedAt" TIMESTAMP(3);

-- Backfill de la empresa existente
UPDATE "company" SET "updatedAt" = CURRENT_TIMESTAMP, "email" = 'admin@imprenta.pe', "password" = '$2b$10$o/V5zv4NirqV8rOcmovMFuuBin7wkpPuqnb1R6yrJapzI1SNaTUT2' WHERE "email" IS NULL;

ALTER TABLE "company" ALTER COLUMN "email" SET NOT NULL;
ALTER TABLE "company" ALTER COLUMN "password" SET NOT NULL;
ALTER TABLE "company" ALTER COLUMN "updatedAt" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "company_email_key" ON "company"("email");

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_fkey";

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "userId",
ADD COLUMN "companyId" INTEGER;

-- Backfill de sesiones (tabla probablemente vacía; se asigna a la empresa existente)
UPDATE "sessions" SET "companyId" = 1 WHERE "companyId" IS NULL;

ALTER TABLE "sessions" ALTER COLUMN "companyId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "sessions_companyId_idx" ON "sessions"("companyId");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropTable
DROP TABLE "users";