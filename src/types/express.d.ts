import { ChaveAPI } from '../api/models/types';

declare module 'express-serve-static-core' {
  interface Request {
    detalhesChaveAPI?: ChaveAPI;
  }
}

export {}; 