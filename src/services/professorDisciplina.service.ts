import * as ProfessorDisciplinaModel from '../model/professorDisciplina.model';
import { Disciplina } from '../types/models';
import logger from '../utils/logger';

class ProfessorDisciplinaService {

  /**
   * Lista as disciplinas que um professor está habilitado a lecionar.
   */
  static async listarDisciplinasDoProfessor(professor_id: string): Promise<Disciplina[]> {
    try {
      if (!professor_id?.trim()) {
        throw new Error('ID do professor é obrigatório');
      }

      logger.info(`📚 Listando disciplinas do professor: ${professor_id}`, 'professor-disciplina');
      const disciplinas = await ProfessorDisciplinaModel.listarDisciplinasDoProfessor(professor_id);
      logger.success(`✅ ${disciplinas.length} disciplinas habilitadas encontradas`, 'professor-disciplina');
      return disciplinas;
    } catch (error) {
      logger.error('❌ Erro ao listar disciplinas do professor', 'professor-disciplina', error);
      if (error instanceof Error) throw error;
      throw new Error('Erro interno ao listar disciplinas do professor');
    }
  }

  /**
   * Lista os ids dos professores que já têm o pacote base completo.
   */
  static async listarProfessoresComPacoteBase(): Promise<string[]> {
    try {
      logger.info('🔍 Listando professores com pacote base completo', 'professor-disciplina');
      return await ProfessorDisciplinaModel.listarProfessoresComPacoteBaseCompleto();
    } catch (error) {
      logger.error('❌ Erro ao listar professores com pacote base', 'professor-disciplina', error);
      if (error instanceof Error) throw error;
      throw new Error('Erro interno ao listar professores com pacote base');
    }
  }

  /**
   * Aplica o pacote de disciplinas base a vários professores de uma vez
   * (adiciona sem remover as disciplinas que eles já têm).
   */
  static async aplicarPacoteBase(professor_ids: string[]): Promise<{
    professores: number;
    disciplinas_base: number;
    vinculos_adicionados: number;
  }> {
    try {
      if (!Array.isArray(professor_ids) || professor_ids.length === 0) {
        throw new Error('Selecione ao menos um professor');
      }

      const baseIds = await ProfessorDisciplinaModel.listarIdsDisciplinasBase();
      if (baseIds.length === 0) {
        throw new Error('Nenhuma disciplina base cadastrada');
      }

      logger.info(
        `📝 Aplicando pacote base (${baseIds.length} disciplinas) a ${professor_ids.length} professores`,
        'professor-disciplina'
      );

      const adicionados = await ProfessorDisciplinaModel.adicionarDisciplinasParaProfessores(
        professor_ids,
        baseIds
      );

      logger.success(`✅ Pacote base aplicado (${adicionados} vínculos criados)`, 'professor-disciplina');

      return {
        professores: professor_ids.length,
        disciplinas_base: baseIds.length,
        vinculos_adicionados: adicionados
      };
    } catch (error) {
      logger.error('❌ Erro ao aplicar pacote base', 'professor-disciplina', error);
      if (error instanceof Error) throw error;
      throw new Error('Erro interno ao aplicar pacote base');
    }
  }

  /**
   * Define (substitui) o conjunto de disciplinas que um professor pode lecionar.
   */
  static async definirDisciplinasDoProfessor(
    professor_id: string,
    disciplina_ids: string[]
  ): Promise<Disciplina[]> {
    try {
      if (!professor_id?.trim()) {
        throw new Error('ID do professor é obrigatório');
      }

      if (!Array.isArray(disciplina_ids)) {
        throw new Error('disciplina_ids deve ser um array');
      }

      logger.info(
        `📝 Definindo ${disciplina_ids.length} disciplinas para o professor: ${professor_id}`,
        'professor-disciplina'
      );

      const disciplinas = await ProfessorDisciplinaModel.definirDisciplinasDoProfessor(
        professor_id,
        disciplina_ids
      );

      logger.success(`✅ Habilitações do professor atualizadas (${disciplinas.length})`, 'professor-disciplina');
      return disciplinas;
    } catch (error) {
      logger.error('❌ Erro ao definir disciplinas do professor', 'professor-disciplina', error);
      if (error instanceof Error) throw error;
      throw new Error('Erro interno ao definir disciplinas do professor');
    }
  }
}

export default ProfessorDisciplinaService;
