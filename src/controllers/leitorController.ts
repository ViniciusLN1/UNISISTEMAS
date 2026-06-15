import { Request, Response } from "express";
import { StatusLeitor } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const leitorController = {
  async listar(_req: Request, res: Response) {
    const leitores = await prisma.leitor.findMany();
    return res.json(leitores);
  },

  async buscarPorId(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ erro: "ID inválido." });
    }

    const leitor = await prisma.leitor.findUnique({ where: { id } });
    if (!leitor) {
      return res.status(404).json({ erro: "Leitor não encontrado." });
    }

    return res.json(leitor);
  },

  async cadastrar(req: Request, res: Response) {
    const { nome, email, telefone } = req.body;

    if (!nome) {
      return res.status(400).json({ erro: "Nome é obrigatório." });
    }

    const leitor = await prisma.leitor.create({
      data: { nome, email, telefone },
    });

    return res.status(201).json(leitor);
  },

  async atualizarStatus(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ erro: "ID inválido." });
    }

    const { status } = req.body;
    if (!Object.values(StatusLeitor).includes(status)) {
      return res.status(400).json({ erro: "Status inválido." });
    }

    const leitor = await prisma.leitor.update({
      where: { id },
      data: { status },
    });

    return res.json(leitor);
  },
};
