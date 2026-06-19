import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET ?? "ceap-dev-secret";
const JWT_EXPIRES = "8h";

export const authController = {
  async login(req: Request, res: Response) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: "Email e senha são obrigatórios." });
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, papel: usuario.papel },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    return res.json({ token });
  },
};
