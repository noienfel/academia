import { PrismaClient } from "@prisma/client";
import { Router } from "express"
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()
const router = Router()

router.post("/", async (req, res) => {
    const { email, senha } = req.body
    const mensapadrao = "Login incorreto"

    if (!email || !senha) {
        return res.status(422).json({ erro: "Email e senha são obrigatórios" })
    }

    try {
        const aluno = await prisma.aluno.findFirst({ where: { email } })
    
        if (!aluno) {
            return res.status(401).json({ erro: mensapadrao })
        }

        const senhaValida = bcrypt.compareSync(senha, aluno.senha)
        if (!senhaValida) {
            return res.status(401).json({ erro: mensapadrao })
        }

        const token = jwt.sign(
            { alunoLogadoId: aluno.id, alunoLogadoNome: aluno.nome },
            process.env.JWT_KEY as string,
            { expiresIn: "1h" }
        )

        res.status(200).json({ id: aluno.id, nome: aluno.nome, email: aluno.email, token })
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: "Erro interno no servidor" })
    }
})

export default router