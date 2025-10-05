import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

const exercicioSchema = z.object({
  nome: z.string().min(3, {
    message: "Cadastre o exercício corretamente",
  }),
  series: z.number().min(1),
  repeticoes: z.number().min(1),
  treinoId: z.string().uuid(),
});

router.get("/", async (req, res) => {
  try {
    const exercicios = await prisma.exercicio.findMany({
      include: {
        treino: true, // opcional, se quiser trazer junto os dados do treino
      },
    });
    res.status(200).json(exercicios);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const exercicio = await prisma.exercicio.findUnique({
      where: { id },
      include: { treino: true },
    });

    if (!exercicio) {
      return res.status(404).json({ error: "Exercício não encontrado" });
    }

    res.status(200).json(exercicio);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/", async (req, res) => {
  const valida = exercicioSchema.safeParse(req.body);

  if (!valida.success) {
    return res.status(400).json({ erro: valida.error });
  }

  try {
    const novoExercicio = await prisma.exercicio.create({
      data: valida.data,
    });
    res.status(201).json(novoExercicio);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const valida = exercicioSchema.safeParse(req.body);

  if (!valida.success) {
    return res.status(400).json({ erro: valida.error });
  }

  try {
    const exercicio = await prisma.exercicio.update({
      where: { id },
      data: valida.data,
    });
    res.status(200).json(exercicio);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.exercicio.delete({
      where: { id },
    });
    res.status(200).json({ mensagem: "Exercício deletado com sucesso" });
  } catch (error) {
    res.status(400).json(error);
  }
});

export default router;
