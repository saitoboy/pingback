import { Request, Response } from 'express';
import TurmaDisciplinaProfessorService from '../services/turmaDisciplinaProfessor.service';
import logger from '../utils/logger';

class TurmaDisciplinaProfessorController {

  static async listarVinculacoes(req: Request, res: Response): Promise<void> {
    try {
      const vinculacoes = await TurmaDisciplinaProfessorService.listarVinculacoes();

      res.status(200).json({
        sucesso: true,
        mensagem: 'Vinculações obtidas com sucesso',
        dados: vinculacoes,
        total: vinculacoes.length
      });
    } catch (error) {
      logger.error('❌ Erro no controller ao listar vinculações', 'vinculacao', error);
      res.status(500).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  static async buscarVinculacaoPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const vinculacao = await TurmaDisciplinaProfessorService.buscarVinculacaoPorId(id);

      res.status(200).json({
        sucesso: true,
        mensagem: 'Vinculação encontrada com sucesso',
        dados: vinculacao
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('não encontrada') ? 404 : 500;
      res.status(statusCode).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  static async criarVinculacao(req: Request, res: Response): Promise<void> {
    try {
      const { turma_id, disciplina_id, professor_id } = req.body;

      const novaVinculacao = await TurmaDisciplinaProfessorService.criarVinculacao({
        turma_id,
        disciplina_id,
        professor_id
      });

      res.status(201).json({
        sucesso: true,
        mensagem: 'Vinculação criada com sucesso',
        dados: novaVinculacao
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('já está vinculado') ? 409 : 400;
      res.status(statusCode).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  static async deletarVinculacao(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await TurmaDisciplinaProfessorService.deletarVinculacao(id);

      res.status(200).json({
        sucesso: true,
        mensagem: 'Vinculação deletada com sucesso'
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('não encontrada') ? 404 : 500;
      res.status(statusCode).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }
}

export default TurmaDisciplinaProfessorController;
