import * as BoletimModel from '../model/boletim.model';
import { Boletim, BoletimDisciplina } from '../types/models';
import logger from '../utils/logger';

export class BoletimService {
  
  // ================ CRUD BÁSICO BOLETIM ================
  
  static async listarTodos(): Promise<Boletim[]> {
    try {
      logger.info('Iniciando busca de todos os boletins');
      const boletins = await BoletimModel.listarTodos();
      logger.info(`Encontrados ${boletins.length} boletins`);
      return boletins;
    } catch (error) {
      logger.error('Erro ao buscar boletins:', 'BoletimService', error);
      throw error;
    }
  }

  static async buscarPorId(boletim_id: string): Promise<Boletim | undefined> {
    try {
      logger.info(`Buscando boletim por ID: ${boletim_id}`);
      const boletim = await BoletimModel.buscarPorId(boletim_id);
      
      if (!boletim) {
        logger.warning(`Boletim não encontrado para ID: ${boletim_id}`);
        return undefined;
      }

      logger.info(`Boletim encontrado para ID: ${boletim_id}`);
      return boletim;
    } catch (error) {
      logger.error(`Erro ao buscar boletim por ID ${boletim_id}:`, 'BoletimService', error);
      throw error;
    }
  }

  static async criar(dadosBoletim: Omit<Boletim, 'boletim_id' | 'created_at' | 'updated_at'>): Promise<Boletim> {
    try {
      logger.info(`Iniciando criação de boletim para matrícula: ${dadosBoletim.matricula_aluno_id}`);
      
      const novoBoletim = await BoletimModel.criar(dadosBoletim);
      
      logger.info(`Boletim criado com sucesso. ID: ${novoBoletim.boletim_id}`);
      return novoBoletim;
    } catch (error) {
      logger.error(`Erro ao criar boletim para matrícula ${dadosBoletim.matricula_aluno_id}:`, 'BoletimService', error);
      throw error;
    }
  }

  static async atualizar(
    boletim_id: string,
    dadosAtualizacao: Partial<Omit<Boletim, 'boletim_id' | 'created_at' | 'updated_at'>>
  ): Promise<Boletim | null> {
    try {
      logger.info(`Iniciando atualização do boletim ID: ${boletim_id}`);
      
      const boletimAtualizado = await BoletimModel.atualizar(boletim_id, dadosAtualizacao);
      
      if (!boletimAtualizado) {
        logger.warning(`Boletim não encontrado para atualização. ID: ${boletim_id}`);
        return null;
      }

      logger.info(`Boletim atualizado com sucesso. ID: ${boletim_id}`);
      return boletimAtualizado;
    } catch (error) {
      logger.error(`Erro ao atualizar boletim ID ${boletim_id}:`, 'BoletimService', error);
      throw error;
    }
  }

  static async excluir(boletim_id: string): Promise<boolean> {
    try {
      logger.info(`Iniciando exclusão do boletim ID: ${boletim_id}`);
      
      const sucesso = await BoletimModel.excluir(boletim_id);
      
      if (sucesso) {
        logger.info(`Boletim excluído com sucesso. ID: ${boletim_id}`);
      } else {
        logger.warning(`Falha ao excluir boletim. ID: ${boletim_id}`);
      }
      
      return sucesso;
    } catch (error) {
      logger.error(`Erro ao excluir boletim ID ${boletim_id}:`, 'BoletimService', error);
      throw error;
    }
  }

  // ================ CONSULTAS COM RELACIONAMENTOS ================

  static async buscarComDetalhes(boletim_id?: string): Promise<any> {
    try {
      if (boletim_id) {
        logger.info(`Buscando boletim com detalhes por ID: ${boletim_id}`);
      } else {
        logger.info('Buscando todos os boletins com detalhes');
      }
      
      const resultado = await BoletimModel.buscarComDetalhes(boletim_id);
      
      if (boletim_id && !resultado) {
        logger.warning(`Boletim com detalhes não encontrado para ID: ${boletim_id}`);
        return undefined;
      }

      const total = Array.isArray(resultado) ? resultado.length : 1;
      logger.info(`${total} boletim(s) encontrado(s) com detalhes`);
      return resultado;
    } catch (error) {
      logger.error('Erro ao buscar boletins com detalhes:', 'BoletimService', error);
      throw error;
    }
  }

  static async buscarPorMatriculaEPeriodo(
    matricula_aluno_id: string,
    periodo_letivo_id: string
  ): Promise<Boletim | undefined> {
    try {
      logger.info(`Buscando boletim por matrícula: ${matricula_aluno_id} e período: ${periodo_letivo_id}`);
      
      const boletim = await BoletimModel.buscarPorMatriculaEPeriodo(matricula_aluno_id, periodo_letivo_id);
      
      if (!boletim) {
        logger.warning(`Boletim não encontrado para matrícula: ${matricula_aluno_id} e período: ${periodo_letivo_id}`);
        return undefined;
      }

      logger.info(`Boletim encontrado para matrícula: ${matricula_aluno_id} e período: ${periodo_letivo_id}`);
      return boletim;
    } catch (error) {
      logger.error(`Erro ao buscar boletim por matrícula e período:`, 'BoletimService', error);
      throw error;
    }
  }

  static async buscarPorMatricula(matricula_aluno_id: string): Promise<Boletim[]> {
    try {
      logger.info(`Buscando boletins por matrícula: ${matricula_aluno_id}`);
      
      const boletins = await BoletimModel.buscarPorMatricula(matricula_aluno_id);
      
      logger.info(`Encontrados ${boletins.length} boletins para matrícula: ${matricula_aluno_id}`);
      return boletins;
    } catch (error) {
      logger.error(`Erro ao buscar boletins por matrícula ${matricula_aluno_id}:`, 'BoletimService', error);
      throw error;
    }
  }

  static async buscarPorPeriodo(periodo_letivo_id: string): Promise<Boletim[]> {
    try {
      logger.info(`Buscando boletins por período: ${periodo_letivo_id}`);
      
      const boletins = await BoletimModel.buscarPorPeriodo(periodo_letivo_id);
      
      logger.info(`Encontrados ${boletins.length} boletins para período: ${periodo_letivo_id}`);
      return boletins;
    } catch (error) {
      logger.error(`Erro ao buscar boletins por período ${periodo_letivo_id}:`, 'BoletimService', error);
      throw error;
    }
  }

  // ================ CRUD BOLETIM DISCIPLINA ================

  static async listarDisciplinasBoletim(boletim_id: string): Promise<BoletimDisciplina[]> {
    try {
      logger.info(`Buscando disciplinas do boletim ID: ${boletim_id}`);
      
      const disciplinas = await BoletimModel.listarDisciplinasBoletim(boletim_id);
      
      logger.info(`Encontradas ${disciplinas.length} disciplinas para o boletim ID: ${boletim_id}`);
      return disciplinas;
    } catch (error) {
      logger.error(`Erro ao buscar disciplinas do boletim ${boletim_id}:`, 'BoletimService', error);
      throw error;
    }
  }

  static async buscarDisciplinaPorId(boletim_disciplina_id: string): Promise<BoletimDisciplina | undefined> {
    try {
      logger.info(`Buscando disciplina do boletim por ID: ${boletim_disciplina_id}`);
      
      const disciplina = await BoletimModel.buscarDisciplinaPorId(boletim_disciplina_id);
      
      if (!disciplina) {
        logger.warning(`Disciplina do boletim não encontrada para ID: ${boletim_disciplina_id}`);
        return undefined;
      }

      logger.info(`Disciplina do boletim encontrada para ID: ${boletim_disciplina_id}`);
      return disciplina;
    } catch (error) {
      logger.error(`Erro ao buscar disciplina do boletim por ID ${boletim_disciplina_id}:`, 'BoletimService', error);
      throw error;
    }
  }

  static async criarDisciplinaBoletim(
    dadosDisciplina: Omit<BoletimDisciplina, 'boletim_disciplina_id' | 'created_at' | 'updated_at'>
  ): Promise<BoletimDisciplina> {
    try {
      logger.info(`Criando disciplina para boletim ID: ${dadosDisciplina.boletim_id}`);
      
      const novaDisciplina = await BoletimModel.criarDisciplinaBoletim(dadosDisciplina);
      
      logger.info(`Disciplina do boletim criada com sucesso. ID: ${novaDisciplina.boletim_disciplina_id}`);
      return novaDisciplina;
    } catch (error) {
      logger.error(`Erro ao criar disciplina do boletim:`, 'BoletimService', error);
      throw error;
    }
  }

  static async atualizarDisciplinaBoletim(
    boletim_disciplina_id: string,
    dadosAtualizacao: Partial<Omit<BoletimDisciplina, 'boletim_disciplina_id' | 'created_at' | 'updated_at'>>
  ): Promise<BoletimDisciplina | null> {
    try {
      logger.info(`Atualizando disciplina do boletim ID: ${boletim_disciplina_id}`);
      
      const disciplinaAtualizada = await BoletimModel.atualizarDisciplinaBoletim(boletim_disciplina_id, dadosAtualizacao);
      
      if (!disciplinaAtualizada) {
        logger.warning(`Disciplina do boletim não encontrada para atualização. ID: ${boletim_disciplina_id}`);
        return null;
      }

      logger.info(`Disciplina do boletim atualizada com sucesso. ID: ${boletim_disciplina_id}`);
      return disciplinaAtualizada;
    } catch (error) {
      logger.error(`Erro ao atualizar disciplina do boletim ID ${boletim_disciplina_id}:`, 'BoletimService', error);
      throw error;
    }
  }

  static async excluirDisciplinaBoletim(boletim_disciplina_id: string): Promise<boolean> {
    try {
      logger.info(`Excluindo disciplina do boletim ID: ${boletim_disciplina_id}`);
      
      const sucesso = await BoletimModel.excluirDisciplinaBoletim(boletim_disciplina_id);
      
      if (sucesso) {
        logger.info(`Disciplina do boletim excluída com sucesso. ID: ${boletim_disciplina_id}`);
      } else {
        logger.warning(`Falha ao excluir disciplina do boletim. ID: ${boletim_disciplina_id}`);
      }
      
      return sucesso;
    } catch (error) {
      logger.error(`Erro ao excluir disciplina do boletim ID ${boletim_disciplina_id}:`, 'BoletimService', error);
      throw error;
    }
  }

  // ================ CONSULTAS COMPLEXAS ================

  static async buscarBoletimCompleto(boletim_id: string): Promise<any> {
    try {
      logger.info(`Buscando boletim completo ID: ${boletim_id}`);
      
      const boletimCompleto = await BoletimModel.buscarBoletimCompleto(boletim_id);
      
      if (!boletimCompleto) {
        logger.warning(`Boletim completo não encontrado para ID: ${boletim_id}`);
        return null;
      }

      logger.info(`Boletim completo encontrado. ID: ${boletim_id}, Disciplinas: ${boletimCompleto.disciplinas?.length || 0}`);
      return boletimCompleto;
    } catch (error) {
      logger.error(`Erro ao buscar boletim completo ID ${boletim_id}:`, 'BoletimService', error);
      throw error;
    }
  }

  static async gerarEstatisticas(periodo_letivo_id?: string): Promise<any> {
    try {
      if (periodo_letivo_id) {
        logger.info(`Gerando estatísticas para período letivo: ${periodo_letivo_id}`);
      } else {
        logger.info('Gerando estatísticas gerais de boletins');
      }
      
      const estatisticas = await BoletimModel.gerarEstatisticas(periodo_letivo_id);
      
      logger.info(`Estatísticas geradas com sucesso. Total de boletins: ${estatisticas.geral?.total_boletins || 0}`);
      return estatisticas;
    } catch (error) {
      logger.error('Erro ao gerar estatísticas de boletins:', 'BoletimService', error);
      throw error;
    }
  }

  // ================ FUNCIONALIDADES ESPECIAIS ================

  static async gerarBoletimAutomatico(
    matricula_aluno_id: string,
    periodo_letivo_id: string
  ): Promise<any> {
    try {
      logger.info(`Gerando boletim automático para matrícula: ${matricula_aluno_id}, período: ${periodo_letivo_id}`);
      
      // Verificar se já existe boletim
      const boletimExistente = await this.buscarPorMatriculaEPeriodo(matricula_aluno_id, periodo_letivo_id);
      if (boletimExistente) {
        throw new Error('Já existe um boletim para este aluno neste período');
      }

      // Criar boletim base
      const novoBoletim = await this.criar({
        matricula_aluno_id,
        periodo_letivo_id,
        observacoes_gerais: 'Boletim gerado automaticamente'
      });

      // TODO: Implementar geração automática baseada em turma_disciplina_professor
      // Por ora, criamos apenas o boletim base sem disciplinas
      
      logger.info(`Boletim automático gerado com sucesso. ID: ${novoBoletim.boletim_id}`);
      logger.warning('Geração automática de disciplinas ainda não implementada. Use endpoints específicos para adicionar disciplinas.');
      
      return {
        boletim: novoBoletim,
        disciplinas: []
      };
      
      return {
        boletim: novoBoletim,
        disciplinas: []
      };
    } catch (error) {
      logger.error(`Erro ao gerar boletim automático:`, 'BoletimService', error);
      throw error;
    }
  }
}
