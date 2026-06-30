import type { Request, Response } from 'express';
import TurmaSlotModel from '../model/turmaSlot.model';
import { logError, logSuccess } from '../utils/logger';

export class TurmaSlotController {
  static async listarPorTurma(req: Request, res: Response) {
    try {
      const slots = await TurmaSlotModel.listarPorTurma(req.params.turmaId);
      res.json({ status: 'sucesso', dados: slots });
    } catch (error: any) {
      logError('Erro ao listar slots', 'controller', error);
      res.status(500).json({ status: 'erro', mensagem: error.message });
    }
  }

  static async salvar(req: Request, res: Response) {
    try {
      const { turma_id, slots } = req.body;
      if (!turma_id || !Array.isArray(slots) || slots.length === 0) {
        return res.status(400).json({ status: 'erro', mensagem: 'turma_id e slots[] obrigatórios' });
      }
      const results = await Promise.all(
        slots.map((s: any) => TurmaSlotModel.upsert(turma_id, s.numero, s.hora_inicio, s.hora_fim))
      );
      logSuccess('Slots salvos', 'controller', { turma_id });
      res.json({ status: 'sucesso', dados: results });
    } catch (error: any) {
      logError('Erro ao salvar slots', 'controller', error);
      res.status(500).json({ status: 'erro', mensagem: error.message });
    }
  }

  static async deletarPorTurma(req: Request, res: Response) {
    try {
      await TurmaSlotModel.deletarPorTurma(req.params.turmaId);
      logSuccess('Slots deletados', 'controller', { turma_id: req.params.turmaId });
      res.json({ status: 'sucesso', mensagem: 'Slots redefinidos para o padrão' });
    } catch (error: any) {
      logError('Erro ao deletar slots', 'controller', error);
      res.status(500).json({ status: 'erro', mensagem: error.message });
    }
  }
}
