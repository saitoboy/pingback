import { Request, Response } from 'express';
import SerieService from '../services/serie.service';
import { logInfo, logSuccess, logError, logWarning } from '../utils/logger';

class SerieController {

  // Listar todas as séries
  static async listarSeries(req: Request, res: Response): Promise<void> {
    try {
      logInfo('📋 Listando todas as séries', 'controller');
      const series = await SerieService.listarSeries();
      
      logSuccess(`✅ ${series.length} séries encontradas`, 'controller');
      res.status(200).json({
        sucesso: true,
        dados: series
      });
    } catch (error) {
      logError('❌ Erro ao listar séries', 'controller', error);
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
      logInfo(`🔍 Buscando série por ID: ${serie_id}`, 'controller');
      
      const serie = await SerieService.buscarSeriePorId(serie_id);
      
      if (!serie) {
        logWarning(`⚠️ Série não encontrada: ${serie_id}`, 'controller');
        res.status(404).json({
          sucesso: false,
          mensagem: 'Série não encontrada'
        });
        return;
      }

      logSuccess(`✅ Série encontrada: ${serie.nome_serie}`, 'controller');
      res.status(200).json({
        sucesso: true,
        dados: serie
      });
    } catch (error) {
      logError('❌ Erro ao buscar série por ID', 'controller', error);
      
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
      logInfo(`🔍 Buscando série por nome: ${nome}`, 'controller');
      
      const serie = await SerieService.buscarSeriePorNome(nome);
      
      if (!serie) {
        logWarning(`⚠️ Série não encontrada com nome: ${nome}`, 'controller');
        res.status(404).json({
          sucesso: false,
          mensagem: 'Série não encontrada'
        });
        return;
      }

      logSuccess(`✅ Série encontrada: ${serie.nome_serie}`, 'controller');
      res.status(200).json({
        sucesso: true,
        dados: serie
      });
    } catch (error) {
      logError('❌ Erro ao buscar série por nome', 'controller', error);
      
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
      logInfo(`📝 Criando nova série: ${req.body.nome_serie}`, 'controller');
      const serie = await SerieService.criarSerie(req.body);
      
      logSuccess(`✅ Série "${serie.nome_serie}" criada com sucesso [ID: ${serie.serie_id}]`, 'controller');
      res.status(201).json({
        sucesso: true,
        mensagem: 'Série criada com sucesso',
        dados: serie
      });
    } catch (error) {
      logError(`❌ Erro ao criar série: ${req.body.nome_serie}`, 'controller', error);
      
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
      logInfo(`✏️ Atualizando série: ${serie_id}`, 'controller');
      
      const serie = await SerieService.atualizarSerie(serie_id, req.body);
      
      if (!serie) {
        logWarning(`⚠️ Série não encontrada para atualização: ${serie_id}`, 'controller');
        res.status(404).json({
          sucesso: false,
          mensagem: 'Série não encontrada'
        });
        return;
      }

      logSuccess(`✅ Série "${serie.nome_serie}" atualizada com sucesso`, 'controller');
      res.status(200).json({
        sucesso: true,
        mensagem: 'Série atualizada com sucesso',
        dados: serie
      });
    } catch (error) {
      logError('❌ Erro ao atualizar série', 'controller', error);
      
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
      logInfo(`🗑️ Deletando série: ${serie_id}`, 'controller');
      
      const deletado = await SerieService.deletarSerie(serie_id);
      
      if (!deletado) {
        logWarning(`⚠️ Série não encontrada para deleção: ${serie_id}`, 'controller');
        res.status(404).json({
          sucesso: false,
          mensagem: 'Série não encontrada'
        });
        return;
      }

      logSuccess(`✅ Série deletada com sucesso: ${serie_id}`, 'controller');
      res.status(200).json({
        sucesso: true,
        mensagem: 'Série deletada com sucesso'
      });
    } catch (error) {
      logError('❌ Erro ao deletar série', 'controller', error);
      
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
