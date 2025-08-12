import * as MediaDisciplinaBimestreModel from '../model/mediaDisciplinaBimestre.model';
import { MediaDisciplinaBimestre } from '../types/models';
import logger from '../utils/logger';

export class MediaDisciplinaBimestreService {
  
  // Listar todas as médias
  static async listarTodas(): Promise<MediaDisciplinaBimestre[]> {
    try {
      logger.info('🔍 Listando todas as médias de disciplina por bimestre', 'media-disciplina-bimestre');
      const medias = await MediaDisciplinaBimestreModel.listarTodas();
      logger.info(`✅ ${medias.length} médias encontradas`, 'media-disciplina-bimestre');
      return medias;
    } catch (error) {
      logger.error('❌ Erro ao listar médias de disciplina por bimestre', 'media-disciplina-bimestre', error);
      throw error;
    }
  }

  // Buscar média por ID
  static async buscarPorId(media_disciplina_bimestre_id: string): Promise<MediaDisciplinaBimestre | undefined> {
    try {
      logger.info(`🔍 Buscando média de disciplina por bimestre: ${media_disciplina_bimestre_id}`, 'media-disciplina-bimestre');
      
      if (!media_disciplina_bimestre_id?.trim()) {
        throw new Error('ID da média é obrigatório');
      }

      const media = await MediaDisciplinaBimestreModel.buscarPorId(media_disciplina_bimestre_id);
      
      if (media) {
        logger.info(`✅ Média encontrada: ID ${media.media_disciplina_bimestre_id}`, 'media-disciplina-bimestre');
      } else {
        logger.warning(`⚠️ Média não encontrada: ${media_disciplina_bimestre_id}`, 'media-disciplina-bimestre');
      }
      
      return media;
    } catch (error) {
      logger.error(`❌ Erro ao buscar média: ${media_disciplina_bimestre_id}`, 'media-disciplina-bimestre', error);
      throw error;
    }
  }

  // Buscar médias com detalhes
  static async buscarComDetalhes(media_disciplina_bimestre_id?: string): Promise<any> {
    try {
      if (media_disciplina_bimestre_id) {
        logger.info(`🔍 Buscando média com detalhes: ${media_disciplina_bimestre_id}`, 'media-disciplina-bimestre');
        const media = await MediaDisciplinaBimestreModel.buscarComDetalhes(media_disciplina_bimestre_id);
        if (media) {
          logger.info(`✅ Média com detalhes encontrada: ID ${media_disciplina_bimestre_id}`, 'media-disciplina-bimestre');
        } else {
          logger.warning(`⚠️ Média com detalhes não encontrada: ${media_disciplina_bimestre_id}`, 'media-disciplina-bimestre');
        }
        return media;
      } else {
        logger.info('🔍 Listando todas as médias com detalhes', 'media-disciplina-bimestre');
        const medias = await MediaDisciplinaBimestreModel.buscarComDetalhes();
        logger.info(`✅ ${medias.length} médias com detalhes encontradas`, 'media-disciplina-bimestre');
        return medias;
      }
    } catch (error) {
      logger.error('❌ Erro ao buscar médias com detalhes', 'media-disciplina-bimestre', error);
      throw error;
    }
  }

  // Buscar médias por matrícula
  static async buscarPorMatricula(matricula_aluno_id: string): Promise<any[]> {
    try {
      logger.info(`🔍 Buscando médias da matrícula: ${matricula_aluno_id}`, 'media-disciplina-bimestre');
      
      if (!matricula_aluno_id?.trim()) {
        throw new Error('ID da matrícula é obrigatório');
      }

      const medias = await MediaDisciplinaBimestreModel.buscarPorMatricula(matricula_aluno_id);
      logger.info(`✅ ${medias.length} médias encontradas para a matrícula`, 'media-disciplina-bimestre');
      
      return medias;
    } catch (error) {
      logger.error(`❌ Erro ao buscar médias da matrícula: ${matricula_aluno_id}`, 'media-disciplina-bimestre', error);
      throw error;
    }
  }

  // Buscar médias por aluno
  static async buscarPorAluno(aluno_id: string): Promise<any[]> {
    try {
      logger.info(`🔍 Buscando médias do aluno: ${aluno_id}`, 'media-disciplina-bimestre');
      
      if (!aluno_id?.trim()) {
        throw new Error('ID do aluno é obrigatório');
      }

      const medias = await MediaDisciplinaBimestreModel.buscarPorAluno(aluno_id);
      logger.info(`✅ ${medias.length} médias encontradas para o aluno`, 'media-disciplina-bimestre');
      
      return medias;
    } catch (error) {
      logger.error(`❌ Erro ao buscar médias do aluno: ${aluno_id}`, 'media-disciplina-bimestre', error);
      throw error;
    }
  }

  // Buscar médias por turma e disciplina
  static async buscarPorTurmaEDisciplina(
    turma_id: string, 
    disciplina_id: string, 
    periodo_letivo_id?: string
  ): Promise<any[]> {
    try {
      const logMessage = periodo_letivo_id 
        ? `🔍 Buscando médias da turma ${turma_id} e disciplina ${disciplina_id} no período ${periodo_letivo_id}`
        : `🔍 Buscando médias da turma ${turma_id} e disciplina ${disciplina_id}`;
      
      logger.info(logMessage, 'media-disciplina-bimestre');
      
      if (!turma_id?.trim()) {
        throw new Error('ID da turma é obrigatório');
      }
      
      if (!disciplina_id?.trim()) {
        throw new Error('ID da disciplina é obrigatório');
      }

      const medias = await MediaDisciplinaBimestreModel.buscarPorTurmaEDisciplina(
        turma_id, 
        disciplina_id,
        periodo_letivo_id
      );
      logger.info(`✅ ${medias.length} médias encontradas para a turma e disciplina`, 'media-disciplina-bimestre');
      
      return medias;
    } catch (error) {
      logger.error(`❌ Erro ao buscar médias da turma e disciplina`, 'media-disciplina-bimestre', error);
      throw error;
    }
  }

  // Buscar médias por período letivo
  static async buscarPorPeriodoLetivo(periodo_letivo_id: string): Promise<any[]> {
    try {
      logger.info(`🔍 Buscando médias do período letivo: ${periodo_letivo_id}`, 'media-disciplina-bimestre');
      
      if (!periodo_letivo_id?.trim()) {
        throw new Error('ID do período letivo é obrigatório');
      }

      const medias = await MediaDisciplinaBimestreModel.buscarPorPeriodoLetivo(periodo_letivo_id);
      logger.info(`✅ ${medias.length} médias encontradas para o período letivo`, 'media-disciplina-bimestre');
      
      return medias;
    } catch (error) {
      logger.error(`❌ Erro ao buscar médias do período letivo: ${periodo_letivo_id}`, 'media-disciplina-bimestre', error);
      throw error;
    }
  }

  // Criar nova média
  static async criar(dadosMedia: Omit<MediaDisciplinaBimestre, 'media_disciplina_bimestre_id' | 'created_at' | 'updated_at'>): Promise<MediaDisciplinaBimestre> {
    try {
      logger.info('📝 Criando nova média de disciplina por bimestre', 'media-disciplina-bimestre');

      // Validações
      await this.validarDadosMedia(dadosMedia);

      // Verificar se já existe média para essa combinação
      const jaExiste = await MediaDisciplinaBimestreModel.verificarExistenciaPorChaveUnica(
        dadosMedia.matricula_aluno_id,
        dadosMedia.turma_disciplina_professor_id,
        dadosMedia.periodo_letivo_id
      );

      if (jaExiste) {
        throw new Error('Já existe uma média para esta combinação de matrícula, turma-disciplina-professor e período letivo');
      }

      const mediaCriada = await MediaDisciplinaBimestreModel.criar(dadosMedia);
      logger.info(`✅ Média criada com sucesso: ID ${mediaCriada.media_disciplina_bimestre_id}`, 'media-disciplina-bimestre');
      
      return mediaCriada;
    } catch (error) {
      logger.error('❌ Erro ao criar média de disciplina por bimestre', 'media-disciplina-bimestre', error);
      throw error;
    }
  }

  // Atualizar média
  static async atualizar(
    media_disciplina_bimestre_id: string,
    dadosAtualizacao: Partial<Omit<MediaDisciplinaBimestre, 'media_disciplina_bimestre_id' | 'created_at' | 'updated_at'>>
  ): Promise<MediaDisciplinaBimestre> {
    try {
      logger.info(`📝 Atualizando média: ${media_disciplina_bimestre_id}`, 'media-disciplina-bimestre');

      if (!media_disciplina_bimestre_id?.trim()) {
        throw new Error('ID da média é obrigatório');
      }

      // Verificar se a média existe
      const mediaExistente = await this.buscarPorId(media_disciplina_bimestre_id);
      if (!mediaExistente) {
        throw new Error('Média não encontrada');
      }

      // Validar dados se fornecidos
      if (Object.keys(dadosAtualizacao).length > 0) {
        await this.validarDadosMedia(dadosAtualizacao, true);

        // Verificar unicidade se os campos únicos foram alterados
        if (dadosAtualizacao.matricula_aluno_id || dadosAtualizacao.turma_disciplina_professor_id || dadosAtualizacao.periodo_letivo_id) {
          
          const matriculaId = dadosAtualizacao.matricula_aluno_id || mediaExistente.matricula_aluno_id;
          const turmaDisciplinaProfessorId = dadosAtualizacao.turma_disciplina_professor_id || mediaExistente.turma_disciplina_professor_id;
          const periodoLetivoId = dadosAtualizacao.periodo_letivo_id || mediaExistente.periodo_letivo_id;

          const jaExiste = await MediaDisciplinaBimestreModel.verificarExistenciaPorChaveUnica(
            matriculaId,
            turmaDisciplinaProfessorId,
            periodoLetivoId,
            media_disciplina_bimestre_id
          );

          if (jaExiste) {
            throw new Error('Já existe uma média para esta combinação de matrícula, turma-disciplina-professor e período letivo');
          }
        }
      }

      const mediaAtualizada = await MediaDisciplinaBimestreModel.atualizar(media_disciplina_bimestre_id, dadosAtualizacao);
      
      if (!mediaAtualizada) {
        throw new Error('Erro ao atualizar média');
      }
      
      logger.info(`✅ Média atualizada com sucesso: ID ${media_disciplina_bimestre_id}`, 'media-disciplina-bimestre');
      
      return mediaAtualizada;
    } catch (error) {
      logger.error(`❌ Erro ao atualizar média: ${media_disciplina_bimestre_id}`, 'media-disciplina-bimestre', error);
      throw error;
    }
  }

  // Deletar média
  static async deletar(media_disciplina_bimestre_id: string): Promise<void> {
    try {
      logger.info(`🗑️ Deletando média: ${media_disciplina_bimestre_id}`, 'media-disciplina-bimestre');

      if (!media_disciplina_bimestre_id?.trim()) {
        throw new Error('ID da média é obrigatório');
      }

      // Verificar se a média existe
      const mediaExistente = await this.buscarPorId(media_disciplina_bimestre_id);
      if (!mediaExistente) {
        throw new Error('Média não encontrada');
      }

      const deletado = await MediaDisciplinaBimestreModel.deletar(media_disciplina_bimestre_id);
      if (!deletado) {
        throw new Error('Erro ao deletar média');
      }

      logger.info(`✅ Média deletada com sucesso: ID ${media_disciplina_bimestre_id}`, 'media-disciplina-bimestre');
    } catch (error) {
      logger.error(`❌ Erro ao deletar média: ${media_disciplina_bimestre_id}`, 'media-disciplina-bimestre', error);
      throw error;
    }
  }

  // Obter estatísticas por aluno
  static async obterEstatisticasPorAluno(aluno_id: string): Promise<any> {
    try {
      logger.info(`📊 Obtendo estatísticas do aluno ${aluno_id}`, 'media-disciplina-bimestre');
      
      if (!aluno_id?.trim()) {
        throw new Error('ID do aluno é obrigatório');
      }

      const stats = await MediaDisciplinaBimestreModel.obterEstatisticasPorAluno(aluno_id);
      logger.info(`✅ Estatísticas obtidas para o aluno`, 'media-disciplina-bimestre');
      
      return stats;
    } catch (error) {
      logger.error('❌ Erro ao obter estatísticas por aluno', 'media-disciplina-bimestre', error);
      throw error;
    }
  }

  // Obter estatísticas por turma e disciplina
  static async obterEstatisticasPorTurmaDisciplina(
    turma_id: string,
    disciplina_id: string,
    periodo_letivo_id?: string
  ): Promise<any> {
    try {
      const logMessage = periodo_letivo_id 
        ? `📊 Obtendo estatísticas da turma ${turma_id}, disciplina ${disciplina_id} no período ${periodo_letivo_id}`
        : `📊 Obtendo estatísticas da turma ${turma_id}, disciplina ${disciplina_id}`;
      
      logger.info(logMessage, 'media-disciplina-bimestre');
      
      if (!turma_id?.trim()) {
        throw new Error('ID da turma é obrigatório');
      }
      
      if (!disciplina_id?.trim()) {
        throw new Error('ID da disciplina é obrigatório');
      }

      const stats = await MediaDisciplinaBimestreModel.obterEstatisticasPorTurmaDisciplina(
        turma_id,
        disciplina_id,
        periodo_letivo_id
      );
      logger.info(`✅ Estatísticas obtidas para a turma e disciplina`, 'media-disciplina-bimestre');
      
      return stats;
    } catch (error) {
      logger.error('❌ Erro ao obter estatísticas por turma e disciplina', 'media-disciplina-bimestre', error);
      throw error;
    }
  }

  // Validar dados da média
  private static async validarDadosMedia(
    dados: Partial<Omit<MediaDisciplinaBimestre, 'media_disciplina_bimestre_id' | 'created_at' | 'updated_at'>>,
    isUpdate: boolean = false
  ): Promise<void> {
    const errors: string[] = [];

    // Validação de campos obrigatórios para criação
    if (!isUpdate) {
      if (!dados.matricula_aluno_id?.trim()) {
        errors.push('ID da matrícula é obrigatório');
      }
      if (!dados.turma_disciplina_professor_id?.trim()) {
        errors.push('ID da turma-disciplina-professor é obrigatório');
      }
      if (!dados.periodo_letivo_id?.trim()) {
        errors.push('ID do período letivo é obrigatório');
      }
      if (dados.valor_media === undefined || dados.valor_media === null) {
        errors.push('Valor da média é obrigatório');
      }
      if (!dados.origem?.trim()) {
        errors.push('Origem da média é obrigatória');
      }
    }

    // Validação da média
    if (dados.valor_media !== undefined && dados.valor_media !== null) {
      if (typeof dados.valor_media !== 'number' || isNaN(dados.valor_media)) {
        errors.push('Valor da média deve ser um número válido');
      } else if (dados.valor_media < 0 || dados.valor_media > 10) {
        errors.push('Valor da média deve estar entre 0 e 10');
      }
    }

    // Validação da origem
    if (dados.origem && !['manual', 'calculada'].includes(dados.origem)) {
      errors.push('Origem deve ser "manual" ou "calculada"');
    }

    // Validações de integridade referencial
    if (dados.matricula_aluno_id) {
      const matriculaValida = await MediaDisciplinaBimestreModel.verificarMatriculaValida(dados.matricula_aluno_id);
      if (!matriculaValida) {
        errors.push('Matrícula não encontrada');
      }
    }

    if (dados.turma_disciplina_professor_id) {
      const turmaDisciplinaProfessorValida = await MediaDisciplinaBimestreModel.verificarTurmaDisciplinaProfessorValida(dados.turma_disciplina_professor_id);
      if (!turmaDisciplinaProfessorValida) {
        errors.push('Turma-disciplina-professor não encontrada');
      }
    }

    if (dados.periodo_letivo_id) {
      const periodoValido = await MediaDisciplinaBimestreModel.verificarPeriodoLetivoValido(dados.periodo_letivo_id);
      if (!periodoValido) {
        errors.push('Período letivo não encontrado');
      }
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }
}

export default MediaDisciplinaBimestreService;
