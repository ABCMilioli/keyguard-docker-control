import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { validarChaveAPI } from './api/middlewares/auth.js';
import { APIController } from './api/controllers/apiController.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { userController } from './controllers/userController.js';
import { checkAdminExists } from './middleware/adminCheck.js';

// Carrega variáveis de ambiente
dotenv.config();

// Configura __dirname no ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const apiController = new APIController();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
const apiRouter = express.Router();

// Endpoint para verificar status do admin
apiRouter.get('/admin/status', checkAdminExists, async (req: Request, res: Response) => {
  res.json({ adminExists: res.locals.adminExists });
});

// Rotas públicas (sem autenticação)
apiRouter.post('/users/register', checkAdminExists, async (req: Request, res: Response) => {
  // Se já existe um admin, não permite registro
  if (res.locals.adminExists) {
    res.status(403).json({ error: 'Registro não permitido. Sistema já possui um administrador.' });
    return;
  }
  // Força o primeiro usuário a ser admin
  req.body.role = 'admin';
  await userController.register(req, res);
});

apiRouter.post('/users/login', (req: Request, res: Response) => {
  userController.login(req, res);
});

// Middleware de autenticação para todas as rotas protegidas
apiRouter.use(validarChaveAPI);

// Endpoints protegidos
apiRouter.post('/validar', (req: Request, res: Response) => {
  apiController.validarERegistrar(req, res);
});

apiRouter.post('/heartbeat', (req: Request, res: Response) => {
  apiController.atualizarStatus(req, res);
});

apiRouter.post('/desativar', (req: Request, res: Response) => {
  apiController.desativar(req, res);
});

// Registra as rotas da API
app.use('/api/v1', apiRouter);

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, 'public')));

// Rota para servir o frontend
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Rota para servir o frontend em rotas não encontradas
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api')) {
    next();
  } else {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  }
});

// Tratamento de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 