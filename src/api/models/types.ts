export interface ChaveAPI {
  id?: string;
  chave: string;
  nome: string;
  descricao: string;
  clienteId?: string;
  limiteInstalacoes?: number;
  instalacoesAtuais?: number;
  ativa?: boolean;
  ultimoHeartbeat?: Date;
  dataCriacao?: Date;
}

export interface Instalacao {
  id?: string;
  dispositivoId: string;
  chaveApiId?: string;
  clienteId?: string;
  enderecoIP: string;
  infoDispositivo: {
    sistemaOperacional: string;
    versao: string;
    arquitetura: string;
    [key: string]: any;
  };
  ativa?: boolean;
  ultimoHeartbeat?: Date;
  dataCriacao?: Date;
}

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  empresa?: string;
  telefone?: string;
  status: 'ativo' | 'suspenso' | 'bloqueado';
  dataCriacao: Date;
} 