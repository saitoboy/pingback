import 'dotenv/config';
import express, { Request, Response } from "express";
import cors from "cors";

import { AddressInfo } from "net";
import connection from "./connection";
import authRoutes from './routes/auth.routes';
import usuarioTipoRoutes from './routes/usuarioTipo.routes';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/auth', authRoutes);
app.use('/usuario-tipo', usuarioTipoRoutes);

const server = app.listen(process.env.PORT || 3003, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    require('./utils/logger').logSuccess(`Servidor rodando em http://localhost:${address.port}`, 'server');
  } else {
    require('./utils/logger').logError('Falha ao iniciar o servidor', 'server');
  }
});
