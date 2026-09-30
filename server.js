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
import killersRouter from "./src/routes/killers.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

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
app.use("/killers", killersRouter);

app.get("/", (req, res) => {
  res.json({
    mensagem: "Servidor Express funcionando!",
    disciplina: "Desenvolvimento de Websites",
    bimestre: "3º bimestre",
    docs: "/api-docs"
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Documentação Swagger em http://localhost:${port}/api-docs`);
});
