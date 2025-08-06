import { Request, Response } from 'express';
import TurmaService from '../services/turma.service';

class TurmaController {

  // Listar todas as turmas
  static async listarTurmas(req: Request, res: Response): Promise<void> {
    try {
      const turmas = await TurmaService.listarTurmas();
      
      res.status(200).json({
        sucesso: true,
        dados: turmas
      });
    } catch (error) {
      console.error('Erro ao listar turmas:', error);
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
      
      const turma = await TurmaService.buscarTurmaPorId(turma_id);
      
      if (!turma) {
        res.status(404).json({
          sucesso: false,
          mensagem: 'Turma não encontrada'
        });
        return;
      }

      res.status(200).json({
        sucesso: true,
        dados: turma
      });
    } catch (error) {
      console.error('Erro ao buscar turma por ID:', error);
      
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
      
      const turmas = await TurmaService.buscarTurmasPorSerie(serie_id);
      
      res.status(200).json({
        sucesso: true,
        dados: turmas
      });
    } catch (error) {
      console.error('Erro ao buscar turmas por série:', error);
      
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
      
      const turmas = await TurmaService.buscarTurmasPorAnoLetivo(ano_letivo_id);
      
      res.status(200).json({
        sucesso: true,
        dados: turmas
      });
    } catch (error) {
      console.error('Erro ao buscar turmas por ano letivo:', error);
      
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
      
      const turmas = await TurmaService.buscarTurmasPorSerieEAno(serie_id, ano_letivo_id);
      
      res.status(200).json({
        sucesso: true,
        dados: turmas
      });
    } catch (error) {
      console.error('Erro ao buscar turmas por série e ano:', error);
      
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
      
      const turmas = await TurmaService.buscarTurmasPorTurno(turno);
      
      res.status(200).json({
        sucesso: true,
        dados: turmas
      });
    } catch (error) {
      console.error('Erro ao buscar turmas por turno:', error);
      
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
      const turma = await TurmaService.criarTurma(req.body);
      
      res.status(201).json({
        sucesso: true,
        mensagem: 'Turma criada com sucesso',
        dados: turma
      });
    } catch (error) {
      console.error('Erro ao criar turma:', error);
      
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
      
      const turma = await TurmaService.atualizarTurma(turma_id, req.body);
      
      if (!turma) {
        res.status(404).json({
          sucesso: false,
          mensagem: 'Turma não encontrada'
        });
        return;
      }

      res.status(200).json({
        sucesso: true,
        mensagem: 'Turma atualizada com sucesso',
        dados: turma
      });
    } catch (error) {
      console.error('Erro ao atualizar turma:', error);
      
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
      
      const deletado = await TurmaService.deletarTurma(turma_id);
      
      if (!deletado) {
        res.status(404).json({
          sucesso: false,
          mensagem: 'Turma não encontrada'
        });
        return;
      }

      res.status(200).json({
        sucesso: true,
        mensagem: 'Turma deletada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar turma:', error);
      
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
