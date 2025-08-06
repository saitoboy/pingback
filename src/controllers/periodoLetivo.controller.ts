import { Request, Response } from 'express';
import PeriodoLetivoService from '../services/periodoLetivo.service';

class PeriodoLetivoController {

  // Listar todos os períodos letivos
  static async listarPeriodosLetivos(req: Request, res: Response): Promise<void> {
    try {
      const periodos = await PeriodoLetivoService.listarPeriodosLetivos();
      
      res.status(200).json({
        sucesso: true,
        dados: periodos
      });
    } catch (error) {
      console.error('Erro ao listar períodos letivos:', error);
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
      console.error('Erro ao buscar período letivo por ID:', error);
      
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
      console.error('Erro ao buscar períodos letivos por ano:', error);
      
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
      console.error('Erro ao buscar período letivo por bimestre e ano:', error);
      
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
      const periodo = await PeriodoLetivoService.criarPeriodoLetivo(req.body);
      
      res.status(201).json({
        sucesso: true,
        mensagem: 'Período letivo criado com sucesso',
        dados: periodo
      });
    } catch (error) {
      console.error('Erro ao criar período letivo:', error);
      
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
      console.error('Erro ao atualizar período letivo:', error);
      
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
      console.error('Erro ao deletar período letivo:', error);
      
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
      console.error('Erro ao criar todos os bimestres:', error);
      
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
