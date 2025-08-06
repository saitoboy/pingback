import { Request, Response } from 'express';
import SerieService from '../services/serie.service';

class SerieController {

  // Listar todas as séries
  static async listarSeries(req: Request, res: Response): Promise<void> {
    try {
      const series = await SerieService.listarSeries();
      
      res.status(200).json({
        sucesso: true,
        dados: series
      });
    } catch (error) {
      console.error('Erro ao listar séries:', error);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // Buscar série por ID
  static async buscarSeriePorId(req: Request, res: Response): Promise<void> {
    try {
      const { serie_id } = req.params;
      
      const serie = await SerieService.buscarSeriePorId(serie_id);
      
      if (!serie) {
        res.status(404).json({
          sucesso: false,
          mensagem: 'Série não encontrada'
        });
        return;
      }

      res.status(200).json({
        sucesso: true,
        dados: serie
      });
    } catch (error) {
      console.error('Erro ao buscar série por ID:', error);
      
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

  // Buscar série por nome
  static async buscarSeriePorNome(req: Request, res: Response): Promise<void> {
    try {
      const { nome } = req.params;
      
      const serie = await SerieService.buscarSeriePorNome(nome);
      
      if (!serie) {
        res.status(404).json({
          sucesso: false,
          mensagem: 'Série não encontrada'
        });
        return;
      }

      res.status(200).json({
        sucesso: true,
        dados: serie
      });
    } catch (error) {
      console.error('Erro ao buscar série por nome:', error);
      
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

  // Criar série
  static async criarSerie(req: Request, res: Response): Promise<void> {
    try {
      const serie = await SerieService.criarSerie(req.body);
      
      res.status(201).json({
        sucesso: true,
        mensagem: 'Série criada com sucesso',
        dados: serie
      });
    } catch (error) {
      console.error('Erro ao criar série:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Dados inválidos') || error.message.includes('obrigatório')) {
          res.status(400).json({
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

  // Atualizar série
  static async atualizarSerie(req: Request, res: Response): Promise<void> {
    try {
      const { serie_id } = req.params;
      
      const serie = await SerieService.atualizarSerie(serie_id, req.body);
      
      if (!serie) {
        res.status(404).json({
          sucesso: false,
          mensagem: 'Série não encontrada'
        });
        return;
      }

      res.status(200).json({
        sucesso: true,
        mensagem: 'Série atualizada com sucesso',
        dados: serie
      });
    } catch (error) {
      console.error('Erro ao atualizar série:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Dados inválidos') || error.message.includes('obrigatório')) {
          res.status(400).json({
            sucesso: false,
            mensagem: error.message
          });
          return;
        }
        
        if (error.message.includes('não encontrada')) {
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

  // Deletar série
  static async deletarSerie(req: Request, res: Response): Promise<void> {
    try {
      const { serie_id } = req.params;
      
      const deletado = await SerieService.deletarSerie(serie_id);
      
      if (!deletado) {
        res.status(404).json({
          sucesso: false,
          mensagem: 'Série não encontrada'
        });
        return;
      }

      res.status(200).json({
        sucesso: true,
        mensagem: 'Série deletada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar série:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('não encontrada')) {
          res.status(404).json({
            sucesso: false,
            mensagem: error.message
          });
          return;
        }
        
        if (error.message.includes('possui turmas')) {
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

export default SerieController;
