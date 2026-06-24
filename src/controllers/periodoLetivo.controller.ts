import { Request, Response } from 'express';
import PeriodoLetivoService from '../services/periodoLetivo.service';
import { logInfo, logSuccess, logError, logWarning } from '../utils/logger';

class PeriodoLetivoController {

  // Listar todos os períodos letivos
  static async listarPeriodosLetivos(req: Request, res: Response): Promise<void> {
    try {
      logInfo('📋 Listando todos os períodos letivos', 'controller');
      const periodos = await PeriodoLetivoService.listarPeriodosLetivos();
      
      logSuccess(`✅ ${periodos.length} períodos letivos encontrados`, 'controller');
      res.status(200).json({
        sucesso: true,
        dados: periodos
      });
    } catch (error) {
      logError('❌ Erro ao listar períodos letivos', 'controller', error);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // Buscar período letivo atual
  static async buscarPeriodoLetivoAtual(req: Request, res: Response): Promise<void> {
    try {
      logInfo('📅 Buscando período letivo atual', 'controller');
      const periodo = await PeriodoLetivoService.buscarPeriodoLetivoAtual();
      
      if (!periodo) {
        logWarning('⚠️ Nenhum período letivo ativo encontrado', 'controller');
        res.status(404).json({
          sucesso: false,
          mensagem: 'Nenhum período letivo ativo encontrado'
        });
        return;
      }
      
      logSuccess(`✅ Período letivo atual encontrado: ${periodo.bimestre}º bimestre`, 'controller');
      res.status(200).json({
        sucesso: true,
        dados: periodo
      });
    } catch (error) {
      logError('❌ Erro ao buscar período letivo atual', 'controller', error);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // Buscar período letivo por ID
  static async buscarPeriodoLetivoPorId(req: Request, res: Response): Promise<void> {
    try {
      const { periodo_letivo_id } = req.params;
      
      const periodo = await PeriodoLetivoService.buscarPeriodoLetivoPorId(periodo_letivo_id);
      
      if (!periodo) {
        res.status(404).json({
          sucesso: false,
          mensagem: 'Período letivo não encontrado'
        });
        return;
      }

      res.status(200).json({
        sucesso: true,
        dados: periodo
      });
    } catch (error) {
      logError(' Erro ao buscar período letivo por ID', 'controller', error);
      
      if (error instanceof Error && error.message.includes('obrigatório')) {
        res.status(400).json({
          sucesso: false,
          mensagem: error.message
        });
        return;
      }

      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // Buscar períodos letivos por ano letivo
  static async buscarPeriodosLetivosPorAno(req: Request, res: Response): Promise<void> {
    try {
      const { ano_letivo_id } = req.params;
      
      const periodos = await PeriodoLetivoService.buscarPeriodosLetivosPorAno(ano_letivo_id);
      
      res.status(200).json({
        sucesso: true,
        dados: periodos
      });
    } catch (error) {
      logError(' Erro ao buscar períodos letivos por ano', 'controller', error);
      
      if (error instanceof Error && (error.message.includes('obrigatório') || error.message.includes('não encontrado'))) {
        res.status(404).json({
          sucesso: false,
          mensagem: error.message
        });
        return;
      }

      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // Buscar período letivo por bimestre e ano
  static async buscarPeriodoLetivoPorBimestreEAno(req: Request, res: Response): Promise<void> {
    try {
      const { bimestre, ano_letivo_id } = req.params;
      
      const periodo = await PeriodoLetivoService.buscarPeriodoLetivoPorBimestreEAno(Number(bimestre), ano_letivo_id);
      
      if (!periodo) {
        res.status(404).json({
          sucesso: false,
          mensagem: `${bimestre}º bimestre não encontrado para este ano letivo`
        });
        return;
      }

      res.status(200).json({
        sucesso: true,
        dados: periodo
      });
    } catch (error) {
      logError(' Erro ao buscar período letivo por bimestre e ano', 'controller', error);
      
      if (error instanceof Error && error.message.includes('deve ser')) {
        res.status(400).json({
          sucesso: false,
          mensagem: error.message
        });
        return;
      }

      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // Criar período letivo
  static async criarPeriodoLetivo(req: Request, res: Response): Promise<void> {
    try {
      logInfo(`📝 Criando período letivo: ${req.body.bimestre}º bimestre`, 'controller');
      const periodo = await PeriodoLetivoService.criarPeriodoLetivo(req.body);
      
      logSuccess(`✅ ${periodo.bimestre}º bimestre criado com sucesso [ID: ${periodo.periodo_letivo_id}]`, 'controller');
      res.status(201).json({
        sucesso: true,
        mensagem: 'Período letivo criado com sucesso',
        dados: periodo
      });
    } catch (error) {
      logError(`❌ Erro ao criar período letivo: ${req.body.bimestre}º bimestre`, 'controller', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Dados inválidos') || error.message.includes('obrigatório')) {
          res.status(400).json({
            sucesso: false,
            mensagem: error.message
          });
          return;
        }
        
        if (error.message.includes('não encontrado')) {
          res.status(404).json({
            sucesso: false,
            mensagem: error.message
          });
          return;
        }
        
        if (error.message.includes('Já existe')) {
          res.status(409).json({
            sucesso: false,
            mensagem: error.message
          });
          return;
        }
      }

      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // Atualizar período letivo
  static async atualizarPeriodoLetivo(req: Request, res: Response): Promise<void> {
    try {
      const { periodo_letivo_id } = req.params;
      
      const periodo = await PeriodoLetivoService.atualizarPeriodoLetivo(periodo_letivo_id, req.body);
      
      if (!periodo) {
        res.status(404).json({
          sucesso: false,
          mensagem: 'Período letivo não encontrado'
        });
        return;
      }

      res.status(200).json({
        sucesso: true,
        mensagem: 'Período letivo atualizado com sucesso',
        dados: periodo
      });
    } catch (error) {
      logError(' Erro ao atualizar período letivo', 'controller', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Dados inválidos') || error.message.includes('obrigatório')) {
          res.status(400).json({
            sucesso: false,
            mensagem: error.message
          });
          return;
        }
        
        if (error.message.includes('não encontrado')) {
          res.status(404).json({
            sucesso: false,
            mensagem: error.message
          });
          return;
        }
        
        if (error.message.includes('Já existe')) {
          res.status(409).json({
            sucesso: false,
            mensagem: error.message
          });
          return;
        }
      }

      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // Deletar período letivo
  static async deletarPeriodoLetivo(req: Request, res: Response): Promise<void> {
    try {
      const { periodo_letivo_id } = req.params;
      
      const deletado = await PeriodoLetivoService.deletarPeriodoLetivo(periodo_letivo_id);
      
      if (!deletado) {
        res.status(404).json({
          sucesso: false,
          mensagem: 'Período letivo não encontrado'
        });
        return;
      }

      res.status(200).json({
        sucesso: true,
        mensagem: 'Período letivo deletado com sucesso'
      });
    } catch (error) {
      logError(' Erro ao deletar período letivo', 'controller', error);
      
      if (error instanceof Error && error.message.includes('não encontrado')) {
        res.status(404).json({
          sucesso: false,
          mensagem: error.message
        });
        return;
      }

      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // Ativar período letivo em todas as matrículas ativas do ano
  static async ativarPeriodo(req: Request, res: Response): Promise<void> {
    try {
      const { periodo_letivo_id } = req.params;

      logInfo(`🔔 Ativando período letivo ${periodo_letivo_id} para matrículas`, 'controller');

      const resultado = await PeriodoLetivoService.ativarPeriodoEmMatriculas(periodo_letivo_id);

      logSuccess(`✅ Período ativado em ${resultado.total} matrículas`, 'controller');
      res.status(200).json({
        sucesso: true,
        mensagem: `Período ativado em ${resultado.total} matrícula(s)`,
        dados: resultado
      });
    } catch (error) {
      logError('❌ Erro ao ativar período', 'controller', error);

      if (error instanceof Error && error.message.includes('não encontrado')) {
        res.status(404).json({ sucesso: false, mensagem: error.message });
        return;
      }

      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // Criar todos os bimestres para um ano letivo
  static async criarTodosBimestres(req: Request, res: Response): Promise<void> {
    try {
      const { ano_letivo_id } = req.params;
      
      const bimestres = await PeriodoLetivoService.criarTodosBimestres(ano_letivo_id);
      
      if (bimestres.length === 0) {
        res.status(200).json({
          sucesso: true,
          mensagem: 'Todos os bimestres já existem para este ano letivo',
          dados: []
        });
        return;
      }

      res.status(201).json({
        sucesso: true,
        mensagem: `${bimestres.length} bimestres criados com sucesso`,
        dados: bimestres
      });
    } catch (error) {
      logError(' Erro ao criar todos os bimestres', 'controller', error);
      
      if (error instanceof Error && error.message.includes('não encontrado')) {
        res.status(404).json({
          sucesso: false,
          mensagem: error.message
        });
        return;
      }

      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
}

export default PeriodoLetivoController;
