import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "ceap-dev-secret";

export interface UsuarioPayload {
  id: number;
  email: string;
  papel: string;
}

declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ erro: "Token não fornecido." });
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as UsuarioPayload;
    req.usuario = payload;
    return next();
  } catch {
    return res.status(401).json({ erro: "Token inválido ou expirado." });
  }
}
