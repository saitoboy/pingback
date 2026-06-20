import { Request, Response } from 'express';
import ProfessorDisciplinaService from '../services/professorDisciplina.service';
import { logError } from '../utils/logger';

/**
 * Controller para gerenciar a habilitação de professores em disciplinas
 * (quais disciplinas cada professor pode lecionar).
 */
class ProfessorDisciplinaController {

  /**
   * Lista as disciplinas que um professor está habilitado a lecionar
   * GET /professor-disciplina/professor/:professor_id
   */
  static async listarDisciplinasDoProfessor(req: Request, res: Response): Promise<void> {
    try {
      const { professor_id } = req.params;

      const disciplinas = await ProfessorDisciplinaService.listarDisciplinasDoProfessor(professor_id);

      res.status(200).json({
        status: 'sucesso',
        mensagem: 'Disciplinas do professor listadas com sucesso',
        dados: disciplinas,
        total: disciplinas.length
      });
    } catch (error: any) {
      logError('Erro ao listar disciplinas do professor', 'controller', error);
      res.status(error.message?.includes('obrigatório') ? 400 : 500).json({
        status: 'erro',
        mensagem: error.message || 'Erro ao listar disciplinas do professor'
      });
    }
  }

  /**
   * Lista os ids dos professores que já têm o pacote base completo
   * GET /professor-disciplina/status-pacote-base
   */
  static async listarProfessoresComPacoteBase(_req: Request, res: Response): Promise<void> {
    try {
      const professor_ids = await ProfessorDisciplinaService.listarProfessoresComPacoteBase();

      res.status(200).json({
        status: 'sucesso',
        mensagem: 'Professores com pacote base listados com sucesso',
        dados: professor_ids
      });
    } catch (error: any) {
      logError('Erro ao listar professores com pacote base', 'controller', error);
      res.status(500).json({
        status: 'erro',
        mensagem: error.message || 'Erro ao listar professores com pacote base'
      });
    }
  }

  /**
   * Aplica o pacote de disciplinas base a vários professores de uma vez
   * POST /professor-disciplina/aplicar-base
   * body: { professor_ids: string[] }
   */
  static async aplicarPacoteBase(req: Request, res: Response): Promise<void> {
    try {
      const { professor_ids } = req.body;

      const resultado = await ProfessorDisciplinaService.aplicarPacoteBase(professor_ids);

      res.status(200).json({
        status: 'sucesso',
        mensagem: 'Pacote base aplicado com sucesso',
        dados: resultado
      });
    } catch (error: any) {
      logError('Erro ao aplicar pacote base', 'controller', error);
      res.status(
        error.message?.includes('Selecione') || error.message?.includes('Nenhuma') ? 400 : 500
      ).json({
        status: 'erro',
        mensagem: error.message || 'Erro ao aplicar pacote base'
      });
    }
  }

  /**
   * Define (substitui) o conjunto de disciplinas de um professor
   * PUT /professor-disciplina/professor/:professor_id
   * body: { disciplina_ids: string[] }
   */
  static async definirDisciplinasDoProfessor(req: Request, res: Response): Promise<void> {
    try {
      const { professor_id } = req.params;
      const { disciplina_ids } = req.body;

      const disciplinas = await ProfessorDisciplinaService.definirDisciplinasDoProfessor(
        professor_id,
        disciplina_ids
      );

      res.status(200).json({
        status: 'sucesso',
        mensagem: 'Disciplinas do professor atualizadas com sucesso',
        dados: disciplinas,
        total: disciplinas.length
      });
    } catch (error: any) {
      logError('Erro ao definir disciplinas do professor', 'controller', error);
      res.status(
        error.message?.includes('obrigatório') || error.message?.includes('array') ? 400 : 500
      ).json({
        status: 'erro',
        mensagem: error.message || 'Erro ao definir disciplinas do professor'
      });
    }
  }
}

export default ProfessorDisciplinaController;
