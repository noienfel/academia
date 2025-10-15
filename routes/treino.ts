import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { z } from "zod"; 

import { verificaToken } from "../middlewares/verificaToken";


const prisma = new PrismaClient();
const router = Router();

const treinoSchema = z.object({
  nome: z.string().min(3, { message: "Pelo menos 3 caracteres" }),
  descricao: z.string().nullable().optional(),
  alunoId: z.string().uuid(),
  destaque: z.boolean().optional(),
  adminId: z.string().uuid()
});


// GET todos os treinos
router.get("/", async (req, res) => {
  try {
    const treinos = await prisma.treino.findMany({
      where: {
        ativo: true,
      },

      include: {
        aluno: { select: { id: true, nome: true, email: true } },
        admin: { select: { id: true, nome: true, email: true } },
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

  const { nome, descricao, alunoId, destaque, adminId } = valida.data;

  try {
    const treino = await prisma.treino.create({
      data: { nome, descricao, alunoId, destaque,adminId }
    });

    res.status(201).json(treino);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar treino" });
  }
});

router.get("/destaques", async (req,res) => {
  try { 
    const treinos = await prisma.treino.findMany({
      where: { 
        ativo: true, 
        destaque: true
      }, 
      include: {
        admin: true,
        aluno: true 
      },
      orderBy: { 
        id: 'desc'
      }
    })
    res.status(200).json(treinos)
  } catch { 
    res.status(500).json({ erro: Error })
  }
})

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const treinos = await prisma.treino.findMany({
      where: { id },
      include: {
        admin: { select: { nome: true, email: true } },
        exercicios: true
      }
    });

    res.status(200).json(treinos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar treinos do aluno" });
  }
});


router.patch("/destacar/:id", verificaToken, async (req, res) => {  
  const { id } = req.params
  
  try {
    const treinoDestacar = await prisma.treino.findUnique({
      where: { id },
      select: { destaque: true }
    })

    const treino = await prisma.treino.update({
      where: { id },
      data: { destaque: !treinoDestacar?.destaque }
    })
    res.status(200).json()
  } catch (error) {
    res.status(400).json(error) 
  } 
})

router.delete("/:id", verificaToken, async (req, res) => {
  const { id } = req.params

  try {

    const treino = await prisma.treino.update({
      where: { id },
      data: { ativo: false }
    })

    const adminId = req.userLogadoId as string
    const adminNome = req.userLogadoNome as string

    const descricao = `Exclusão de: ${treino.nome}`
    const complemento = `Admin: ${adminNome}`

    const log = await prisma.log.create({
      data: { descricao, complemento, adminId }
    })    

    res.status(200).json(treino)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})


export default router;
