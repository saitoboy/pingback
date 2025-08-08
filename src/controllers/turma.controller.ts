import { Request, Response } from 'express';
import TurmaService from '../services/turma.service';
import { logInfo, logSuccess, logError, logWarning } from '../utils/logger';

class TurmaController {

  // Listar todas as turmas
  static async listarTurmas(req: Request, res: Response): Promise<void> {
    try {
      logInfo('📋 Listando todas as turmas', 'controller');
      const turmas = await TurmaService.listarTurmas();
      
      logSuccess(`✅ ${turmas.length} turmas encontradas`, 'controller');
      res.status(200).json({
        sucesso: true,
        dados: turmas
      });
    } catch (error) {
      logError('❌ Erro ao listar turmas', 'controller', error);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // Buscar turma por ID
  static async buscarTurmaPorId(req: Request, res: Response): Promise<void> {
    try {
      const { turma_id } = req.params;
      logInfo(`🔍 Buscando turma por ID: ${turma_id}`, 'controller');
      
      const turma = await TurmaService.buscarTurmaPorId(turma_id);
      
      if (!turma) {
        logWarning(`⚠️ Turma não encontrada: ${turma_id}`, 'controller');
        res.status(404).json({
          sucesso: false,
          mensagem: 'Turma não encontrada'
        });
        return;
      }

      logSuccess(`✅ Turma encontrada: ${turma.nome_turma}`, 'controller');
      res.status(200).json({
        sucesso: true,
        dados: turma
      });
    } catch (error) {
      logError(`❌ Erro ao buscar turma por ID`, 'controller', error);
      
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

  // Buscar turmas por série
  static async buscarTurmasPorSerie(req: Request, res: Response): Promise<void> {
    try {
      const { serie_id } = req.params;
      logInfo(`🔍 Buscando turmas por série: ${serie_id}`, 'controller');
      
      const turmas = await TurmaService.buscarTurmasPorSerie(serie_id);
      
      logSuccess(`✅ ${turmas.length} turmas encontradas para a série`, 'controller');
      res.status(200).json({
        sucesso: true,
        dados: turmas
      });
    } catch (error) {
      logError('❌ Erro ao buscar turmas por série', 'controller', error);
      
      if (error instanceof Error && (error.message.includes('obrigatório') || error.message.includes('não encontrada'))) {
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

  // Buscar turmas por ano letivo
  static async buscarTurmasPorAnoLetivo(req: Request, res: Response): Promise<void> {
    try {
      const { ano_letivo_id } = req.params;
      logInfo(`🔍 Buscando turmas por ano letivo: ${ano_letivo_id}`, 'controller');
      
      const turmas = await TurmaService.buscarTurmasPorAnoLetivo(ano_letivo_id);
      
      logSuccess(`✅ ${turmas.length} turmas encontradas para o ano letivo`, 'controller');
      res.status(200).json({
        sucesso: true,
        dados: turmas
      });
    } catch (error) {
      logError('❌ Erro ao buscar turmas por ano letivo', 'controller', error);
      
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

  // Buscar turmas por série e ano letivo
  static async buscarTurmasPorSerieEAno(req: Request, res: Response): Promise<void> {
    try {
      const { serie_id, ano_letivo_id } = req.params;
      logInfo(`🔍 Buscando turmas por série ${serie_id} e ano ${ano_letivo_id}`, 'controller');
      
      const turmas = await TurmaService.buscarTurmasPorSerieEAno(serie_id, ano_letivo_id);
      
      logSuccess(`✅ ${turmas.length} turmas encontradas para série e ano`, 'controller');
      res.status(200).json({
        sucesso: true,
        dados: turmas
      });
    } catch (error) {
      logError('❌ Erro ao buscar turmas por série e ano', 'controller', error);
      
      if (error instanceof Error && (error.message.includes('obrigatório') || error.message.includes('não encontrad'))) {
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

  // Buscar turmas por turno
  static async buscarTurmasPorTurno(req: Request, res: Response): Promise<void> {
    try {
      const { turno } = req.params;
      logInfo(`🔍 Buscando turmas por turno: ${turno}`, 'controller');
      
      const turmas = await TurmaService.buscarTurmasPorTurno(turno);
      
      logSuccess(`✅ ${turmas.length} turmas encontradas para o turno ${turno}`, 'controller');
      res.status(200).json({
        sucesso: true,
        dados: turmas
      });
    } catch (error) {
      logError('❌ Erro ao buscar turmas por turno', 'controller', error);
      
      if (error instanceof Error && (error.message.includes('obrigatório') || error.message.includes('deve ser'))) {
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
  // Criar turma
  static async criarTurma(req: Request, res: Response): Promise<void> {
    try {
      logInfo(`📝 Criando nova turma: ${req.body.nome_turma} (${req.body.turno})`, 'controller');
      const turma = await TurmaService.criarTurma(req.body);
      
      logSuccess(`✅ Turma "${turma.nome_turma}" criada com sucesso [ID: ${turma.turma_id}]`, 'controller');
      res.status(201).json({
        sucesso: true,
        mensagem: 'Turma criada com sucesso',
        dados: turma
      });
    } catch (error) {
      logError(`❌ Erro ao criar turma: ${req.body.nome_turma}`, 'controller', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Dados inválidos') || error.message.includes('obrigatório')) {
          res.status(400).json({
            sucesso: false,
            mensagem: error.message
          });
          return;
        }
        
        if (error.message.includes('não encontrad')) {
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

  // Atualizar turma
  static async atualizarTurma(req: Request, res: Response): Promise<void> {
    try {
      const { turma_id } = req.params;
      logInfo(`✏️ Atualizando turma: ${turma_id}`, 'controller');
      
      const turma = await TurmaService.atualizarTurma(turma_id, req.body);
      
      if (!turma) {
        logWarning(`⚠️ Turma não encontrada para atualização: ${turma_id}`, 'controller');
        res.status(404).json({
          sucesso: false,
          mensagem: 'Turma não encontrada'
        });
        return;
      }

      logSuccess(`✅ Turma "${turma.nome_turma}" atualizada com sucesso`, 'controller');
      res.status(200).json({
        sucesso: true,
        mensagem: 'Turma atualizada com sucesso',
        dados: turma
      });
    } catch (error) {
      logError(`❌ Erro ao atualizar turma`, 'controller', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Dados inválidos') || error.message.includes('obrigatório')) {
          res.status(400).json({
            sucesso: false,
            mensagem: error.message
          });
          return;
        }
        
        if (error.message.includes('não encontrad')) {
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

  // Deletar turma
  static async deletarTurma(req: Request, res: Response): Promise<void> {
    try {
      const { turma_id } = req.params;
      logInfo(`🗑️ Deletando turma: ${turma_id}`, 'controller');
      
      const deletado = await TurmaService.deletarTurma(turma_id);
      
      if (!deletado) {
        logWarning(`⚠️ Turma não encontrada para deleção: ${turma_id}`, 'controller');
        res.status(404).json({
          sucesso: false,
          mensagem: 'Turma não encontrada'
        });
        return;
      }

      logSuccess(`✅ Turma deletada com sucesso: ${turma_id}`, 'controller');
      res.status(200).json({
        sucesso: true,
        mensagem: 'Turma deletada com sucesso'
      });
    } catch (error) {
      logError(`❌ Erro ao deletar turma`, 'controller', error);
      
      if (error instanceof Error) {
        if (error.message.includes('não encontrada')) {
          res.status(404).json({
            sucesso: false,
            mensagem: error.message
          });
          return;
        }
        
        if (error.message.includes('possui alunos')) {
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
}

export default TurmaController;
