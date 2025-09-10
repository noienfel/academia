import { PrismaClient } from "@prisma/client/extension";
import { Router } from "express";
import { z } from "zod";

const prisma = new PrismaClient()
const router = Router()

const exercicioSchema = z.object({
    nome: z.string().min(3, {
        message: "Cadastre o exercício corretamente"
    }),
    series: z.number().min(1),
    repeticoes: z.number().min(1),
    treinoId: z.number()
})

router.get("/", async (req, res) =>{
    try {
        const exercicios = await prisma.exercicios.findmany()
        res.status(200).json(exercicios)
    } catch (error){
        res.status(400).json(error)
    }  
})