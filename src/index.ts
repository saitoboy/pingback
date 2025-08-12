import 'dotenv/config';
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import { AddressInfo } from "net";
import connection from "./connection";
import { logSuccess, logError, logInfo, logDebug } from './utils/logger';
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
import periodoLetivoRoutes from './routes/periodoLetivo.routes';
import serieRoutes from './routes/serie.routes';
import turmaRoutes from './routes/turma.routes';
import matriculaAlunoRoutes from './routes/matriculaAluno.routes';
import fichaCadastroRoutes from './routes/fichaCadastro.routes';
import disciplinaRoutes from './routes/disciplina.routes';
import turmaDisciplinaProfessorRoutes from './routes/turmaDisciplinaProfessor.routes';
import aulaRoutes from './routes/aula.routes';
import conteudoAulaRoutes from './routes/conteudoAula.routes';
import atividadeRoutes from './routes/atividade.routes';
import notaRoutes from './routes/nota.routes';
import mediaDisciplinaBimestreRoutes from './routes/mediaDisciplinaBimestre.routes';
import frequenciaRoutes from './routes/frequencia.routes';
import boletimRoutes from './routes/boletim.routes';

const app = express();

logInfo('🚀 Inicializando Sistema Escolar Pinguinho API', 'server');

// Configuração básica do Express
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Configuração detalhada do CORS
app.use(cors({
  origin: '*', // Permite todas as origens em ambiente de desenvolvimento
  methods: ['GET', 'PATCH', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

logSuccess('✅ Middlewares básicos configurados', 'server');

// Middleware para log de requisições
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Log inicial da requisição
  logInfo(`🌐 ${req.method} ${req.originalUrl}`, 'route');
  
  // Interceptando o método de resposta para logar quando finalizar
  const originalSend = res.send;
  res.send = function(body): Response {
    const time = Date.now() - start;
    const status = res.statusCode;
    const statusEmoji = status >= 200 && status < 300 ? '✅' : status >= 400 ? '❌' : '⚠️';
    
    if (status >= 200 && status < 300) {
      logSuccess(`${req.method} ${req.originalUrl} ${status} - ${time}ms ${statusEmoji}`, 'route');
    } else if (status >= 400) {
      logError(`${req.method} ${req.originalUrl} ${status} - ${time}ms ${statusEmoji}`, 'route');
    } else {
      logInfo(`${req.method} ${req.originalUrl} ${status} - ${time}ms ${statusEmoji}`, 'route');
    }
    
    return originalSend.call(this, body);
  };
  
  next();
});

// Rota raiz
app.get("/", async (req: Request, res: Response) => {
  try {
    logInfo('🏠 Acesso à rota raiz', 'route');
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'API Sistema Escolar Pinguinho v1.0',
      recursos: [
        'Gestão de Usuários',
        'Gestão de Alunos',
        'Gestão de Professores',
        'Dados de Saúde',
        'Diagnósticos',
        'Anos Letivos',
        'Períodos Letivos',
        'Séries',
        'Turmas'
      ]
    });
  } catch (e: any) {
    logError(`❌ Erro na rota raiz: ${e.message}`, 'route');
    res.status(500).json({
      status: 'erro',
      mensagem: e.message || 'Erro interno do servidor'
    });
  }
});

// Endpoint para testar a conexão com o banco de dados
app.get("/test-connection", async (req: Request, res: Response) => {
  try {
    logInfo('🔍 Testando conexão com o banco de dados...', 'database');
    // Testa a conexão fazendo uma consulta simples
    const result = await connection.raw('SELECT 1+1 AS result');
    logSuccess('✅ Teste de conexão com o banco de dados bem-sucedido!', 'database', result[0]);
    res.status(200).json({
      sucesso: true,
      mensagem: "Conexão com o banco de dados estabelecida com sucesso!",
      resultado: result[0]
    });
  } catch (error: any) {
    logError(`❌ Falha ao conectar com o banco de dados: ${error.message}`, 'database');
    res.status(500).json({
      sucesso: false,
      mensagem: "Falha ao conectar com o banco de dados.",
      erro: error.message
    });
  }
});

// Registrar as rotas
logInfo('📝 Registrando rotas da aplicação...', 'route');

app.use('/auth', authRoutes);
logDebug('🔐 Rotas de autenticação registradas', 'route');

app.use('/usuario-tipo', usuarioTipoRoutes);
logDebug('👥 Rotas de tipos de usuário registradas', 'route');

app.use('/professor', professorRoutes);
logDebug('👨‍🏫 Rotas de professores registradas', 'route');

app.use('/aluno', alunoRoutes);
logDebug('🧑‍🎓 Rotas de alunos registradas', 'route');

app.use('/religiao', religiaoRoutes);
logDebug('⛪ Rotas de religião registradas', 'route');

app.use('/certidao', certidaoRoutes);
logDebug('📄 Rotas de certidão registradas', 'route');

app.use('/parentesco', parentescoRoutes);
logDebug('👨‍👩‍👧‍👦 Rotas de parentesco registradas', 'route');

app.use('/responsavel', responsavelRoutes);
logDebug('👨‍👩‍👧 Rotas de responsáveis registradas', 'route');

app.use('/dados-saude', dadosSaudeRoutes);
logDebug('🏥 Rotas de dados de saúde registradas', 'route');

app.use('/diagnostico', diagnosticoRoutes);
logDebug('🔬 Rotas de diagnóstico registradas', 'route');

app.use('/ano-letivo', anoLetivoRoutes);
logDebug('📅 Rotas de ano letivo registradas', 'route');

app.use('/periodo-letivo', periodoLetivoRoutes);
logDebug('📆 Rotas de período letivo registradas', 'route');

app.use('/serie', serieRoutes);
logDebug('📚 Rotas de série registradas', 'route');

app.use('/turma', turmaRoutes);
logDebug('🏫 Rotas de turma registradas', 'route');

app.use('/matricula-aluno', matriculaAlunoRoutes);
logDebug('📋 Rotas de matrícula de aluno registradas', 'route');

app.use('/ficha-cadastro', fichaCadastroRoutes);
logDebug('📝 Rotas de ficha cadastro registradas', 'route');

app.use('/disciplina', disciplinaRoutes);
logDebug('📚 Rotas de disciplina registradas', 'route');

app.use('/vinculacao', turmaDisciplinaProfessorRoutes);
logDebug('👨‍🏫📚 Rotas de turma-disciplina-professor registradas', 'route');

app.use('/aula', aulaRoutes);
logDebug('📝 Rotas de aula registradas', 'route');

app.use('/conteudo-aula', conteudoAulaRoutes);
logDebug('📚 Rotas de conteúdo de aula registradas', 'route');

app.use('/atividade', atividadeRoutes);
logDebug('📝 Rotas de atividade registradas', 'route');

app.use('/nota', notaRoutes);
logDebug('📊 Rotas de nota registradas', 'route');

app.use('/media-disciplina-bimestre', mediaDisciplinaBimestreRoutes);
logDebug('📈 Rotas de média disciplina bimestre registradas', 'route');

app.use('/frequencia', frequenciaRoutes);
logDebug('📋 Rotas de frequência registradas', 'route');

app.use('/boletim', boletimRoutes);
logDebug('📄 Rotas de boletim registradas', 'route');

logSuccess('✅ Todas as rotas registradas com sucesso!', 'route');

const HOST = process.env.HOST || 'localhost';
const PORT = Number(process.env.PORT) || 3003;

const server = app.listen(PORT, HOST, () => {
  if (server) {
    const address = server.address();
    const port = typeof address === 'string' ? PORT : address ? address.port : PORT;

    logSuccess(`🚀 Servidor rodando em http://${HOST}:${port}`, 'server');
    logInfo('🔍 Para testar a API, acesse: http://localhost:3003/', 'server');
    logInfo('🧪 Para testar conexão DB: http://localhost:3003/test-connection', 'server');
    logInfo('⌨️ Pressione CTRL+C para encerrar o servidor', 'server');
  } else {
    logError('❌ Falha ao iniciar o servidor', 'server');
  }
});
