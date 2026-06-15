import { Request, Response } from "express";
import { StatusEmprestimo } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const emprestimoController = {
  async criar(req: Request, res: Response) {
    const { leitorId, livroId, dataPrevista } = req.body;

    const emprestimo = await prisma.emprestimo.create({
      data: {
        leitorId: Number(leitorId),
        livroId: Number(livroId),
        dataPrevista: new Date(dataPrevista),
      },
    });

    return res.status(201).json(emprestimo);
  },

  async devolver(req: Request, res: Response) {
    const id = Number(req.params.id);

    const emprestimo = await prisma.emprestimo.update({
      where: { id },
      data: {
        status: StatusEmprestimo.DEVOLVIDO,
        dataDevolucao: new Date(),
      },
    });

    return res.json(emprestimo);
  },
};
