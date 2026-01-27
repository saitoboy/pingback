import * as AtividadeModel from '../model/atividade.model';
import { Atividade } from '../types/models';
import logger from '../utils/logger';

export class AtividadeService {
  
  // Listar todas as atividades
  static async listarTodas(): Promise<Atividade[]> {
    try {
      logger.info('🔍 Listando todas as atividades', 'atividade');
      const atividades = await AtividadeModel.listarTodas();
      logger.info(`✅ ${atividades.length} atividades encontradas`, 'atividade');
      return atividades;
    } catch (error) {
      logger.error('❌ Erro ao listar atividades', 'atividade', error);
      throw error;
    }
  }

  // Buscar atividade por ID
  static async buscarPorId(atividade_id: string): Promise<Atividade | undefined> {
    try {
      logger.info(`🔍 Buscando atividade: ${atividade_id}`, 'atividade');
      
      if (!atividade_id?.trim()) {
        throw new Error('ID da atividade é obrigatório');
      }

      const atividade = await AtividadeModel.buscarPorId(atividade_id);
      
      if (atividade) {
        logger.info(`✅ Atividade encontrada: ${atividade.titulo}`, 'atividade');
      } else {
        logger.warning(`⚠️ Atividade não encontrada: ${atividade_id}`, 'atividade');
      }
      
      return atividade;
    } catch (error) {
      logger.error(`❌ Erro ao buscar atividade: ${atividade_id}`, 'atividade', error);
      throw error;
    }
  }

  // Buscar atividades por aula
  static async buscarPorAula(aula_id: string): Promise<Atividade[]> {
    try {
      logger.info(`🔍 Buscando atividades da aula: ${aula_id}`, 'atividade');
      
      if (!aula_id?.trim()) {
        throw new Error('ID da aula é obrigatório');
      }

      const atividades = await AtividadeModel.buscarPorAula(aula_id);
      logger.info(`✅ ${atividades.length} atividades encontradas para a aula`, 'atividade');
      return atividades;
    } catch (error) {
      logger.error(`❌ Erro ao buscar atividades da aula: ${aula_id}`, 'atividade', error);
      throw error;
    }
  }

  // Buscar atividades por vinculação
  static async buscarPorVinculacao(turma_disciplina_professor_id: string): Promise<Atividade[]> {
    try {
      logger.info(`🔍 Buscando atividades da vinculação: ${turma_disciplina_professor_id}`, 'atividade');
      
      if (!turma_disciplina_professor_id?.trim()) {
        throw new Error('ID da vinculação é obrigatório');
      }

      const atividades = await AtividadeModel.buscarPorVinculacao(turma_disciplina_professor_id);
      logger.info(`✅ ${atividades.length} atividades encontradas para a vinculação`, 'atividade');
      return atividades;
    } catch (error) {
      logger.error(`❌ Erro ao buscar atividades da vinculação: ${turma_disciplina_professor_id}`, 'atividade', error);
      throw error;
    }
  }

  // Buscar atividades por período letivo
  static async buscarPorPeriodo(periodo_letivo_id: string): Promise<Atividade[]> {
    try {
      logger.info(`🔍 Buscando atividades do período: ${periodo_letivo_id}`, 'atividade');
      
      if (!periodo_letivo_id?.trim()) {
        throw new Error('ID do período letivo é obrigatório');
      }

      const atividades = await AtividadeModel.buscarPorPeriodo(periodo_letivo_id);
      logger.info(`✅ ${atividades.length} atividades encontradas para o período`, 'atividade');
      return atividades;
    } catch (error) {
      logger.error(`❌ Erro ao buscar atividades do período: ${periodo_letivo_id}`, 'atividade', error);
      throw error;
    }
  }

  // Buscar atividades que valem nota
  static async buscarQueValemNota(turma_disciplina_professor_id?: string): Promise<Atividade[]> {
    try {
      logger.info('🔍 Buscando atividades avaliativas', 'atividade');
      const atividades = await AtividadeModel.buscarQueValemNota(turma_disciplina_professor_id);
      logger.info(`✅ ${atividades.length} atividades avaliativas encontradas`, 'atividade');
      return atividades;
    } catch (error) {
      logger.error('❌ Erro ao buscar atividades avaliativas', 'atividade', error);
      throw error;
    }
  }

  // Criar nova atividade
  static async criar(dadosAtividade: Omit<Atividade, 'atividade_id' | 'created_at' | 'updated_at'> & { data_aula?: Date | string }): Promise<Atividade> {
    try {
      logger.info(`➕ Criando nova atividade: ${dadosAtividade.titulo}`, 'atividade');

      // Validações básicas
      if (!dadosAtividade.titulo?.trim()) {
        throw new Error('Título da atividade é obrigatório');
      }

      if (!dadosAtividade.descricao?.trim()) {
        throw new Error('Descrição da atividade é obrigatória');
      }

      // aula_id agora é opcional, mas precisa ter data_aula ou aula_id
      if (!dadosAtividade.aula_id?.trim() && !dadosAtividade.data_aula) {
        throw new Error('É necessário fornecer aula_id ou data_aula');
      }

      if (!dadosAtividade.turma_disciplina_professor_id?.trim()) {
        throw new Error('ID da vinculação é obrigatório');
      }

      if (!dadosAtividade.periodo_letivo_id?.trim()) {
        throw new Error('ID do período letivo é obrigatório');
      }

      if (dadosAtividade.peso <= 0) {
        throw new Error('Peso da atividade deve ser maior que zero');
      }

      if (dadosAtividade.titulo.length > 255) {
        throw new Error('Título não pode ter mais de 255 caracteres');
      }

      // Converter data_aula string (YYYY-MM-DD) para Date no timezone local
      let dataAulaDate: Date | undefined = undefined;
      if (dadosAtividade.data_aula) {
        // Se for string no formato YYYY-MM-DD, criar data no timezone local
        const dataAulaValue = dadosAtividade.data_aula as any;
        if (typeof dataAulaValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dataAulaValue)) {
          const [ano, mes, dia] = dataAulaValue.split('-').map(Number);
          dataAulaDate = new Date(ano, mes - 1, dia, 0, 0, 0, 0);
        } else if (dataAulaValue instanceof Date) {
          dataAulaDate = dataAulaValue;
        } else {
          dataAulaDate = new Date(dataAulaValue);
        }
      }

      const novaAtividade = await AtividadeModel.criar({
        ...dadosAtividade,
        data_aula: dataAulaDate
      });
      logger.info(`✅ Atividade criada com sucesso: ${novaAtividade.atividade_id}`, 'atividade');
      return novaAtividade;
    } catch (error) {
      logger.error(`❌ Erro ao criar atividade: ${dadosAtividade.titulo}`, 'atividade', error);
      throw error;
    }
  }

  // Atualizar atividade
  static async atualizar(
    atividade_id: string,
    dadosAtualizacao: Partial<Omit<Atividade, 'atividade_id' | 'created_at' | 'updated_at'>>
  ): Promise<Atividade | undefined> {
    try {
      logger.info(`📝 Atualizando atividade: ${atividade_id}`, 'atividade');

      if (!atividade_id?.trim()) {
        throw new Error('ID da atividade é obrigatório');
      }

      // Verificar se a atividade existe
      const atividadeExistente = await AtividadeModel.buscarPorId(atividade_id);
      if (!atividadeExistente) {
        throw new Error('Atividade não encontrada');
      }

      // Validações dos campos atualizados
      if (dadosAtualizacao.titulo !== undefined && !dadosAtualizacao.titulo.trim()) {
        throw new Error('Título da atividade não pode ser vazio');
      }

      if (dadosAtualizacao.descricao !== undefined && !dadosAtualizacao.descricao.trim()) {
        throw new Error('Descrição da atividade não pode ser vazia');
      }

      if (dadosAtualizacao.titulo && dadosAtualizacao.titulo.length > 255) {
        throw new Error('Título não pode ter mais de 255 caracteres');
      }

      const atividadeAtualizada = await AtividadeModel.atualizar(atividade_id, dadosAtualizacao);
      logger.info(`✅ Atividade atualizada com sucesso: ${atividade_id}`, 'atividade');
      return atividadeAtualizada;
    } catch (error) {
      logger.error(`❌ Erro ao atualizar atividade: ${atividade_id}`, 'atividade', error);
      throw error;
    }
  }

  // Deletar atividade
  static async deletar(atividade_id: string): Promise<boolean> {
    try {
      logger.info(`🗑️ Deletando atividade: ${atividade_id}`, 'atividade');

      if (!atividade_id?.trim()) {
        throw new Error('ID da atividade é obrigatório');
      }

      // Verificar se a atividade existe
      const atividadeExistente = await AtividadeModel.buscarPorId(atividade_id);
      if (!atividadeExistente) {
        throw new Error('Atividade não encontrada');
      }

      const resultado = await AtividadeModel.deletar(atividade_id);
      
      if (resultado) {
        logger.info(`✅ Atividade deletada com sucesso: ${atividade_id}`, 'atividade');
      } else {
        logger.warning(`⚠️ Nenhuma atividade foi deletada: ${atividade_id}`, 'atividade');
      }

      return resultado;
    } catch (error) {
      logger.error(`❌ Erro ao deletar atividade: ${atividade_id}`, 'atividade', error);
      throw error;
    }
  }

  // Buscar atividades com detalhes
  static async buscarComDetalhes(atividade_id?: string): Promise<any> {
    try {
      if (atividade_id) {
        logger.info(`🔍 Buscando atividade com detalhes: ${atividade_id}`, 'atividade');
      } else {
        logger.info('🔍 Listando atividades com detalhes', 'atividade');
      }

      const resultado = await AtividadeModel.buscarComDetalhes(atividade_id);
      
      if (atividade_id) {
        if (resultado) {
          logger.info(`✅ Atividade encontrada com detalhes: ${resultado.titulo}`, 'atividade');
        } else {
          logger.warning(`⚠️ Atividade não encontrada: ${atividade_id}`, 'atividade');
        }
      } else {
        logger.info(`✅ ${Array.isArray(resultado) ? resultado.length : 0} atividades encontradas com detalhes`, 'atividade');
      }

      return resultado;
    } catch (error) {
      logger.error('❌ Erro ao buscar atividades com detalhes', 'atividade', error);
      throw error;
    }
  }

  // Verificar acesso do professor à atividade
  static async verificarAcessoProfessor(atividade_id: string, professor_id: string): Promise<boolean> {
    try {
      return await AtividadeModel.verificarAcessoProfessor(atividade_id, professor_id);
    } catch (error) {
      logger.error(`❌ Erro ao verificar acesso do professor à atividade: ${atividade_id}`, 'atividade', error);
      throw error;
    }
  }

  // Estatísticas por professor
  static async estatisticasPorProfessor(professor_id: string): Promise<any> {
    try {
      logger.info(`📊 Buscando estatísticas de atividades do professor: ${professor_id}`, 'atividade');
      
      if (!professor_id?.trim()) {
        throw new Error('ID do professor é obrigatório');
      }

      const estatisticas = await AtividadeModel.estatisticasPorProfessor(professor_id);
      logger.info(`✅ Estatísticas obtidas para o professor: ${professor_id}`, 'atividade');
      return estatisticas;
    } catch (error) {
      logger.error(`❌ Erro ao buscar estatísticas do professor: ${professor_id}`, 'atividade', error);
      throw error;
    }
  }

  // NOVO: Buscar atividades por data e vinculação
  static async buscarPorDataEVinculacao(
    turma_disciplina_professor_id: string,
    data_aula: string
  ): Promise<Atividade[]> {
    try {
      logger.info(`🔍 Buscando atividades da vinculação ${turma_disciplina_professor_id} e data ${data_aula}`, 'atividade');
      
      if (!turma_disciplina_professor_id?.trim()) {
        throw new Error('ID da vinculação é obrigatório');
      }

      if (!data_aula?.trim()) {
        throw new Error('Data da aula é obrigatória');
      }

      const atividades = await AtividadeModel.buscarPorDataEVinculacao(turma_disciplina_professor_id, data_aula);
      logger.info(`✅ ${atividades.length} atividades encontradas para a data`, 'atividade');
      return atividades;
    } catch (error) {
      logger.error(`❌ Erro ao buscar atividades por data e vinculação:`, 'atividade', error);
      throw error;
    }
  }
}
