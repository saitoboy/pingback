import { Request, Response } from 'express';
import * as TurmaBreakModel from '../model/turmaBreak.model';
import { logError, logSuccess } from '../utils/logger';

export class TurmaBreakController {
  static async listarPorTurma(req: Request, res: Response) {
    try {
      const { turmaId } = req.params;
      const breaks = await TurmaBreakModel.listarPorTurma(turmaId);
      res.status(200).json({ status: 'sucesso', mensagem: 'Breaks obtidos', dados: breaks });
    } catch (error: any) {
      logError('Erro ao listar breaks', 'controller', error);
      res.status(500).json({ status: 'erro', mensagem: error.message });
    }
  }

  static async criar(req: Request, res: Response) {
    try {
      const { turma_id, dia_semana, tipo, hora_inicio, hora_fim } = req.body;

      if (!turma_id || !tipo || !hora_inicio || !hora_fim) {
        return res.status(400).json({
          status: 'erro',
          mensagem: 'Campos obrigatórios: turma_id, tipo, hora_inicio, hora_fim'
        });
      }

      if (!['lanche', 'recreio'].includes(tipo)) {
        return res.status(400).json({ status: 'erro', mensagem: 'tipo deve ser "lanche" ou "recreio"' });
      }

      const novo = await TurmaBreakModel.criar({
        turma_id,
        dia_semana: dia_semana ?? null,
        tipo,
        hora_inicio,
        hora_fim
      });

      logSuccess('Break criado', 'controller', { break_id: novo.break_id });
      res.status(201).json({ status: 'sucesso', mensagem: 'Break criado com sucesso', dados: novo });
    } catch (error: any) {
      logError('Erro ao criar break', 'controller', error);
      res.status(500).json({ status: 'erro', mensagem: error.message });
    }
  }

  static async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { dia_semana, tipo, hora_inicio, hora_fim } = req.body;

      const atualizado = await TurmaBreakModel.atualizar(id, { dia_semana, tipo, hora_inicio, hora_fim });

      if (!atualizado) {
        return res.status(404).json({ status: 'erro', mensagem: 'Break não encontrado' });
      }

      logSuccess('Break atualizado', 'controller', { break_id: id });
      res.status(200).json({ status: 'sucesso', mensagem: 'Break atualizado', dados: atualizado });
    } catch (error: any) {
      logError('Erro ao atualizar break', 'controller', error);
      res.status(500).json({ status: 'erro', mensagem: error.message });
    }
  }

  static async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const ok = await TurmaBreakModel.deletar(id);

      if (!ok) {
        return res.status(404).json({ status: 'erro', mensagem: 'Break não encontrado' });
      }

      logSuccess('Break deletado', 'controller', { break_id: id });
      res.status(200).json({ status: 'sucesso', mensagem: 'Break deletado' });
    } catch (error: any) {
      logError('Erro ao deletar break', 'controller', error);
      res.status(500).json({ status: 'erro', mensagem: error.message });
    }
  }
}

export default TurmaBreakController;
