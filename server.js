/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: "Insira o token configurado no arquivo .env para acessar as rotas protegidas da API."
 *
 *   schemas:
 *     SerialKiller:
 *       type: object
 *       required:
 *         - nome
 *         - alcunha
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único gerado automaticamente pelo sistema.
 *           example: 1
 *         nome:
 *           type: string
 *           description: Nome real ou de batismo do indivíduo.
 *           example: "Ted Bundy"
 *         alcunha:
 *           type: string
 *           description: O apelido ou codinome pelo qual ficou conhecido na mídia.
 *           example: "O Assassino de Campus"
 *         status:
 *           type: string
 *           description: "Situação atual do registro no sistema (ex: Capturado, Falecido, Ativo)."
 *           example: "Falecido"
 */

import express from "express";
import dotenv from "dotenv";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const bearerToken = process.env.BEARER_TOKEN || "meu-token-secreto";

app.use(express.json());

const killers = [
  { id: 1, nome: "Ted Bundy", alcunha: "O Assassino de Campus", status: "Falecido" },
  { id: 2, nome: "Jeffrey Dahmer", alcunha: "O Canibal de Milwaukee", status: "Capturado" },
  { id: 3, nome: "H. H. Holmes", alcunha: "O Dr. Holmes", status: "Executado" }
];

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Token de autenticação ausente ou inválido."
    });
  }

  const token = authHeader.split(" ")[1];

  if (token !== bearerToken) {
    return res.status(401).json({
      message: "Token de autenticação inválido."
    });
  }

  next();
};

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Serial Killers",
      version: "1.0.0",
      description: "Documentação da API para cadastramento, consulta e atualização de perfis de serial killers."
    },
    servers: [{ url: `http://localhost:${port}` }]
  },
  apis: ["./server.js"]
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({
    mensagem: "Servidor Express funcionando!",
    disciplina: "Desenvolvimento de Websites",
    bimestre: "3º bimestre",
    docs: "/api-docs"
  });
});

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
app.get("/killers", (req, res) => {
  res.json(killers);
});

app.post("/killers", authenticateToken, (req, res) => {
  const { nome, alcunha, status } = req.body;

  if (!nome || !alcunha) {
    return res.status(400).json({
      message: "Os campos nome e alcunha são obrigatórios."
    });
  }

  const novoKiller = {
    id: killers.length ? killers[killers.length - 1].id + 1 : 1,
    nome,
    alcunha,
    status: status || "Ativo"
  };

  killers.push(novoKiller);

  res.status(201).json(novoKiller);
});

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
app.get("/killers/:id", (req, res) => {
  const id = Number(req.params.id);
  const killer = killers.find((item) => item.id === id);

  if (!killer) {
    return res.status(404).json({ message: "Registro não encontrado." });
  }

  res.json(killer);
});

app.patch("/killers/:id", authenticateToken, (req, res) => {
  const id = Number(req.params.id);
  const killer = killers.find((item) => item.id === id);

  if (!killer) {
    return res.status(404).json({ message: "Registro não encontrado." });
  }

  const { nome, alcunha, status } = req.body;

  if (nome) killer.nome = nome;
  if (alcunha) killer.alcunha = alcunha;
  if (status) killer.status = status;

  res.json(killer);
});

app.delete("/killers/:id", authenticateToken, (req, res) => {
  const id = Number(req.params.id);
  const killerIndex = killers.findIndex((item) => item.id === id);

  if (killerIndex === -1) {
    return res.status(404).json({ message: "Registro não encontrado." });
  }

  killers.splice(killerIndex, 1);

  res.json({ message: "Registro removido com sucesso." });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Documentação Swagger em http://localhost:${port}/api-docs`);
});
