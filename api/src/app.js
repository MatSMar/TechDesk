import express from 'express';
import cors from 'cors';
import chamadosRoutes from './routes/chamados.routes.js';
import authRoutes from './routes/auth.routes.js';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.js';

//cria e configura a instancia do Express
const app = express();

//habilita cors e le o corpo das requisições em json
app.use(cors());
app.use(express.json());

//rota de verificação do serviço
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', servico: 'techdesk-api' });
});

//registra as rotas do recurso principal de chamados
app.use('/chamados', chamadosRoutes);
app.use('/api/chamados', chamadosRoutes);
app.use('/auth', authRoutes);

//trata rotas inexistentes e erros da aplicação
app.use(notFoundHandler);
app.use(errorHandler);

export default app;