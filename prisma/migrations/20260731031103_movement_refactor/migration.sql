/*
  Warnings:

  - You are about to drop the column `type_movement` on the `movements` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "movements" DROP COLUMN "type_movement",
ADD COLUMN     "observation" TEXT,
ADD COLUMN     "typeMovement" "TYPE_MOVEMENT" NOT NULL DEFAULT 'INCOME';
