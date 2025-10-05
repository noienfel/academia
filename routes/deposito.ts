import { Metodo, Prisma, PrismaClient } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";

const prisma = new PrismaClient()


const router = Router()

const depositoSchema = z.object({
    alunoId: z.string().uuid(),
    metodo: z.nativeEnum(Metodo),
    valor: z.number().positive({message:" Valor deve ser positivo. "})
})

router.get("/", async (req, res) => { 
    try { 
        const depositos = await prisma.deposito.findMany({
            include: {
                aluno: true
            }
        })
    res.status(200).json(depositos)
    } catch (error) { 
        res.status(500).json({ erro: error })
    }
})

router.post("/", async(req, res) => {
    const valida = depositoSchema.safeParse(req.body)

    if(!valida.success) { 
        res.status(400).json({ erro: valida.error })
        return
    }

    const { alunoId, metodo, valor } = valida.data

    const dadoAluno = await prisma.aluno.findUnique({
        where: { id: alunoId }
      })
    

    if(!dadoAluno){ 
        res.status(400).json({erro: "Erro.. Código de aluno inválido "})
        return
    }
    
    try { 
        const [ deposito, aluno ] = await prisma.$transaction([
            prisma.deposito.create({
                data: {alunoId, metodo, valor}
            }),
            prisma.aluno.update({
                where: {id: alunoId}, 
                data: { saldo: { increment: valor }}
            })])
            res.status(201).json({deposito, aluno})
        } catch ( error ) { 
            res.status(400).json({ error })
        }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params 

    try { 
        const depositoExcluido = await prisma.deposito.findUnique({where: {id}})

        const [deposito, aluno] = await prisma.$transaction([
            prisma.deposito.delete({ where: { id } }),
            prisma.aluno.update({
                where: { id: depositoExcluido?.alunoId },
                data: { saldo: { decrement: depositoExcluido?.valor } }
          })])
          res.status(200).json({ deposito,aluno })
    }   catch( error ) { 
        res.status(400).json({ erro: error})
    }
})  

    export default router 