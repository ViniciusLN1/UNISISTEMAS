import { Router } from "express";
import { livroController } from "../controllers/livroController";
import { leitorController } from "../controllers/leitorController";
import { emprestimoController } from "../controllers/emprestimoController";
import { authController } from "../controllers/authController";
import { usuarioController } from "../controllers/usuarioController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/auth/login", authController.login);
router.post("/usuarios", usuarioController.cadastrar);

router.get("/livros", livroController.listar);
router.get("/livros/:id", livroController.buscarPorId);
router.post("/livros", authMiddleware, livroController.cadastrar);

router.get("/leitores", leitorController.listar);
router.get("/leitores/:id", leitorController.buscarPorId);
router.post("/leitores", authMiddleware, leitorController.cadastrar);
router.patch("/leitores/:id/status", authMiddleware, leitorController.atualizarStatus);

router.post("/emprestimos", authMiddleware, emprestimoController.criar);
router.patch("/emprestimos/:id/devolucao", authMiddleware, emprestimoController.devolver);

export default router;
