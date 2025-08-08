import * as TurmaDisciplinaProfessorModel from '../model/turmaDisciplinaProfessor.model';
import { TurmaDisciplinaProfessor } from '../types/models';
import logger from '../utils/logger';

class TurmaDisciplinaProfessorService {

  static async listarVinculacoes(): Promise<any[]> {
    try {
      logger.info('📚 Listando vinculações professor-turma-disciplina', 'vinculacao');
      const vinculacoes = await TurmaDisciplinaProfessorModel.buscarComDetalhes();
      logger.success(`✅ ${vinculacoes.length} vinculações encontradas`, 'vinculacao');
      return vinculacoes;
    } catch (error) {
      logger.error('❌ Erro ao listar vinculações', 'vinculacao', error);
      throw new Error('Erro interno ao listar vinculações');
    }
  }

  static async buscarVinculacaoPorId(id: string): Promise<any> {
    try {
      if (!id?.trim()) {
        throw new Error('ID da vinculação é obrigatório');
      }

      logger.info(`🔍 Buscando vinculação: ${id}`, 'vinculacao');
      const vinculacao = await TurmaDisciplinaProfessorModel.buscarComDetalhes(id);

      if (!vinculacao) {
        throw new Error('Vinculação não encontrada');
      }

      logger.success(`✅ Vinculação encontrada`, 'vinculacao');
      return vinculacao;
    } catch (error) {
      logger.error('❌ Erro ao buscar vinculação', 'vinculacao', error);
      if (error instanceof Error) throw error;
      throw new Error('Erro interno ao buscar vinculação');
    }
  }

  static async criarVinculacao(dados: {
    turma_id: string;
    disciplina_id: string;
    professor_id: string;
  }): Promise<TurmaDisciplinaProfessor> {
    try {
      if (!dados.turma_id?.trim()) throw new Error('ID da turma é obrigatório');
      if (!dados.disciplina_id?.trim()) throw new Error('ID da disciplina é obrigatório');
      if (!dados.professor_id?.trim()) throw new Error('ID do professor é obrigatório');

      logger.info('📝 Criando vinculação professor-turma-disciplina', 'vinculacao');
      
      const novaVinculacao = await TurmaDisciplinaProfessorModel.criar(dados);

      logger.success('🎉 Vinculação criada com sucesso', 'vinculacao');
      return novaVinculacao;

    } catch (error) {
      logger.error('❌ Erro ao criar vinculação', 'vinculacao', error);
      if (error instanceof Error) throw error;
      throw new Error('Erro interno ao criar vinculação');
    }
  }

  static async deletarVinculacao(id: string): Promise<void> {
    try {
      if (!id?.trim()) {
        throw new Error('ID da vinculação é obrigatório');
      }

      await this.buscarVinculacaoPorId(id);

      logger.info(`🗑️ Deletando vinculação: ${id}`, 'vinculacao');
      
      const sucesso = await TurmaDisciplinaProfessorModel.deletar(id);

      if (!sucesso) {
        throw new Error('Falha ao deletar vinculação');
      }

      logger.success('✅ Vinculação deletada com sucesso', 'vinculacao');

    } catch (error) {
      logger.error('❌ Erro ao deletar vinculação', 'vinculacao', error);
      if (error instanceof Error) throw error;
      throw new Error('Erro interno ao deletar vinculação');
    }
  }
}

export default TurmaDisciplinaProfessorService;
