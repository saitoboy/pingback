import { Turma } from '../types/models';
import connection from '../connection';

class TurmaModel {
  
  // Listar todas as turmas
  static async listarTurmas(): Promise<Turma[]> {
    try {
      const turmas = await connection('turma')
        .select('*')
        .orderBy('ano_letivo_id', 'desc')
        .orderBy('serie_id', 'asc')
        .orderBy('nome_turma', 'asc');
      
      return turmas;
    } catch (error) {
      throw new Error(`Erro ao listar turmas: ${error}`);
    }
  }

  // Buscar turma por ID
  static async buscarTurmaPorId(turma_id: string): Promise<Turma | null> {
    try {
      const turma = await connection('turma')
        .select('*')
        .where('turma_id', turma_id)
        .first();
      
      return turma || null;
    } catch (error) {
      throw new Error(`Erro ao buscar turma por ID: ${error}`);
    }
  }

  // Buscar turmas por série
  static async buscarTurmasPorSerie(serie_id: string): Promise<Turma[]> {
    try {
      const turmas = await connection('turma')
        .select('*')
        .where('serie_id', serie_id)
        .orderBy('ano_letivo_id', 'desc')
        .orderBy('nome_turma', 'asc');
      
      return turmas;
    } catch (error) {
      throw new Error(`Erro ao buscar turmas por série: ${error}`);
    }
  }

  // Buscar turmas por ano letivo
  static async buscarTurmasPorAnoLetivo(ano_letivo_id: string): Promise<Turma[]> {
    try {
      const turmas = await connection('turma')
        .select('*')
        .where('ano_letivo_id', ano_letivo_id)
        .orderBy('serie_id', 'asc')
        .orderBy('nome_turma', 'asc');
      
      return turmas;
    } catch (error) {
      throw new Error(`Erro ao buscar turmas por ano letivo: ${error}`);
    }
  }

  // Buscar turmas por série e ano letivo
  static async buscarTurmasPorSerieEAno(serie_id: string, ano_letivo_id: string): Promise<Turma[]> {
    try {
      const turmas = await connection('turma')
        .select('*')
        .where('serie_id', serie_id)
        .where('ano_letivo_id', ano_letivo_id)
        .orderBy('nome_turma', 'asc');
      
      return turmas;
    } catch (error) {
      throw new Error(`Erro ao buscar turmas por série e ano: ${error}`);
    }
  }

  // Buscar turmas por turno
  static async buscarTurmasPorTurno(turno: string): Promise<Turma[]> {
    try {
      const turmas = await connection('turma')
        .select('*')
        .where('turno', 'ilike', turno)
        .orderBy('ano_letivo_id', 'desc')
        .orderBy('serie_id', 'asc')
        .orderBy('nome_turma', 'asc');
      
      return turmas;
    } catch (error) {
      throw new Error(`Erro ao buscar turmas por turno: ${error}`);
    }
  }

  // Criar turma
  static async criarTurma(dados: Omit<Turma, 'turma_id' | 'created_at' | 'updated_at'>): Promise<Turma> {
    try {
      const [turma] = await connection('turma')
        .insert({
          ...dados,
          created_at: connection.fn.now(),
          updated_at: connection.fn.now()
        })
        .returning('*');
      
      return turma;
    } catch (error) {
      throw new Error(`Erro ao criar turma: ${error}`);
    }
  }

  // Atualizar turma
  static async atualizarTurma(
    turma_id: string, 
    dados: Partial<Omit<Turma, 'turma_id' | 'created_at' | 'updated_at'>>
  ): Promise<Turma | null> {
    try {
      const [turma] = await connection('turma')
        .where('turma_id', turma_id)
        .update({
          ...dados,
          updated_at: connection.fn.now()
        })
        .returning('*');
      
      return turma || null;
    } catch (error) {
      throw new Error(`Erro ao atualizar turma: ${error}`);
    }
  }

  // Deletar turma
  static async deletarTurma(turma_id: string): Promise<boolean> {
    try {
      const deletado = await connection('turma')
        .where('turma_id', turma_id)
        .del();
      
      return deletado > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar turma: ${error}`);
    }
  }

  // Verificar se nome da turma já existe para a mesma série e ano letivo
  static async verificarNomeTurmaExiste(
    nome_turma: string, 
    serie_id: string, 
    ano_letivo_id: string, 
    turma_id?: string
  ): Promise<boolean> {
    try {
      let query = connection('turma')
        .where('nome_turma', 'ilike', nome_turma)
        .where('serie_id', serie_id)
        .where('ano_letivo_id', ano_letivo_id);
      
      if (turma_id) {
        query = query.where('turma_id', '!=', turma_id);
      }
      
      const resultado = await query.first();
      return !!resultado;
    } catch (error) {
      throw new Error(`Erro ao verificar nome da turma: ${error}`);
    }
  }

  // Verificar se série existe
  static async verificarSerieExiste(serie_id: string): Promise<boolean> {
    try {
      const resultado = await connection('serie')
        .where('serie_id', serie_id)
        .first();
      
      return !!resultado;
    } catch (error) {
      throw new Error(`Erro ao verificar série: ${error}`);
    }
  }

  // Verificar se ano letivo existe
  static async verificarAnoLetivoExiste(ano_letivo_id: string): Promise<boolean> {
    try {
      const resultado = await connection('ano_letivo')
        .where('ano_letivo_id', ano_letivo_id)
        .first();
      
      return !!resultado;
    } catch (error) {
      throw new Error(`Erro ao verificar ano letivo: ${error}`);
    }
  }

  // Verificar se turma tem alunos matriculados
  static async verificarTurmaTemAlunos(turma_id: string): Promise<boolean> {
    try {
      const resultado = await connection('matricula_aluno')
        .where('turma_id', turma_id)
        .first();
      
      return !!resultado;
    } catch (error) {
      throw new Error(`Erro ao verificar alunos da turma: ${error}`);
    }
  }
}

export default TurmaModel;
