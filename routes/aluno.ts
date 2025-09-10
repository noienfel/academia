import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import bcrypt from 'bcrypt'
import { z } from "zod";

const prisma = new PrismaClient()
const router = Router()

const alunoSchema = z.object({
    nome: z.string().min(10, {
        message: "Nome do aluno deve ter no mínimo 10 caracteres"
    }),
    email: z.string().email({message:"Informe um e-mail válido"}),
    senha: z.string(),
})

router.get("/", async (req, res) => {
    try {
        const alunos = await prisma.aluno.findMany()
        res.status(200).json(alunos)
    } catch (error) {
        res.status(400).json(error)
    }
})

function validaSenha(senha: string){
    const mensa: string[] = []

    if (senha.length < 8) {
        mensa.push("Erro... senha deve ter no mínimo 8 caracteres ")
    }

    let grandes = 0 
    let pequenas = 0 
    let numeros = 0
    let simbolos = 0

    // Conta os tipos de caracteres
    for (const letra of senha) {
        if (/[a-z]/.test(letra)) pequenas++
        else if (/[A-Z]/.test(letra)) grandes++
        else if (/[0-9]/.test(letra)) numeros++
        else simbolos++
    }

    // Verifica depois do loop
    if (pequenas === 0) mensa.push("Erro... senha deve possuir letras minúsculas")
    if (grandes === 0) mensa.push("Erro... senha deve possuir pelo menos uma letra maiúscula")
    if (numeros === 0) mensa.push("Erro... senha deve possuir pelo menos um número")
    if (simbolos === 0) mensa.push("Erro... senha deve possuir pelo menos um símbolo")

    return mensa
}

router.post("/", async (req, res) => {
    const valida = alunoSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({erro: valida.error})
        return
    }

    const erros = validaSenha(valida.data.senha)
    if (erros.length > 0) {
        res.status(400).json({ erro: erros.join("; ")})
        return
    }

    const salt  = bcrypt.genSaltSync(12)
    const hash = bcrypt.hashSync(valida.data.senha, salt)
    
    const { nome, email } = valida.data

    try {
        const aluno = await prisma.aluno.create({
            data: { nome, email, senha:hash}
        })
        res.status(201).json(aluno)
    } catch (error) { 
        res.status(400).json(error)
    }
})

export default router;