import { Request, Response } from 'express';
import FeriadoService from '../services/feriado.service';
import { logInfo, logSuccess, logError } from '../utils/logger';

class FeriadoController {

  // Listar feriados por ano letivo
  static async listarPorAno(req: Request, res: Response): Promise<void> {
    try {
      const { ano_letivo_id } = req.params;
      logInfo(`📋 Listando feriados do ano letivo: ${ano_letivo_id}`, 'controller');

      const feriados = await FeriadoService.listarPorAno(ano_letivo_id);

      logSuccess(`✅ ${feriados.length} feriados encontrados`, 'controller');
      res.status(200).json({
        sucesso: true,
        dados: feriados,
      });
    } catch (error) {
      logError('❌ Erro ao listar feriados por ano', 'controller', error);

      if (error instanceof Error && error.message.includes('obrigatório')) {
        res.status(400).json({ sucesso: false, mensagem: error.message });
        return;
      }

      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        erro: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  // Criar feriado
  static async criar(req: Request, res: Response): Promise<void> {
    try {
      logInfo(`📝 Criando feriado: ${req.body.data} - ${req.body.descricao}`, 'controller');

      const feriado = await FeriadoService.criar(req.body);

      logSuccess(`✅ Feriado criado [ID: ${feriado.feriado_id}]`, 'controller');
      res.status(201).json({
        sucesso: true,
        mensagem: 'Feriado criado com sucesso',
        dados: feriado,
      });
    } catch (error) {
      logError('❌ Erro ao criar feriado', 'controller', error);

      if (error instanceof Error) {
        if (error.message.includes('Dados inválidos') || error.message.includes('obrigatório')) {
          res.status(400).json({ sucesso: false, mensagem: error.message });
          return;
        }

        if (error.message.includes('não encontrado')) {
          res.status(404).json({ sucesso: false, mensagem: error.message });
          return;
        }

        if (error.message.includes('Já existe')) {
          res.status(409).json({ sucesso: false, mensagem: error.message });
          return;
        }
      }

      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        erro: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  // Deletar feriado
  static async deletar(req: Request, res: Response): Promise<void> {
    try {
      const { feriado_id } = req.params;

      const deletado = await FeriadoService.deletar(feriado_id);

      if (!deletado) {
        res.status(404).json({ sucesso: false, mensagem: 'Feriado não encontrado' });
        return;
      }

      res.status(200).json({
        sucesso: true,
        mensagem: 'Feriado deletado com sucesso',
      });
    } catch (error) {
      logError('❌ Erro ao deletar feriado', 'controller', error);

      if (error instanceof Error && error.message.includes('não encontrado')) {
        res.status(404).json({ sucesso: false, mensagem: error.message });
        return;
      }

      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        erro: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }
}

export default FeriadoController;
