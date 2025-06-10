import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkAdminExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminExists = await prisma.user.findFirst({
      where: {
        role: 'admin'
      }
    });

    // Adiciona a informação ao objeto de resposta
    res.locals.adminExists = !!adminExists;
    next();
  } catch (error) {
    console.error('Erro ao verificar admin:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}; 