import { Request, Response } from "express";
import { StatusEmprestimo } from "@prisma/client";
import { prisma } from "../lib/prisma";

const PRAZO_DIAS = 14;

export const emprestimoController = {
  async criar(req: Request, res: Response) {
    const { leitorId, livroId } = req.body;
    const livroIdNum = Number(livroId);
    const leitorIdNum = Number(leitorId);

    const livro = await prisma.livro.findUnique({ where: { id: livroIdNum } });
    if (!livro) {
      return res.status(404).json({ erro: "Livro não encontrado." });
    }

    if (livro.disponiveis <= 0) {
      return res.status(400).json({ erro: "Livro indisponível em estoque." });
    }

    const dataPrevista = new Date();
    dataPrevista.setDate(dataPrevista.getDate() + PRAZO_DIAS);

    const [emprestimo] = await prisma.$transaction([
      prisma.emprestimo.create({
        data: {
          leitorId: leitorIdNum,
          livroId: livroIdNum,
          dataPrevista,
        },
      }),
      prisma.livro.update({
        where: { id: livroIdNum },
        data: { disponiveis: { decrement: 1 } },
      }),
    ]);

    return res.status(201).json(emprestimo);
  },

  async devolver(req: Request, res: Response) {
    const id = Number(req.params.id);

    const emprestimo = await prisma.emprestimo.findUnique({ where: { id } });
    if (!emprestimo) {
      return res.status(404).json({ erro: "Empréstimo não encontrado." });
    }

    if (emprestimo.status === StatusEmprestimo.DEVOLVIDO) {
      return res.status(400).json({ erro: "Empréstimo já devolvido." });
    }

    const [emprestimoAtualizado] = await prisma.$transaction([
      prisma.emprestimo.update({
        where: { id },
        data: {
          status: StatusEmprestimo.DEVOLVIDO,
          dataDevolucao: new Date(),
        },
      }),
      prisma.livro.update({
        where: { id: emprestimo.livroId },
        data: { disponiveis: { increment: 1 } },
      }),
    ]);

    return res.json(emprestimoAtualizado);
  },
};
