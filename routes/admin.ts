import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

const adminSchema = z.object({
  nome: z.string().min(5, { message: "Nome deve ter pelo menos 5 caracteres" }),
  email: z.string().email({ message: "Informe um e-mail válido" }),
  senha: z.string()
});

function validaSenha(senha: string) {
  const erros: string[] = [];

  if (senha.length < 8) {
    erros.push("Erro... senha deve ter no mínimo 8 caracteres");
  }
  if (!/[a-z]/.test(senha)) {
    erros.push("Erro... senha deve possuir letras minúsculas");
  }
  if (!/[A-Z]/.test(senha)) {
    erros.push("Erro... senha deve possuir pelo menos uma letra maiúscula");
  }
  if (!/[0-9]/.test(senha)) {
    erros.push("Erro... senha deve possuir pelo menos um número");
  }
  if (!/[^a-zA-Z0-9]/.test(senha)) {
    erros.push("Erro... senha deve possuir pelo menos um símbolo");
  }

  return erros;
}

router.get("/", async (req, res) => {
  try {
    const admins = await prisma.admin.findMany({
      select: { id: true, nome: true, email: true } // não retornar senha!
    });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar administradores" });
  }
});

router.post("/", async (req, res) => {
  const valida = adminSchema.safeParse(req.body);
  if (!valida.success) {
    return res.status(400).json({ erro: valida.error.errors });
  }

  const erros = validaSenha(valida.data.senha);
  if (erros.length > 0) {
    return res.status(400).json({ erro: erros.join("; ") });
  }

  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(valida.data.senha, salt);

  const { nome, email } = valida.data;

  try {
    const admin = await prisma.admin.create({
      data: { nome, email, senha: hash }
    });

    res.status(201).json({ id: admin.id, nome: admin.nome, email: admin.email });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar administrador" });
  }
});

export default router;
