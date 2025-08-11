import * as AulaModel from '../model/aula.model';
import { Aula } from '../types/models';
import logger from '../utils/logger';

class AulaService {

  /**
   * Listar todas as aulas com detalhes
   */
  static async listarAulas(): Promise<any[]> {
    try {
      logger.info('📚 Listando aulas', 'aula');
      const aulas = await AulaModel.buscarComDetalhes();
      logger.success(`✅ ${Array.isArray(aulas) ? aulas.length : 0} aulas encontradas`, 'aula');
      return Array.isArray(aulas) ? aulas : [];
    } catch (error) {
      logger.error('❌ Erro ao listar aulas', 'aula', error);
      throw new Error('Erro interno ao listar aulas');
    }
  }

  /**
   * Buscar aula por ID
   */
  static async buscarAulaPorId(aula_id: string): Promise<any> {
    try {
      if (!aula_id?.trim()) {
        throw new Error('ID da aula é obrigatório');
      }

      logger.info(`🔍 Buscando aula: ${aula_id}`, 'aula');
      const aula = await AulaModel.buscarComDetalhes(aula_id);

      if (!aula) {
        logger.warning(`⚠️ Aula não encontrada: ${aula_id}`, 'aula');
        throw new Error('Aula não encontrada');
      }

      logger.success(`✅ Aula encontrada: ${aula.data_aula}`, 'aula');
      return aula;
    } catch (error) {
      logger.error('❌ Erro ao buscar aula por ID', 'aula', error);
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno ao buscar aula');
    }
  }

  /**
   * Buscar aulas por vinculação
   */
  static async buscarAulasPorVinculacao(turma_disciplina_professor_id: string): Promise<Aula[]> {
    try {
      if (!turma_disciplina_professor_id?.trim()) {
        throw new Error('ID da vinculação é obrigatório');
      }

      logger.info(`🔍 Buscando aulas da vinculação: ${turma_disciplina_professor_id}`, 'aula');
      const aulas = await AulaModel.buscarPorVinculacao(turma_disciplina_professor_id);
      
      logger.success(`✅ ${aulas.length} aulas encontradas para a vinculação`, 'aula');
      return aulas;
    } catch (error) {
      logger.error('❌ Erro ao buscar aulas por vinculação', 'aula', error);
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno ao buscar aulas por vinculação');
    }
  }

  /**
   * Buscar aulas por data
   */
  static async buscarAulasPorData(data_aula: string): Promise<Aula[]> {
    try {
      if (!data_aula?.trim()) {
        throw new Error('Data da aula é obrigatória');
      }

      // Validar formato da data (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(data_aula)) {
        throw new Error('Data deve estar no formato YYYY-MM-DD');
      }

      logger.info(`🔍 Buscando aulas da data: ${data_aula}`, 'aula');
      const aulas = await AulaModel.buscarPorData(data_aula);
      
      logger.success(`✅ ${aulas.length} aulas encontradas para a data`, 'aula');
      return aulas;
    } catch (error) {
      logger.error('❌ Erro ao buscar aulas por data', 'aula', error);
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno ao buscar aulas por data');
    }
  }

  /**
   * Criar nova aula
   */
  static async criarAula(dadosAula: {
    turma_disciplina_professor_id: string;
    data_aula: string;
    hora_inicio: string;
    hora_fim: string;
  }): Promise<Aula> {
    try {
      // Validações
      if (!dadosAula.turma_disciplina_professor_id?.trim()) {
        throw new Error('ID da vinculação é obrigatório');
      }

      if (!dadosAula.data_aula?.trim()) {
        throw new Error('Data da aula é obrigatória');
      }

      if (!dadosAula.hora_inicio?.trim()) {
        throw new Error('Hora de início é obrigatória');
      }

      if (!dadosAula.hora_fim?.trim()) {
        throw new Error('Hora de fim é obrigatória');
      }

      // Validar formato da data
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dadosAula.data_aula)) {
        throw new Error('Data deve estar no formato YYYY-MM-DD');
      }

      // Validar formato do horário (HH:MM)
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(dadosAula.hora_inicio)) {
        throw new Error('Hora de início deve estar no formato HH:MM');
      }

      if (!timeRegex.test(dadosAula.hora_fim)) {
        throw new Error('Hora de fim deve estar no formato HH:MM');
      }

      // Validar se hora fim é posterior à hora início
      if (dadosAula.hora_inicio >= dadosAula.hora_fim) {
        throw new Error('Hora de fim deve ser posterior à hora de início');
      }

      // Validar se a data não é passada (opcional - depende da regra de negócio)
      const dataAula = new Date(dadosAula.data_aula);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      if (dataAula < hoje) {
        throw new Error('Não é possível criar aulas para datas passadas');
      }

      logger.info(`📝 Criando aula: ${dadosAula.data_aula} ${dadosAula.hora_inicio}-${dadosAula.hora_fim}`, 'aula');
      
      const novaAula = await AulaModel.criar({
        turma_disciplina_professor_id: dadosAula.turma_disciplina_professor_id.trim(),
        data_aula: new Date(dadosAula.data_aula),
        hora_inicio: dadosAula.hora_inicio.trim(),
        hora_fim: dadosAula.hora_fim.trim()
      });

      logger.success(`🎉 Aula criada com sucesso: ${novaAula.data_aula}`, 'aula');
      return novaAula;

    } catch (error) {
      logger.error('❌ Erro ao criar aula', 'aula', error);
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno ao criar aula');
    }
  }

  /**
   * Atualizar aula existente
   */
  static async atualizarAula(
    aula_id: string,
    dadosAtualizacao: { data_aula?: string; hora_inicio?: string; hora_fim?: string }
  ): Promise<Aula> {
    try {
      if (!aula_id?.trim()) {
        throw new Error('ID da aula é obrigatório');
      }

      // Verificar se aula existe
      await this.buscarAulaPorId(aula_id);

      // Validações dos dados
      const dadosConvertidos: any = {};

      if (dadosAtualizacao.data_aula !== undefined) {
        if (!dadosAtualizacao.data_aula.trim()) {
          throw new Error('Data da aula é obrigatória');
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dadosAtualizacao.data_aula)) {
          throw new Error('Data deve estar no formato YYYY-MM-DD');
        }

        dadosConvertidos.data_aula = new Date(dadosAtualizacao.data_aula);
      }

      if (dadosAtualizacao.hora_inicio !== undefined) {
        if (!dadosAtualizacao.hora_inicio.trim()) {
          throw new Error('Hora de início é obrigatória');
        }

        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(dadosAtualizacao.hora_inicio)) {
          throw new Error('Hora de início deve estar no formato HH:MM');
        }

        dadosConvertidos.hora_inicio = dadosAtualizacao.hora_inicio.trim();
      }

      if (dadosAtualizacao.hora_fim !== undefined) {
        if (!dadosAtualizacao.hora_fim.trim()) {
          throw new Error('Hora de fim é obrigatória');
        }

        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(dadosAtualizacao.hora_fim)) {
          throw new Error('Hora de fim deve estar no formato HH:MM');
        }

        dadosConvertidos.hora_fim = dadosAtualizacao.hora_fim.trim();
      }

      logger.info(`📝 Atualizando aula: ${aula_id}`, 'aula');
      
      const aulaAtualizada = await AulaModel.atualizar(aula_id, dadosConvertidos);

      if (!aulaAtualizada) {
        throw new Error('Falha ao atualizar aula');
      }

      logger.success(`✅ Aula atualizada: ${aulaAtualizada.data_aula}`, 'aula');
      return aulaAtualizada;

    } catch (error) {
      logger.error('❌ Erro ao atualizar aula', 'aula', error);
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno ao atualizar aula');
    }
  }

  /**
   * Deletar aula
   */
  static async deletarAula(aula_id: string): Promise<void> {
    try {
      if (!aula_id?.trim()) {
        throw new Error('ID da aula é obrigatório');
      }

      // Verificar se aula existe
      const aula = await this.buscarAulaPorId(aula_id);

      logger.info(`🗑️ Deletando aula: ${aula.data_aula}`, 'aula');
      
      const sucesso = await AulaModel.deletar(aula_id);

      if (!sucesso) {
        throw new Error('Falha ao deletar aula');
      }

      logger.success(`✅ Aula deletada: ${aula.data_aula}`, 'aula');

    } catch (error) {
      logger.error('❌ Erro ao deletar aula', 'aula', error);
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno ao deletar aula');
    }
  }

  /**
   * Verificar se professor tem acesso a aula
   */
  static async verificarAcessoProfessor(aula_id: string, professor_id: string): Promise<boolean> {
    try {
      if (!aula_id?.trim() || !professor_id?.trim()) {
        return false;
      }

      logger.info(`🔐 Verificando acesso do professor ${professor_id} à aula ${aula_id}`, 'aula');
      
      const temAcesso = await AulaModel.verificarAcessoProfessor(aula_id, professor_id);
      
      logger.info(`${temAcesso ? '✅ Acesso permitido' : '❌ Acesso negado'}`, 'aula');
      
      return temAcesso;
    } catch (error) {
      logger.error('❌ Erro ao verificar acesso do professor', 'aula', error);
      return false;
    }
  }
}

export default AulaService;
