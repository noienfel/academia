import { PrismaClient } from "@prisma/client";
import { Router } from "express";


const prisma = new PrismaClient() 
const router = Router() 

router.get("/gerais", async ( req, res) => {
    try { 
        const alunos = await prisma.aluno.count()
        const treinos= await prisma.treino.count()
        const totalInstrutores = await prisma.admin.count();
        const matriculados = await prisma.aluno.count({ 
            where: { matriculado: true }
        }) 
        const naomatriculados = await prisma.aluno.count({
            where: { matriculado: false }
        })
        res.status(200).json({ alunos, treinos, matriculados, naomatriculados, totalInstrutores }) 
    } catch ( error ) { 
        res.status(400).json(error)
    }
})

router.get("/alunosMatriculados", async (req, res) => {
    try {
      const alunos = await prisma.aluno.findMany({
        select: {
          nome: true,
          matriculado: true,
        },
        orderBy: {
          nome: "asc",
        }
      })
  
      res.status(200).json(alunos);
    } catch (error) {
      res.status(400).json({ erro: error });
    }
  })

  export default router
    