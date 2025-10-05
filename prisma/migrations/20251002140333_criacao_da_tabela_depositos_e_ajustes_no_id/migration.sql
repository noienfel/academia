/*
  Warnings:

  - The primary key for the `Aluno` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Exercicio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Instrutor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Pagamento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Treino` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."Exercicio" DROP CONSTRAINT "Exercicio_treinoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Pagamento" DROP CONSTRAINT "Pagamento_alunoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Treino" DROP CONSTRAINT "Treino_alunoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Treino" DROP CONSTRAINT "Treino_instrutorId_fkey";

-- AlterTable
ALTER TABLE "public"."Aluno" DROP CONSTRAINT "Aluno_pkey",
ADD COLUMN     "saldo" DECIMAL(9,2) NOT NULL DEFAULT 0,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(36),
ADD CONSTRAINT "Aluno_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Aluno_id_seq";

-- AlterTable
ALTER TABLE "public"."Exercicio" DROP CONSTRAINT "Exercicio_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "treinoId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Exercicio_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Exercicio_id_seq";

-- AlterTable
ALTER TABLE "public"."Instrutor" DROP CONSTRAINT "Instrutor_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(36),
ADD CONSTRAINT "Instrutor_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Instrutor_id_seq";

-- AlterTable
ALTER TABLE "public"."Pagamento" DROP CONSTRAINT "Pagamento_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "alunoId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Pagamento_id_seq";

-- AlterTable
ALTER TABLE "public"."Treino" DROP CONSTRAINT "Treino_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "alunoId" SET DATA TYPE TEXT,
ALTER COLUMN "instrutorId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Treino_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Treino_id_seq";

-- CreateTable
CREATE TABLE "public"."Deposito" (
    "id" VARCHAR(36) NOT NULL,
    "alunoId" TEXT NOT NULL,
    "metodo" "public"."Metodo" NOT NULL,
    "valor" DECIMAL(9,2) NOT NULL,

    CONSTRAINT "Deposito_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Treino" ADD CONSTRAINT "Treino_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "public"."Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Treino" ADD CONSTRAINT "Treino_instrutorId_fkey" FOREIGN KEY ("instrutorId") REFERENCES "public"."Instrutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Exercicio" ADD CONSTRAINT "Exercicio_treinoId_fkey" FOREIGN KEY ("treinoId") REFERENCES "public"."Treino"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pagamento" ADD CONSTRAINT "Pagamento_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "public"."Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Deposito" ADD CONSTRAINT "Deposito_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "public"."Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
