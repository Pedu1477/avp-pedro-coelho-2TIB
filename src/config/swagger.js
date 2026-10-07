import "dotenv/config";
import swaggerJsdoc from "swagger-jsdoc";

const port = process.env.PORT || 3000;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Serial Killers",
      version: "1.0.0",
      description: "Documentação da API para cadastramento, consulta e atualização de perfis de serial killers."
    },
    servers: [{ url: `http://localhost:${port}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Insira o token configurado no arquivo .env para acessar as rotas protegidas da API."
        }
      },
      schemas: {
        SerialKiller: {
          type: "object",
          required: ["nome", "alcunha"],
          properties: {
            id: {
              type: "integer",
              description: "ID único gerado automaticamente pelo sistema.",
              example: 1
            },
            nome: {
              type: "string",
              description: "Nome real ou de batismo do indivíduo.",
              example: "Ted Bundy"
            },
            alcunha: {
              type: "string",
              description: "O apelido ou codinome pelo qual ficou conhecido na mídia.",
              example: "O Assassino de Campus"
            },
            status: {
              type: "string",
              description: "Situação atual do registro no sistema (ex: Capturado, Falecido, Ativo).",
              example: "Falecido"
            }
          }
        }
      }
    }
  },
  apis: ["./src/rutes/*.js"]
};

export default swaggerJsdoc(swaggerOptions);
