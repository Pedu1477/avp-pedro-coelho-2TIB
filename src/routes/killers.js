import express from "express";
import { authenticateToken } from "../middlewares/auth.js";
import {
  getAllKillers,
  createKiller,
  getKillerById,
  updateKiller,
  deleteKiller
} from "../controllers/killersController.js";

const router = express.Router();

/**
 * @openapi
 * /killers:
 *   get:
 *     summary: Listar todos os registros
 *     description: Retorna uma lista com todos os serial killers cadastrados para fins de estudo técnico. Rota pública.
 *     tags:
 *       - SerialKiller
 *     responses:
 *       200:
 *         description: Lista de registros recuperada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SerialKiller'
 *
 *   post:
 *     summary: Cadastrar novo registro
 *     description: Adiciona um novo perfil ao sistema. Rota protegida por Bearer Token (.env).
 *     tags:
 *       - SerialKiller
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - alcunha
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Jeffrey Dahmer"
 *               alcunha:
 *                 type: string
 *                 example: "O Canibal de Milwaukee"
 *               status:
 *                 type: string
 *                 example: "Capturado"
 *     responses:
 *       201:
 *         description: Perfil cadastrado com sucesso no sistema.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SerialKiller'
 *       400:
 *         description: Erro na requisição. Dados inválidos ou campos obrigatórios ausentes.
 *       401:
 *         description: Token de autenticação ausente ou inválido no cabeçalho.
 */
router.get("/", getAllKillers);
router.post("/", authenticateToken, createKiller);

/**
 * @openapi
 * /killers/{id}:
 *   get:
 *     summary: Buscar um registro por ID
 *     description: Retorna as informações detalhadas de um único perfil usando o ID da URL. Rota pública.
 *     tags:
 *       - SerialKiller
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do perfil que você deseja buscar.
 *     responses:
 *       200:
 *         description: Registro encontrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SerialKiller'
 *       404:
 *         description: O ID informado não corresponde a nenhum registro no sistema.
 *
 *   patch:
 *     summary: Atualizar parcialmente um registro
 *     description: Modifica apenas os campos enviados no corpo (body) da requisição. Rota protegida por Bearer Token (.env).
 *     tags:
 *       - SerialKiller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do perfil que receberá as alterações.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "Falecido"
 *     responses:
 *       200:
 *         description: Registro atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SerialKiller'
 *       400:
 *         description: Dados mal formatados ou erro na validação dos campos.
 *       401:
 *         description: Token de autenticação inválido ou não fornecido.
 *       404:
 *         description: Nenhum registro encontrado com o ID especificado para atualização.
 *
 *   delete:
 *     summary: Excluir ou desativar um registro
 *     description: Remove permanentemente ou desativa o perfil do sistema através do ID. Rota protegida por Bearer Token (.env).
 *     tags:
 *       - SerialKiller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do registro que será removido.
 *     responses:
 *       200:
 *         description: Registro removido ou arquivado com sucesso.
 *       401:
 *         description: Token de autenticação inválido ou ausente.
 *       404:
 *         description: Registro não encontrado para exclusão.
 */
router.get("/:id", getKillerById);
router.patch("/:id", authenticateToken, updateKiller);
router.delete("/:id", authenticateToken, deleteKiller);

export default router;
