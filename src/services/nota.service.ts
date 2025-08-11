import * as NotaModel from '../model/nota.model';
import { Nota } from '../types/models';
import logger from '../utils/logger';

export class NotaService {

  static async listarTodas(): Promise<Nota[]> {
    try {
      logger.info('📋 Listando todas as notas');
      const notas = await NotaModel.listarTodas();
      logger.info(`✅ ${notas.length} notas encontradas`);
      return notas;
    } catch (error) {
      logger.error('❌ Erro ao listar notas:', error);
      throw new Error(`Erro ao listar notas: ${error}`);
    }
  }

  static async buscarPorId(nota_id: string): Promise<Nota | null> {
    try {
      if (!nota_id?.trim()) {
        throw new Error('ID da nota é obrigatório');
      }

      logger.info(`🔍 Buscando nota por ID: ${nota_id}`);
      const nota = await NotaModel.buscarPorId(nota_id);
      
      if (!nota) {
        logger.warning(`⚠️ Nota não encontrada: ${nota_id}`);
        return null;
      }

      logger.info(`✅ Nota encontrada: ${nota.nota_id}`);
      return nota;
    } catch (error) {
      logger.error('❌ Erro ao buscar nota por ID:', error);
      throw new Error(`Erro ao buscar nota: ${error}`);
    }
  }

  static async buscarComDetalhes(): Promise<any[]> {
    try {
      logger.info('📋 Buscando notas com detalhes completos');
      const notas = await NotaModel.buscarComDetalhes();
      logger.info(`✅ ${notas.length} notas com detalhes encontradas`);
      return notas;
    } catch (error) {
      logger.error('❌ Erro ao buscar notas com detalhes:', error);
      throw new Error(`Erro ao buscar notas com detalhes: ${error}`);
    }
  }

  static async buscarComDetalhesPorId(nota_id: string): Promise<any | null> {
    try {
      if (!nota_id?.trim()) {
        throw new Error('ID da nota é obrigatório');
      }

      logger.info(`🔍 Buscando nota com detalhes por ID: ${nota_id}`);
      const nota = await NotaModel.buscarComDetalhesPorId(nota_id);
      
      if (!nota) {
        logger.warning(`⚠️ Nota não encontrada: ${nota_id}`);
        return null;
      }

      logger.info(`✅ Nota com detalhes encontrada: ${nota.nota_id}`);
      return nota;
    } catch (error) {
      logger.error('❌ Erro ao buscar nota com detalhes por ID:', error);
      throw new Error(`Erro ao buscar nota com detalhes: ${error}`);
    }
  }

  static async buscarPorAtividade(atividade_id: string): Promise<Nota[]> {
    try {
      if (!atividade_id?.trim()) {
        throw new Error('ID da atividade é obrigatório');
      }

      logger.info(`🔍 Buscando notas por atividade: ${atividade_id}`);
      const notas = await NotaModel.buscarPorAtividade(atividade_id);
      logger.info(`✅ ${notas.length} notas encontradas para a atividade`);
      return notas;
    } catch (error) {
      logger.error('❌ Erro ao buscar notas por atividade:', error);
      throw new Error(`Erro ao buscar notas por atividade: ${error}`);
    }
  }

  static async buscarPorAluno(matricula_aluno_id: string): Promise<Nota[]> {
    try {
      if (!matricula_aluno_id?.trim()) {
        throw new Error('ID da matrícula do aluno é obrigatório');
      }

      logger.info(`🔍 Buscando notas por aluno: ${matricula_aluno_id}`);
      const notas = await NotaModel.buscarPorAluno(matricula_aluno_id);
      logger.info(`✅ ${notas.length} notas encontradas para o aluno`);
      return notas;
    } catch (error) {
      logger.error('❌ Erro ao buscar notas por aluno:', error);
      throw new Error(`Erro ao buscar notas por aluno: ${error}`);
    }
  }

  static async buscarPorTurmaEDisciplina(turma_id: string, disciplina_id: string): Promise<any[]> {
    try {
      if (!turma_id?.trim() || !disciplina_id?.trim()) {
        throw new Error('ID da turma e disciplina são obrigatórios');
      }

      logger.info(`🔍 Buscando notas por turma ${turma_id} e disciplina ${disciplina_id}`);
      const notas = await NotaModel.buscarPorTurmaEDisciplina(turma_id, disciplina_id);
      logger.info(`✅ ${notas.length} notas encontradas para turma/disciplina`);
      return notas;
    } catch (error) {
      logger.error('❌ Erro ao buscar notas por turma e disciplina:', error);
      throw new Error(`Erro ao buscar notas por turma e disciplina: ${error}`);
    }
  }

  static async estatisticasPorAluno(matricula_aluno_id: string): Promise<any> {
    try {
      if (!matricula_aluno_id?.trim()) {
        throw new Error('ID da matrícula do aluno é obrigatório');
      }

      logger.info(`📊 Buscando estatísticas de notas para aluno: ${matricula_aluno_id}`);
      const stats = await NotaModel.estatisticasPorAluno(matricula_aluno_id);
      logger.info(`✅ Estatísticas geradas para o aluno`);
      return stats;
    } catch (error) {
      logger.error('❌ Erro ao buscar estatísticas por aluno:', error);
      throw new Error(`Erro ao buscar estatísticas por aluno: ${error}`);
    }
  }

  static async criar(dadosNota: Omit<Nota, 'nota_id'>): Promise<Nota> {
    try {
      // Validações
      if (!dadosNota.atividade_id?.trim()) {
        throw new Error('ID da atividade é obrigatório');
      }
      if (!dadosNota.matricula_aluno_id?.trim()) {
        throw new Error('ID da matrícula do aluno é obrigatório');
      }
      if (dadosNota.valor === undefined || dadosNota.valor === null) {
        throw new Error('Valor da nota é obrigatório');
      }
      if (typeof dadosNota.valor !== 'number') {
        throw new Error('Valor da nota deve ser um número');
      }

      logger.info(`➕ Criando nova nota - Atividade: ${dadosNota.atividade_id}, Aluno: ${dadosNota.matricula_aluno_id}, Valor: ${dadosNota.valor}`);
      
      const novaNota = await NotaModel.criar(dadosNota);
      
      logger.info(`✅ Nota criada com sucesso: ${novaNota.nota_id}`);
      return novaNota;
    } catch (error) {
      logger.error('❌ Erro ao criar nota:', error);
      throw error; // Repassar erro original do model
    }
  }

  static async atualizar(nota_id: string, dadosAtualizacao: Partial<Omit<Nota, 'nota_id'>>): Promise<Nota | null> {
    try {
      if (!nota_id?.trim()) {
        throw new Error('ID da nota é obrigatório');
      }

      // Validar valor da nota se estiver sendo atualizado
      if (dadosAtualizacao.valor !== undefined && typeof dadosAtualizacao.valor !== 'number') {
        throw new Error('Valor da nota deve ser um número');
      }

      logger.info(`🔄 Atualizando nota: ${nota_id}`);
      
      const notaAtualizada = await NotaModel.atualizar(nota_id, dadosAtualizacao);
      
      if (!notaAtualizada) {
        logger.warning(`⚠️ Nota não encontrada para atualização: ${nota_id}`);
        return null;
      }

      logger.info(`✅ Nota atualizada com sucesso: ${nota_id}`);
      return notaAtualizada;
    } catch (error) {
      logger.error('❌ Erro ao atualizar nota:', error);
      throw error; // Repassar erro original do model
    }
  }

  static async deletar(nota_id: string): Promise<boolean> {
    try {
      if (!nota_id?.trim()) {
        throw new Error('ID da nota é obrigatório');
      }

      logger.info(`🗑️ Deletando nota: ${nota_id}`);
      
      const sucesso = await NotaModel.deletar(nota_id);
      
      if (!sucesso) {
        logger.warning(`⚠️ Nota não encontrada para exclusão: ${nota_id}`);
        return false;
      }

      logger.info(`✅ Nota deletada com sucesso: ${nota_id}`);
      return true;
    } catch (error) {
      logger.error('❌ Erro ao deletar nota:', error);
      throw new Error(`Erro ao deletar nota: ${error}`);
    }
  }
}
