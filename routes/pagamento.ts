import { Metodo, PrismaClient, Status } from "@prisma/client";
import { error } from "console";
import { Router } from "express";
import nodemailer from 'nodemailer'
import { z } from "zod";

const prisma = new PrismaClient

const router = Router()

const pagamentoSchema = z.object({ 
    alunoId: z.string().uuid(),
    metodo: z.nativeEnum(Metodo),
    valor: z.number().positive({ message: " Valor inválido. "}),
    status: z.nativeEnum(Status)
})

async function enviaEmail(nome: string, email: string, valor: number) {
  
  // Create a test account or replace with real credentials.
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAILTRAP_EMAIL,
      pass: process.env.MAILTRAP_SENHA,
    },
  });
  
    const info = await transporter.sendMail({
      from: 'edeciofernando@gmail.com', // sender address
      to: email, // list of receivers
      subject: "Re: Pagamento Academia Avenida", // Subject line
      text: String(valor), // plain text body
      html: `<h3>Estimado Cliente: ${nome}</h3>
             <h3>Sua inscrição em nossa academia foi confirmada! </h3>
             <h3>Muito obrigado pela preferência </h3>
             <p>Contate um de nossos instrutores para montar seu treino e começar!</p>
             <p>Academia Avenida</p>`
    });
  
    console.log("Message sent: %s", info.messageId);
  }
router.get("/", async (req,res) => { 
    try { 
        const pagamentos = await prisma.pagamento.findMany({
            include:{
                aluno: true
            }
        })
        res.status(200).json(pagamentos)
    } catch { 
        res.status(500).json({ erro: error })
    }
})


router.post("/", async(req, res) => { 
    const valida = pagamentoSchema.safeParse(req.body)

    if (!valida.success){
        res.status(400).json({ erro: valida.error })
        return
    }

    const { alunoId, metodo, valor, status } = valida.data

    const dadoAluno = await prisma.aluno.findUnique({ 
        where: { id: alunoId }
    })

    if(!dadoAluno){ 
        res.status(400).json({erro:"Erro... Código de aluno inválido"})
        return
    }

    if (Number(dadoAluno.saldo) < Number(valor)) {
        res.status(400).json({ erro: "Saldo insuficiente para o pagamento." })
        return
    }
    
    try { 
        const [ pagamento, aluno ] = await prisma.$transaction([
            prisma.pagamento.create({
               data: { alunoId, metodo, status, valor } 
            }), 
            prisma.aluno.update({
                where: { id: alunoId }, 
                data: { 
                saldo: { decrement: valor },
                matriculado: true 
            }
            })])

            await enviaEmail(dadoAluno.nome, dadoAluno.email, valor)

            res.status(201).json({pagamento, aluno})
        }catch{
            res.status(400).json({ error })
        }   
})

router.delete("/:id", async(req,res) =>{ 
    const { id } = req.params 

    try { 
        const pagamentoExcluido = await prisma.deposito.findUnique({where: { id }})

        const [ pagamento, aluno] = await prisma.$transaction([ 
            prisma.pagamento.delete({ where :  { id }}),
            prisma.aluno.update({
                where: { id: pagamentoExcluido?.alunoId},
                data: { saldo: { increment: pagamentoExcluido?.valor}}
            })])
    }catch( error ){ 
        res.status(400).json({ erro: error })
    }
})

export default router