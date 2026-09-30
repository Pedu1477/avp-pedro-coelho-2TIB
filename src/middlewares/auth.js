export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Token de autenticação ausente ou inválido."
    });
  }

  const token = authHeader.split(" ")[1];
  const bearerToken = process.env.BEARER_TOKEN || "meu-token-secreto";

  if (token !== bearerToken) {
    return res.status(401).json({
      message: "Token de autenticação inválido."
    });
  }

  next();
};
