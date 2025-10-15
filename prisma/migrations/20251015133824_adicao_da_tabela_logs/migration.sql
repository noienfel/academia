/*
  Warnings:

  - You are about to drop the column `adminId` on the `pagamentos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."pagamentos" DROP CONSTRAINT "pagamentos_adminId_fkey";

-- AlterTable
ALTER TABLE "exercicios" ADD COLUMN     "adminId" VARCHAR(36);

-- AlterTable
ALTER TABLE "pagamentos" DROP COLUMN "adminId";

-- CreateTable
CREATE TABLE "logs" (
    "id" SERIAL NOT NULL,
    "adminId" VARCHAR(36) NOT NULL,
    "descricao" VARCHAR(60) NOT NULL,
    "complemento" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "exercicios" ADD CONSTRAINT "exercicios_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
