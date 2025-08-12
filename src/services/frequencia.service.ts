import * as FrequenciaModel from '../model/frequencia.model';
import { Frequencia } from '../types/models';
import logger from '../utils/logger';

export class FrequenciaService {
  
  static async listarTodas(): Promise<Frequencia[]> {
    try {
      logger.info('Iniciando busca de todas as frequências');
      const frequencias = await FrequenciaModel.listarTodas();
      logger.info(`Encontradas ${frequencias.length} frequências`);
      return frequencias;
    } catch (error) {
      logger.error('Erro ao buscar frequências:', 'FrequenciaService', error);
      throw error;
    }
  }

  static async buscarPorId(frequencia_id: string): Promise<Frequencia | undefined> {
    try {
      logger.info(`Buscando frequência por ID: ${frequencia_id}`);
      const frequencia = await FrequenciaModel.buscarPorId(frequencia_id);
      
      if (!frequencia) {
        logger.warning(`Frequência não encontrada para ID: ${frequencia_id}`);
        return undefined;
      }

      logger.info(`Frequência encontrada para ID: ${frequencia_id}`);
      return frequencia;
    } catch (error) {
      logger.error(`Erro ao buscar frequência por ID ${frequencia_id}:`, 'FrequenciaService', error);
      throw error;
    }
  }

  static async buscarComDetalhes(frequencia_id?: string): Promise<any> {
    try {
      if (frequencia_id) {
        logger.info(`Buscando frequência com detalhes por ID: ${frequencia_id}`);
      } else {
        logger.info('Buscando todas as frequências com detalhes');
      }
      
      const resultado = await FrequenciaModel.buscarComDetalhes(frequencia_id);
      
      if (frequencia_id && !resultado) {
        logger.warning(`Frequência com detalhes não encontrada para ID: ${frequencia_id}`);
        return undefined;
      }

      if (frequencia_id) {
        logger.info(`Frequência com detalhes encontrada para ID: ${frequencia_id}`);
      } else {
        logger.info(`Encontradas ${Array.isArray(resultado) ? resultado.length : 1} frequências com detalhes`);
      }
      
      return resultado;
    } catch (error) {
      logger.error('Erro ao buscar frequências com detalhes:', 'FrequenciaService', error);
      throw error;
    }
  }

  static async buscarPorMatricula(matricula_aluno_id: string): Promise<Frequencia[]> {
    try {
      logger.info(`Buscando frequências por matrícula: ${matricula_aluno_id}`);
      const frequencias = await FrequenciaModel.buscarPorMatricula(matricula_aluno_id);
      logger.info(`Encontradas ${frequencias.length} frequências para matrícula: ${matricula_aluno_id}`);
      return frequencias;
    } catch (error) {
      logger.error(`Erro ao buscar frequências por matrícula ${matricula_aluno_id}:`, 'FrequenciaService', error);
      throw error;
    }
  }

  static async buscarPorAluno(aluno_id: string): Promise<any[]> {
    try {
      logger.info(`Buscando frequências por aluno: ${aluno_id}`);
      const frequencias = await FrequenciaModel.buscarPorAluno(aluno_id);
      logger.info(`Encontradas ${frequencias.length} frequências para aluno: ${aluno_id}`);
      return frequencias;
    } catch (error) {
      logger.error(`Erro ao buscar frequências por aluno ${aluno_id}:`, 'FrequenciaService', error);
      throw error;
    }
  }

  static async buscarPorAula(aula_id: string): Promise<any[]> {
    try {
      logger.info(`Buscando frequências por aula: ${aula_id}`);
      const frequencias = await FrequenciaModel.buscarPorAula(aula_id);
      logger.info(`Encontradas ${frequencias.length} frequências para aula: ${aula_id}`);
      return frequencias;
    } catch (error) {
      logger.error(`Erro ao buscar frequências por aula ${aula_id}:`, 'FrequenciaService', error);
      throw error;
    }
  }

  static async buscarPorTurmaEData(
    turma_id: string, 
    data_aula: string, 
    disciplina_id?: string
  ): Promise<any[]> {
    try {
      logger.info(`Buscando frequências por turma ${turma_id} e data ${data_aula}${disciplina_id ? ` e disciplina ${disciplina_id}` : ''}`);
      const frequencias = await FrequenciaModel.buscarPorTurmaEData(turma_id, data_aula, disciplina_id);
      logger.info(`Encontradas ${frequencias.length} frequências para os critérios informados`);
      return frequencias;
    } catch (error) {
      logger.error(`Erro ao buscar frequências por turma e data:`, 'FrequenciaService', error);
      throw error;
    }
  }

  static async criar(
    frequenciaData: Omit<Frequencia, 'frequencia_id' | 'created_at' | 'updated_at'>
  ): Promise<Frequencia> {
    try {
      logger.info('Iniciando criação de nova frequência');
      
      const novaFrequencia = await FrequenciaModel.criar(frequenciaData);
      
      logger.info(`Frequência criada com sucesso. ID: ${novaFrequencia.frequencia_id}`);
      return novaFrequencia;
    } catch (error) {
      logger.error('Erro ao criar frequência:', 'FrequenciaService', error);
      throw error;
    }
  }

  static async atualizar(
    frequencia_id: string,
    dadosAtualizacao: Partial<Omit<Frequencia, 'frequencia_id' | 'created_at' | 'updated_at'>>
  ): Promise<Frequencia | undefined> {
    try {
      logger.info(`Iniciando atualização da frequência ${frequencia_id}`);
      
      const frequenciaAtualizada = await FrequenciaModel.atualizar(frequencia_id, dadosAtualizacao);
      
      if (!frequenciaAtualizada) {
        logger.warning(`Frequência não encontrada para atualização. ID: ${frequencia_id}`);
        return undefined;
      }

      logger.info(`Frequência ${frequencia_id} atualizada com sucesso`);
      return frequenciaAtualizada;
    } catch (error) {
      logger.error(`Erro ao atualizar frequência ${frequencia_id}:`, 'FrequenciaService', error);
      throw error;
    }
  }

  static async deletar(frequencia_id: string): Promise<boolean> {
    try {
      logger.info(`Iniciando exclusão da frequência ${frequencia_id}`);
      
      const deletado = await FrequenciaModel.deletar(frequencia_id);
      
      if (!deletado) {
        logger.warning(`Frequência não encontrada para exclusão. ID: ${frequencia_id}`);
        return false;
      }

      logger.info(`Frequência ${frequencia_id} excluída com sucesso`);
      return true;
    } catch (error) {
      logger.error(`Erro ao deletar frequência ${frequencia_id}:`, 'FrequenciaService', error);
      throw error;
    }
  }

  static async obterEstatisticasPorAluno(aluno_id: string): Promise<any> {
    try {
      logger.info(`Buscando estatísticas de frequência para aluno: ${aluno_id}`);
      const estatisticas = await FrequenciaModel.obterEstatisticasPorAluno(aluno_id);
      logger.info(`Estatísticas de frequência obtidas para aluno: ${aluno_id}`);
      return estatisticas;
    } catch (error) {
      logger.error(`Erro ao obter estatísticas de frequência para aluno ${aluno_id}:`, 'FrequenciaService', error);
      throw error;
    }
  }

  static async obterEstatisticasPorTurmaDisciplina(
    turma_id: string, 
    disciplina_id: string, 
    data_inicio?: string,
    data_fim?: string
  ): Promise<any> {
    try {
      logger.info(`Buscando estatísticas de frequência para turma ${turma_id} e disciplina ${disciplina_id}`);
      const estatisticas = await FrequenciaModel.obterEstatisticasPorTurmaDisciplina(
        turma_id, 
        disciplina_id, 
        data_inicio,
        data_fim
      );
      logger.info(`Estatísticas de frequência obtidas para turma e disciplina`);
      return estatisticas;
    } catch (error) {
      logger.error(`Erro ao obter estatísticas de frequência para turma e disciplina:`, 'FrequenciaService', error);
      throw error;
    }
  }

  static async registrarFrequenciaLote(
    aula_id: string,
    frequencias: Array<{ matricula_aluno_id: string; presenca: boolean }>
  ): Promise<Frequencia[]> {
    try {
      logger.info(`Registrando frequência em lote para aula ${aula_id}. Total de alunos: ${frequencias.length}`);
      
      const frequenciasRegistradas = await FrequenciaModel.registrarFrequenciaLote(aula_id, frequencias);
      
      logger.info(`Frequência em lote registrada com sucesso para aula ${aula_id}. Total registrado: ${frequenciasRegistradas.length}`);
      return frequenciasRegistradas;
    } catch (error) {
      logger.error(`Erro ao registrar frequência em lote para aula ${aula_id}:`, 'FrequenciaService', error);
      throw error;
    }
  }
}
