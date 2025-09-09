import dotenv from 'dotenv';

dotenv.config();

export const serverConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  // A configuração do jogo foi movida para o ConfigService
  // para permitir gerenciamento dinâmico.
};
