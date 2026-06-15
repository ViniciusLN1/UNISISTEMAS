import { Router } from "express";
import { livroController } from "../controllers/livroController";
import { leitorController } from "../controllers/leitorController";
import { emprestimoController } from "../controllers/emprestimoController";

const router = Router();

router.get("/livros", livroController.listar);
router.get("/livros/:id", livroController.buscarPorId);
router.post("/livros", livroController.cadastrar);

router.get("/leitores", leitorController.listar);
router.get("/leitores/:id", leitorController.buscarPorId);
router.post("/leitores", leitorController.cadastrar);
router.patch("/leitores/:id/status", leitorController.atualizarStatus);

router.post("/emprestimos", emprestimoController.criar);
router.patch("/emprestimos/:id/devolucao", emprestimoController.devolver);

export default router;
