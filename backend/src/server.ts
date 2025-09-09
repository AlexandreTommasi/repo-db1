import 'module-alias/register';
import http from 'http';
import app from './app';
import { config } from '@/config';
import { logger } from '@/utils/logger';

const server = http.createServer(app);

const startServer = () => {
  server.listen(config.port, () => {
    logger.info(`Servidor rodando em http://localhost:${config.port} no modo ${config.nodeEnv}`);
  });
};

const gracefulShutdown = (signal: string) => {
  process.on(signal, () => {
    logger.info(`${signal} recebido, desligando o servidor...`);
    server.close(() => {
      logger.info('Servidor desligado.');
      // Aqui você pode fechar conexões com o banco de dados, se houver.
      process.exit(0);
    });
  });
};

startServer();

gracefulShutdown('SIGINT');
gracefulShutdown('SIGTERM');
