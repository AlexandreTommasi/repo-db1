import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { mainRouter } from '@/api/routes';
import { errorHandler } from '@/api/middleware/error.middleware';
import { notFoundHandler } from '@/api/middleware/notFound.middleware';

const app: Application = express();

// Middlewares de segurança e utilitários
app.use(helmet());
// Configurar CORS com suporte a variável de ambiente
const corsOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

// Adicionar CORS_ORIGIN do ambiente se existir
if (process.env.CORS_ORIGIN) {
  // Se tiver múltiplas origens separadas por vírgula
  const envOrigins = process.env.CORS_ORIGIN.split(',').map(origin => origin.trim());
  corsOrigins.push(...envOrigins);
}

console.log('[CORS] Configured origins:', corsOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sem origin (Postman, curl, etc)
    if (!origin) return callback(null, true);
    
    // Verificar se a origem está na lista permitida
    if (corsOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Se for do Azure, permitir
    if (origin.includes('.azurewebsites.net')) {
      console.log('[CORS] Allowing Azure origin:', origin);
      return callback(null, true);
    }
    
    console.log('[CORS] Blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint de Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP' });
});

// Rotas da API
app.use('/api/v1', mainRouter);

// Middlewares de tratamento de erros
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
