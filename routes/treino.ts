import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { z } from "zod"; 

const prisma = new PrismaClient();
const router = Router();

const treinoSchema = z.object({
  nome: z.string().min(3, { message: "Pelo menos 3 caracteres" }),
  descricao: z.string().nullable().optional(),
  alunoId: z.number(),
  instrutorId: z.number()
});

// GET todos os treinos
router.get("/", async (req, res) => {
  try {
    const treinos = await prisma.treino.findMany({
      include: {
        aluno: { select: { id: true, nome: true, email: true } },
        instrutor: { select: { id: true, nome: true, email: true } },
        exercicios: true
      }
    });

    res.status(200).json(treinos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar treinos" });
  }
});

router.post("/", async (req, res) => {
  const valida = treinoSchema.safeParse(req.body);

  if (!valida.success) {
    return res.status(400).json({ erro: valida.error.errors });
  }

  const { nome, descricao, alunoId, instrutorId } = valida.data;

  try {
    const treino = await prisma.treino.create({
      data: { nome, descricao, alunoId, instrutorId }
    });

    res.status(201).json(treino);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar treino" });
  }
});

router.get("/:alunoId", async (req, res) => {
  const alunoId = Number(req.params.alunoId);

  try {
    const treinos = await prisma.treino.findMany({
      where: { alunoId },
      include: {
        instrutor: { select: { id: true, nome: true, email: true } },
        exercicios: true
      }
    });

    res.status(200).json(treinos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar treinos do aluno" });
  }
});

export default router;
