import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PapelUsuario } from "@prisma/client";
import { prisma } from "../lib/prisma";

const SALT_ROUNDS = 10;

export const usuarioController = {
  async cadastrar(req: Request, res: Response) {
    const { nome, email, senha, papel } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: "Nome, email e senha são obrigatórios." });
    }

    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        papel: papel ?? PapelUsuario.OPERADOR,
      },
      select: { id: true, nome: true, email: true, papel: true, criadoEm: true },
    });

    return res.status(201).json(usuario);
  },
};
