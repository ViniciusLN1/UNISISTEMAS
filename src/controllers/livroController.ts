import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const livroController = {
  async listar(_req: Request, res: Response) {
    const livros = await prisma.livro.findMany();
    return res.json(livros);
  },

  async buscarPorId(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ erro: "ID inválido." });
    }

    const livro = await prisma.livro.findUnique({ where: { id } });
    if (!livro) {
      return res.status(404).json({ erro: "Livro não encontrado." });
    }

    return res.json(livro);
  },

  async cadastrar(req: Request, res: Response) {
    const { titulo, autor, isbn, editora, anoPublicacao, quantidade } = req.body;

    if (!titulo || !autor) {
      return res.status(400).json({ erro: "Título e autor são obrigatórios." });
    }

    const qtd = quantidade ?? 1;

    const livro = await prisma.livro.create({
      data: {
        titulo,
        autor,
        isbn,
        editora,
        anoPublicacao,
        quantidade: qtd,
        disponiveis: qtd,
      },
    });

    return res.status(201).json(livro);
  },
};
l