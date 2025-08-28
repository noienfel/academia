import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

interface TokenPayload {
  usuarioId: string
}

// 🟢 Estende a interface Request globalmente
declare global {
  namespace Express {
    interface Request {
      usuarioId?: string
    }
  }
}

export function autenticar(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ erro: "Token ausente." })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY as string) as TokenPayload

    // ⚠️ Verifica se a estrutura esperada está no token
    if (!decoded.usuarioId) {
      return res.status(401).json({ erro: "Token inválido." })
    }

    // adiciona o ID do usuário à requisição
    req.usuarioId = decoded.usuarioId
    next()
  } catch (err) {
    return res.status(401).json({ erro: "Token inválido ou expirado." })
  }
}
