import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const userController = {
  async register(req: Request, res: Response) {
    try {
      const { nome, email, senha } = req.body;

      // Validações básicas
      if (!nome || !email || !senha) {
        return res.status(400).json({ 
          error: 'Todos os campos são obrigatórios' 
        });
      }

      if (senha.length < 6) {
        return res.status(400).json({ 
          error: 'A senha deve ter pelo menos 6 caracteres' 
        });
      }

      // Verifica se o email já está em uso
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({ 
          error: 'Este email já está em uso' 
        });
      }

      // Criptografa a senha
      const hashedPassword = await bcrypt.hash(senha, 10);

      // Cria o usuário
      const user = await prisma.user.create({
        data: {
          id: uuidv4(),
          nome,
          email,
          senha: hashedPassword,
          role: 'admin', // Primeiro usuário é admin
          dataAtualizacao: new Date()
        }
      });

      // Remove a senha do objeto de retorno
      const { senha: _, ...userWithoutPassword } = user;

      return res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: userWithoutPassword
      });

    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return res.status(500).json({ 
        error: 'Erro interno do servidor' 
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      // Validações básicas
      if (!email || !senha) {
        return res.status(400).json({ 
          error: 'Email e senha são obrigatórios' 
        });
      }

      // Busca o usuário pelo email
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({ 
          error: 'Email ou senha incorretos' 
        });
      }

      // Verifica se a senha está correta
      const passwordMatch = await bcrypt.compare(senha, user.senha);

      if (!passwordMatch) {
        return res.status(401).json({ 
          error: 'Email ou senha incorretos' 
        });
      }

      // Remove a senha do objeto de retorno
      const { senha: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        message: 'Login realizado com sucesso',
        user: userWithoutPassword
      });

    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return res.status(500).json({ 
        error: 'Erro interno do servidor' 
      });
    }
  },

  async updateProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, email, senhaAtual, novaSenha } = req.body;

      // Busca o usuário
      const user = await prisma.user.findUnique({
        where: { id }
      });

      if (!user) {
        return res.status(404).json({ 
          error: 'Usuário não encontrado' 
        });
      }

      // Se forneceu senha atual, verifica se está correta
      if (senhaAtual) {
        const passwordMatch = await bcrypt.compare(senhaAtual, user.senha);
        if (!passwordMatch) {
          return res.status(401).json({ 
            error: 'Senha atual incorreta' 
          });
        }
      }

      // Prepara os dados para atualização
      const updateData: any = {
        nome,
        email,
        dataAtualizacao: new Date()
      };

      // Se forneceu nova senha, criptografa
      if (novaSenha) {
        if (novaSenha.length < 6) {
          return res.status(400).json({ 
            error: 'A nova senha deve ter pelo menos 6 caracteres' 
          });
        }
        updateData.senha = await bcrypt.hash(novaSenha, 10);
      }

      // Atualiza o usuário
      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData
      });

      // Remove a senha do objeto de retorno
      const { senha: _, ...userWithoutPassword } = updatedUser;

      return res.status(200).json({
        message: 'Perfil atualizado com sucesso',
        user: userWithoutPassword
      });

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return res.status(500).json({ 
        error: 'Erro interno do servidor' 
      });
    }
  }
}; 