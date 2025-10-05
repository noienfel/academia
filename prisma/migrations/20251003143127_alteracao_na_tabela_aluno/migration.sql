/*
  Warnings:

  - You are about to drop the column `matriculado` on the `Treino` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Aluno" ADD COLUMN     "matriculado" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Treino" DROP COLUMN "matriculado";
