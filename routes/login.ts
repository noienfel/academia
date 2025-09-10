import { PrismaClient } from "@prisma/client";
import { Router } from "express"
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()
const router = Router()

router.post("/", async (req, res) =>{
    const { email, senha } = req.body

    const mensapadrao = "Login incorreto"

    if ( !email || !senha){
        res.status(400).json({erro: mensapadrao})
        return
    }

    try {
        const aluno = await prisma.aluno.findFirst({
            where: { email }
        })
    
    if (aluno == null) {
        res.status(400).json({erro:mensapadrao})
        return
    }
    if(bcrypt.compareSync(senha, aluno.senha)){
        const token = jwt.sign({
            alunoLogadoId: aluno.id,
            alunoLogadoNome: aluno.nome
        },
        process.env.JWT_KEY as string,
        {expiresIn: "1h"}
    )

    res.status(200).json({
        id: aluno.id,
        nome: aluno.nome,
        email: aluno.email,
        token 
    })
    } else {
        res.status(400).json({erro: mensapadrao})
    }
    } catch (error) {
        res.status(400).json(error)
    }
})
export default router