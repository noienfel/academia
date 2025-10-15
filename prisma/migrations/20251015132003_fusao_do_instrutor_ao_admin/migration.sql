/*
  Warnings:

  - You are about to drop the column `instrutorId` on the `treinos` table. All the data in the column will be lost.
  - You are about to drop the `instrutores` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."treinos" DROP CONSTRAINT "treinos_instrutorId_fkey";

-- AlterTable
ALTER TABLE "treinos" DROP COLUMN "instrutorId";

-- DropTable
DROP TABLE "public"."instrutores";
