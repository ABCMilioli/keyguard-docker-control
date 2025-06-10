import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';
import { ChaveAPI } from '../models/types.js';

export class APIController {
  async validarERegistrar(req: Request, res: Response) {
    try {
      if (!req.detalhesChaveAPI) {
        return res.status(400).json({ erro: 'Detalhes da chave API não fornecidos' });
      }

      const chaveAPI = req.detalhesChaveAPI;

      // Registra ou atualiza o status da chave
      await prisma.chaveAPI.upsert({
        where: { chave: chaveAPI.chave },
        update: {
          ultimoHeartbeat: new Date(),
          ativa: true
        },
        create: {
          chave: chaveAPI.chave,
          nome: chaveAPI.nome,
          descricao: chaveAPI.descricao,
          clienteId: chaveAPI.clienteId!,
          ultimoHeartbeat: new Date(),
          ativa: true
        }
      });

      res.json({ mensagem: 'Chave API validada e registrada com sucesso' });
    } catch (erro) {
      console.error('Erro ao validar e registrar chave API:', erro);
      res.status(500).json({ erro: 'Erro ao processar a requisição' });
    }
  }

  async atualizarStatus(req: Request, res: Response) {
    try {
      if (!req.detalhesChaveAPI) {
        return res.status(400).json({ erro: 'Detalhes da chave API não fornecidos' });
      }

      const chaveAPI = req.detalhesChaveAPI;

      // Atualiza o timestamp do último heartbeat
      await prisma.chaveAPI.update({
        where: { chave: chaveAPI.chave },
        data: {
          ultimoHeartbeat: new Date()
        }
      });

      res.json({ mensagem: 'Status da chave API atualizado com sucesso' });
    } catch (erro) {
      console.error('Erro ao atualizar status da chave API:', erro);
      res.status(500).json({ erro: 'Erro ao processar a requisição' });
    }
  }

  async desativar(req: Request, res: Response) {
    try {
      if (!req.detalhesChaveAPI) {
        return res.status(400).json({ erro: 'Detalhes da chave API não fornecidos' });
      }

      const chaveAPI = req.detalhesChaveAPI;

      // Desativa a chave API
      await prisma.chaveAPI.update({
        where: { chave: chaveAPI.chave },
        data: {
          ativa: false
        }
      });

      res.json({ mensagem: 'Chave API desativada com sucesso' });
    } catch (erro) {
      console.error('Erro ao desativar chave API:', erro);
      res.status(500).json({ erro: 'Erro ao processar a requisição' });
    }
  }

  async validarERegistrarInstalacao(req: Request, res: Response) {
    try {
      if (!req.detalhesChaveAPI) {
        return res.status(400).json({ erro: 'Detalhes da chave API não fornecidos' });
      }

      const { dispositivoId, infoDispositivo } = req.body;
      const enderecoIP = req.ip || 'unknown';

      // Valida os dados recebidos
      if (!dispositivoId || !infoDispositivo) {
        return res.status(400).json({ erro: 'Dados da instalação incompletos' });
      }

      // Busca a instalação existente
      const instalacaoExistente = await prisma.instalacao.findUnique({
        where: {
          chaveApiId_dispositivoId: {
            chaveApiId: req.detalhesChaveAPI.id!,
            dispositivoId
          }
        }
      });

      if (instalacaoExistente) {
        // Atualiza a instalação existente
        await prisma.instalacao.update({
          where: {
            id: instalacaoExistente.id
          },
          data: {
            infoDispositivo,
            enderecoIP,
            ultimoHeartbeat: new Date(),
            ativa: true
          }
        });
      } else {
        // Cria uma nova instalação
        await prisma.instalacao.create({
          data: {
            dispositivoId,
            chaveApiId: req.detalhesChaveAPI.id!,
            clienteId: req.detalhesChaveAPI.clienteId!,
            enderecoIP,
            infoDispositivo,
            ultimoHeartbeat: new Date(),
            ativa: true
          }
        });
      }

      res.json({ mensagem: 'Instalação registrada com sucesso' });
    } catch (erro) {
      console.error('Erro ao registrar instalação:', erro);
      res.status(500).json({ erro: 'Erro ao processar a requisição' });
    }
  }

  async atualizarStatusInstalacao(req: Request, res: Response) {
    try {
      if (!req.detalhesChaveAPI) {
        return res.status(400).json({ erro: 'Detalhes da chave API não fornecidos' });
      }

      const { dispositivoId } = req.body;

      if (!dispositivoId) {
        return res.status(400).json({ erro: 'ID do dispositivo não fornecido' });
      }

      // Busca a instalação
      const instalacao = await prisma.instalacao.findUnique({
        where: {
          chaveApiId_dispositivoId: {
            chaveApiId: req.detalhesChaveAPI.id!,
            dispositivoId
          }
        }
      });

      if (!instalacao) {
        return res.status(404).json({ erro: 'Instalação não encontrada' });
      }

      // Atualiza o status da instalação
      await prisma.instalacao.update({
        where: {
          id: instalacao.id
        },
        data: {
          ultimoHeartbeat: new Date()
        }
      });

      res.json({ mensagem: 'Status da instalação atualizado com sucesso' });
    } catch (erro) {
      console.error('Erro ao atualizar status da instalação:', erro);
      res.status(500).json({ erro: 'Erro ao processar a requisição' });
    }
  }

  async desativarInstalacao(req: Request, res: Response) {
    try {
      if (!req.detalhesChaveAPI) {
        return res.status(400).json({ erro: 'Detalhes da chave API não fornecidos' });
      }

      const { dispositivoId } = req.body;

      if (!dispositivoId) {
        return res.status(400).json({ erro: 'ID do dispositivo não fornecido' });
      }

      // Busca a instalação
      const instalacao = await prisma.instalacao.findUnique({
        where: {
          chaveApiId_dispositivoId: {
            chaveApiId: req.detalhesChaveAPI.id!,
            dispositivoId
          }
        }
      });

      if (!instalacao) {
        return res.status(404).json({ erro: 'Instalação não encontrada' });
      }

      // Desativa a instalação
      await prisma.instalacao.update({
        where: {
          id: instalacao.id
        },
        data: {
          ativa: false
        }
      });

      res.json({ mensagem: 'Instalação desativada com sucesso' });
    } catch (erro) {
      console.error('Erro ao desativar instalação:', erro);
      res.status(500).json({ erro: 'Erro ao processar a requisição' });
    }
  }
} 