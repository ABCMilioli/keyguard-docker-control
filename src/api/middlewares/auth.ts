import { Request, Response, NextFunction, RequestHandler } from 'express';
import { prisma } from '../../lib/prisma.js';
import { ChaveAPI } from '../models/types.js';

export const validarChaveAPI: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const chaveAPI = req.headers['x-api-key'];

  if (!chaveAPI || typeof chaveAPI !== 'string') {
    res.status(401).json({ erro: 'Chave API não fornecida' });
    return;
  }

  try {
    const chaveEncontrada = await prisma.chaveAPI.findUnique({
      where: { chave: chaveAPI },
      include: {
        cliente: true
      }
    });

    if (!chaveEncontrada) {
      res.status(401).json({ erro: 'Chave API inválida' });
      return;
    }

    if (!chaveEncontrada.ativa) {
      res.status(403).json({ erro: 'Chave API desativada' });
      return;
    }

    // Verifica se excedeu o limite de instalações
    if (chaveEncontrada.instalacoesAtuais >= chaveEncontrada.limiteInstalacoes) {
      res.status(403).json({ erro: 'Limite de instalações excedido' });
      return;
    }

    // Adiciona os detalhes da chave API ao request
    req.detalhesChaveAPI = {
      id: chaveEncontrada.id,
      chave: chaveEncontrada.chave,
      nome: chaveEncontrada.nome,
      descricao: chaveEncontrada.descricao,
      clienteId: chaveEncontrada.clienteId,
      limiteInstalacoes: chaveEncontrada.limiteInstalacoes,
      instalacoesAtuais: chaveEncontrada.instalacoesAtuais,
      ativa: chaveEncontrada.ativa,
      ultimoHeartbeat: chaveEncontrada.ultimoHeartbeat || undefined,
      dataCriacao: chaveEncontrada.dataCriacao
    };

    next();
  } catch (erro) {
    console.error('Erro ao validar chave API:', erro);
    res.status(500).json({ erro: 'Erro ao validar chave API' });
    return;
  }
}; 