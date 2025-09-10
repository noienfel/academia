/*
  Warnings:

  - Changed the type of `status` on the `Pagamento` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `metodo` on the `Pagamento` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDENTE', 'PAGO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "Metodo" AS ENUM ('CARTAO', 'PIX', 'DINHEIRO');

-- AlterTable
ALTER TABLE "Pagamento" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL,
DROP COLUMN "metodo",
ADD COLUMN     "metodo" "Metodo" NOT NULL;
