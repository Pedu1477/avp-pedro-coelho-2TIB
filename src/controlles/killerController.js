import { killers } from "../data/killers.js";

export const listKillers = (req, res) => {
  res.json(killers);
};

export const createKiller = (req, res) => {
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
};

export const getKillerById = (req, res) => {
  const id = Number(req.params.id);
  const killer = killers.find((item) => item.id === id);

  if (!killer) {
    return res.status(404).json({ message: "Registro não encontrado." });
  }

  res.json(killer);
};

export const updateKiller = (req, res) => {
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
};

export const deleteKiller = (req, res) => {
  const id = Number(req.params.id);
  const killerIndex = killers.findIndex((item) => item.id === id);

  if (killerIndex === -1) {
    return res.status(404).json({ message: "Registro não encontrado." });
  }

  killers.splice(killerIndex, 1);
  res.json({ message: "Registro removido com sucesso." });
};
