import { Request, Response } from 'express';
import { HistoricoEscolarService } from '../services/historicoEscolar.service';
import logger from '../utils/logger';

export class HistoricoEscolarController {

  // ================ CRUD BÁSICO ================

  static async listarTodos(req: Request, res: Response): Promise<void> {
    try {
      logger.info('Controller: Listando todos os históricos escolares', 'HistoricoEscolarController');
      const historicos = await HistoricoEscolarService.listarTodos();
      
      res.status(200).json({
        success: true,
        data: historicos,
        message: 'Históricos escolares listados com sucesso'
      });
    } catch (error) {
      logger.error('Erro no controller ao listar históricos escolares:', 'HistoricoEscolarController', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const { historico_escolar_id } = req.params;
      logger.info(`Controller: Buscando histórico escolar por ID: ${historico_escolar_id}`, 'HistoricoEscolarController');
      
      const historico = await HistoricoEscolarService.buscarPorId(historico_escolar_id);
      
      if (!historico) {
        res.status(404).json({
          success: false,
          message: 'Histórico escolar não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: historico,
        message: 'Histórico escolar encontrado com sucesso'
      });
    } catch (error) {
      logger.error(`Erro no controller ao buscar histórico escolar por ID:`, 'HistoricoEscolarController', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async criar(req: Request, res: Response): Promise<void> {
    try {
      const dadosHistorico = req.body;
      logger.info('Controller: Criando histórico escolar', 'HistoricoEscolarController', {
        matricula_aluno_id: dadosHistorico.matricula_aluno_id,
        ano_letivo_id: dadosHistorico.ano_letivo_id,
        situacao_final: dadosHistorico.situacao_final
      });

      const historico = await HistoricoEscolarService.criar(dadosHistorico);
      
      res.status(201).json({
        success: true,
        data: historico,
        message: 'Histórico escolar criado com sucesso'
      });
    } catch (error) {
      logger.error('Erro no controller ao criar histórico escolar:', 'HistoricoEscolarController', error);
      
      if (error instanceof Error && (
        error.message.includes('obrigatório') || 
        error.message.includes('deve ser') || 
        error.message.includes('deve estar') ||
        error.message.includes('não pode ser') ||
        error.message.includes('Já existe')
      )) {
        res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor',
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }
  }

  static async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { historico_escolar_id } = req.params;
      const dadosAtualizacao = req.body;
      
      logger.info(`Controller: Atualizando histórico escolar: ${historico_escolar_id}`, 'HistoricoEscolarController', dadosAtualizacao);

      const historico = await HistoricoEscolarService.atualizar(historico_escolar_id, dadosAtualizacao);
      
      if (!historico) {
        res.status(404).json({
          success: false,
          message: 'Histórico escolar não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: historico,
        message: 'Histórico escolar atualizado com sucesso'
      });
    } catch (error) {
      logger.error(`Erro no controller ao atualizar histórico escolar:`, 'HistoricoEscolarController', error);
      
      if (error instanceof Error && (
        error.message.includes('obrigatório') || 
        error.message.includes('deve ser') || 
        error.message.includes('deve estar') ||
        error.message.includes('não pode ser') ||
        error.message.includes('não encontrado') ||
        error.message.includes('Já existe')
      )) {
        res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor',
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }
  }

  static async excluir(req: Request, res: Response): Promise<void> {
    try {
      const { historico_escolar_id } = req.params;
      logger.info(`Controller: Excluindo histórico escolar: ${historico_escolar_id}`, 'HistoricoEscolarController');

      const sucesso = await HistoricoEscolarService.excluir(historico_escolar_id);
      
      if (!sucesso) {
        res.status(404).json({
          success: false,
          message: 'Histórico escolar não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Histórico escolar excluído com sucesso'
      });
    } catch (error) {
      logger.error(`Erro no controller ao excluir histórico escolar:`, 'HistoricoEscolarController', error);
      
      if (error instanceof Error && error.message.includes('não encontrado')) {
        res.status(404).json({
          success: false,
          message: 'Histórico escolar não encontrado'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor',
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }
  }

  // ================ MÉTODOS ESPECÍFICOS ================

  static async buscarPorMatricula(req: Request, res: Response): Promise<void> {
    try {
      const { matricula_aluno_id } = req.params;
      logger.info(`Controller: Buscando históricos por matrícula: ${matricula_aluno_id}`, 'HistoricoEscolarController');
      
      const historicos = await HistoricoEscolarService.buscarPorMatricula(matricula_aluno_id);
      
      res.status(200).json({
        success: true,
        data: historicos,
        message: 'Históricos encontrados com sucesso'
      });
    } catch (error) {
      logger.error('Erro no controller ao buscar históricos por matrícula:', 'HistoricoEscolarController', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async buscarPorAnoLetivo(req: Request, res: Response): Promise<void> {
    try {
      const { ano_letivo_id } = req.params;
      logger.info(`Controller: Buscando históricos por ano letivo: ${ano_letivo_id}`, 'HistoricoEscolarController');
      
      const historicos = await HistoricoEscolarService.buscarPorAnoLetivo(ano_letivo_id);
      
      res.status(200).json({
        success: true,
        data: historicos,
        message: 'Históricos encontrados com sucesso'
      });
    } catch (error) {
      logger.error('Erro no controller ao buscar históricos por ano letivo:', 'HistoricoEscolarController', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async buscarCompleto(req: Request, res: Response): Promise<void> {
    try {
      const { historico_escolar_id } = req.params;
      logger.info(`Controller: Buscando histórico completo: ${historico_escolar_id}`, 'HistoricoEscolarController');
      
      const historicoCompleto = await HistoricoEscolarService.buscarCompleto(historico_escolar_id);
      
      if (!historicoCompleto) {
        res.status(404).json({
          success: false,
          message: 'Histórico escolar não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: historicoCompleto,
        message: 'Histórico completo recuperado com sucesso'
      });
    } catch (error) {
      logger.error('Erro no controller ao buscar histórico completo:', 'HistoricoEscolarController', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async gerarAutomatico(req: Request, res: Response): Promise<void> {
    try {
      const { matricula_aluno_id, ano_letivo_id } = req.body;
      logger.info('Controller: Gerando histórico escolar automático', 'HistoricoEscolarController', {
        matricula_aluno_id,
        ano_letivo_id
      });

      const historico = await HistoricoEscolarService.gerarAutomatico(matricula_aluno_id, ano_letivo_id);
      
      res.status(201).json({
        success: true,
        data: historico,
        message: 'Histórico escolar gerado automaticamente com sucesso'
      });
    } catch (error) {
      logger.error('Erro no controller ao gerar histórico automático:', 'HistoricoEscolarController', error);
      
      if (error instanceof Error && (
        error.message.includes('obrigatório') || 
        error.message.includes('Já existe')
      )) {
        res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor',
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }
  }

  // ================ MÉTODOS DE RELATÓRIO ================

  static async gerarRelatorioMatricula(req: Request, res: Response): Promise<void> {
    try {
      const { matricula_aluno_id } = req.params;
      logger.info(`Controller: Gerando relatório completo da matrícula: ${matricula_aluno_id}`, 'HistoricoEscolarController');
      
      const historicos = await HistoricoEscolarService.buscarPorMatricula(matricula_aluno_id);
      
      // Calcular estatísticas gerais
      const totalAnos = historicos.length;
      const anosAprovados = historicos.filter(h => h.situacao_final === 'aprovado').length;
      const anosReprovados = historicos.filter(h => h.situacao_final === 'reprovado').length;
      const mediaGeralHistorica = historicos.length > 0 ? 
        historicos.reduce((sum, h) => sum + (h.media_geral_anual || 0), 0) / historicos.length : 0;
      const totalDisciplinasCursadas = historicos.reduce((sum, h) => sum + h.total_disciplinas_cursadas, 0);

      const relatorio = {
        matricula_aluno_id,
        historicos_por_ano: historicos,
        estatisticas: {
          total_anos_cursados: totalAnos,
          anos_aprovados: anosAprovados,
          anos_reprovados: anosReprovados,
          taxa_aprovacao: totalAnos > 0 ? ((anosAprovados / totalAnos) * 100).toFixed(2) : 0,
          media_geral_historica: mediaGeralHistorica.toFixed(2),
          total_disciplinas_cursadas: totalDisciplinasCursadas
        }
      };
      
      res.status(200).json({
        success: true,
        data: relatorio,
        message: 'Relatório da matrícula gerado com sucesso'
      });
    } catch (error) {
      logger.error('Erro no controller ao gerar relatório da matrícula:', 'HistoricoEscolarController', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
}
