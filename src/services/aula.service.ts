import { Aula } from '../types/models';
import * as AulaModel from '../model/aula.model';
import { logSuccess, logError } from '../utils/logger';

export class AulaService {
  // Listar todas as aulas
  static async listarTodas(): Promise<Aula[]> {
    try {
      const aulas = await AulaModel.listarTodas();
      
      logSuccess('Lista de aulas obtida', 'service', { 
        total: aulas.length 
      });
      
      return aulas;
    } catch (error) {
      logError('Erro ao listar aulas', 'service', error);
      throw error;
    }
  }

  // Buscar aula por ID
  static async buscarPorId(aula_id: string): Promise<Aula | undefined> {
    try {
      const aula = await AulaModel.buscarPorId(aula_id);
      
      if (aula) {
        logSuccess('Aula encontrada', 'service', { aula_id });
      } else {
        logError('Aula não encontrada', 'service', { aula_id });
      }
      
      return aula;
    } catch (error) {
      logError('Erro ao buscar aula por ID', 'service', error);
      throw error;
    }
  }

  // Buscar aulas por vinculação (turma_disciplina_professor_id)
  static async buscarPorVinculacao(turma_disciplina_professor_id: string): Promise<Aula[]> {
    try {
      const aulas = await AulaModel.buscarPorVinculacao(turma_disciplina_professor_id);
      
      logSuccess('Aulas da vinculação obtidas', 'service', { 
        turma_disciplina_professor_id,
        total: aulas.length 
      });
      
      return aulas;
    } catch (error) {
      logError('Erro ao buscar aulas por vinculação', 'service', error);
      throw error;
    }
  }

  // Criar nova aula
  static async criar(aula: Omit<Aula, 'aula_id' | 'created_at' | 'updated_at'>): Promise<Aula> {
    try {
      const novaAula = await AulaModel.criar(aula);
      
      logSuccess('Aula criada com sucesso', 'service', { 
        aula_id: novaAula.aula_id,
        turma_disciplina_professor_id: novaAula.turma_disciplina_professor_id,
        data_aula: novaAula.data_aula,
        hora_inicio: novaAula.hora_inicio,
        hora_fim: novaAula.hora_fim
      });
      
      return novaAula;
    } catch (error) {
      logError('Erro ao criar aula', 'service', error);
      throw error;
    }
  }

  // Atualizar aula
  static async atualizar(
    aula_id: string, 
    dadosAtualizacao: Partial<Omit<Aula, 'aula_id' | 'turma_disciplina_professor_id' | 'created_at' | 'updated_at'>>
  ): Promise<Aula | undefined> {
    try {
      const aulaAtualizada = await AulaModel.atualizar(aula_id, dadosAtualizacao);
      
      if (aulaAtualizada) {
        logSuccess('Aula atualizada com sucesso', 'service', { 
          aula_id,
          dados_atualizados: Object.keys(dadosAtualizacao)
        });
      } else {
        logError('Aula não encontrada para atualização', 'service', { aula_id });
      }
      
      return aulaAtualizada;
    } catch (error) {
      logError('Erro ao atualizar aula', 'service', error);
      throw error;
    }
  }

  // Deletar aula
  static async deletar(aula_id: string): Promise<boolean> {
    try {
      const deletada = await AulaModel.deletar(aula_id);
      
      if (deletada) {
        logSuccess('Aula deletada com sucesso', 'service', { aula_id });
      } else {
        logError('Aula não encontrada para exclusão', 'service', { aula_id });
      }
      
      return deletada;
    } catch (error) {
      logError('Erro ao deletar aula', 'service', error);
      throw error;
    }
  }

  // Buscar aulas com detalhes
  static async buscarComDetalhes(aula_id?: string): Promise<any> {
    try {
      const resultado = await AulaModel.buscarComDetalhes(aula_id);
      
      logSuccess('Aulas com detalhes obtidas', 'service', { 
        aula_id: aula_id || 'todas',
        total: Array.isArray(resultado) ? resultado.length : 1
      });
      
      return resultado;
    } catch (error) {
      logError('Erro ao buscar aulas com detalhes', 'service', error);
      throw error;
    }
  }

  // Buscar detalhes de uma aula específica (método mais robusto)
  static async buscarDetalhesAula(aula_id: string): Promise<any> {
    try {
      const resultado = await AulaModel.buscarDetalhesAula(aula_id);
      
      if (!resultado) {
        throw new Error('Aula não encontrada');
      }
      
      logSuccess('Detalhes da aula obtidos', 'service', { 
        aula_id,
        tem_turma: !!resultado.nome_turma,
        tem_disciplina: !!resultado.nome_disciplina,
        tem_professor: !!resultado.nome_professor
      });
      
      return resultado;
    } catch (error) {
      logError('Erro ao buscar detalhes da aula', 'service', error);
      throw error;
    }
  }

  // Verificar acesso do professor à aula
  static async verificarAcessoProfessor(aula_id: string, professor_id: string): Promise<boolean> {
    try {
      const temAcesso = await AulaModel.verificarAcessoProfessor(aula_id, professor_id);
      
      logSuccess('Verificação de acesso do professor', 'service', { 
        aula_id,
        professor_id,
        tem_acesso: temAcesso
      });
      
      return temAcesso;
    } catch (error) {
      logError('Erro ao verificar acesso do professor', 'service', error);
      throw error;
    }
  }
}

export default AulaService;