import 'dotenv/config';
import express, { Request, Response } from "express";
import cors from "cors";

import { AddressInfo } from "net";
import connection from "./connection";
import authRoutes from './routes/auth.routes';
import usuarioTipoRoutes from './routes/usuarioTipo.routes';
import professorRoutes from './routes/professor.routes';
import alunoRoutes from './routes/aluno.routes';
import religiaoRoutes from './routes/religiao.routes';
import certidaoRoutes from './routes/certidao.routes';
import parentescoRoutes from './routes/parentesco.routes';
import responsavelRoutes from './routes/responsavel.routes';
import dadosSaudeRoutes from './routes/dadosSaude.routes';
import diagnosticoRoutes from './routes/diagnostico.routes';
import anoLetivoRoutes from './routes/anoLetivo.routes';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/auth', authRoutes);
app.use('/usuario-tipo', usuarioTipoRoutes);
app.use('/professor', professorRoutes);
app.use('/aluno', alunoRoutes);
app.use('/religiao', religiaoRoutes);
app.use('/certidao', certidaoRoutes);
app.use('/parentesco', parentescoRoutes);
app.use('/responsavel', responsavelRoutes);
app.use('/dados-saude', dadosSaudeRoutes);
app.use('/diagnostico', diagnosticoRoutes);
app.use('/ano-letivo', anoLetivoRoutes);

const server = app.listen(process.env.PORT || 3003, () => {
  if (server) {
    const address = server.address();
    if (address && typeof address !== 'string') {
      require('./utils/logger').logSuccess(`🚀 Servidor rodando em http://localhost:${address.port}`, 'server');
    } else {
      require('./utils/logger').logSuccess(`🚀 Servidor rodando na porta ${process.env.PORT || 3003}`, 'server');
    }
  } else {
    require('./utils/logger').logError('❌ Falha ao iniciar o servidor', 'server');
  }
});
