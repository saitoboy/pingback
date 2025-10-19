import { PeriodoLetivo } from '../types/models';
import connection from '../connection';

class PeriodoLetivoModel {
  
  // Listar todos os períodos letivos
  static async listarPeriodosLetivos(): Promise<PeriodoLetivo[]> {
    try {
      const periodos = await connection('periodo_letivo')
        .select('*')
        .orderBy('ano_letivo_id', 'desc')
        .orderBy('bimestre', 'asc');
      
      return periodos;
    } catch (error) {
      throw new Error(`Erro ao listar períodos letivos: ${error}`);
    }
  }

  // Buscar período letivo por ID
  static async buscarPeriodoLetivoPorId(periodo_letivo_id: string): Promise<PeriodoLetivo | null> {
    try {
      const periodo = await connection('periodo_letivo')
        .select('*')
        .where('periodo_letivo_id', periodo_letivo_id)
        .first();
      
      return periodo || null;
    } catch (error) {
      throw new Error(`Erro ao buscar período letivo por ID: ${error}`);
    }
  }

  // Buscar período letivo atual (do ano letivo ativo)
  static async buscarPeriodoLetivoAtual(): Promise<PeriodoLetivo | null> {
    try {
      const periodo = await connection('periodo_letivo')
        .join('ano_letivo', 'periodo_letivo.ano_letivo_id', 'ano_letivo.ano_letivo_id')
        .where('ano_letivo.ativo', true)
        .orderBy('periodo_letivo.bimestre', 'desc')
        .first();
      
      return periodo || null;
    } catch (error) {
      throw new Error(`Erro ao buscar período letivo atual: ${error}`);
    }
  }

  // Buscar períodos letivos por ano letivo
  static async buscarPeriodosLetivosPorAno(ano_letivo_id: string): Promise<PeriodoLetivo[]> {
    try {
      const periodos = await connection('periodo_letivo')
        .select('*')
        .where('ano_letivo_id', ano_letivo_id)
        .orderBy('bimestre', 'asc');
      
      return periodos;
    } catch (error) {
      throw new Error(`Erro ao buscar períodos letivos por ano: ${error}`);
    }
  }

  // Buscar período letivo específico (bimestre + ano)
  static async buscarPeriodoLetivoPorBimestreEAno(bimestre: number, ano_letivo_id: string): Promise<PeriodoLetivo | null> {
    try {
      const periodo = await connection('periodo_letivo')
        .select('*')
        .where('bimestre', bimestre)
        .where('ano_letivo_id', ano_letivo_id)
        .first();
      
      return periodo || null;
    } catch (error) {
      throw new Error(`Erro ao buscar período letivo por bimestre e ano: ${error}`);
    }
  }

  // Criar período letivo
  static async criarPeriodoLetivo(dados: Omit<PeriodoLetivo, 'periodo_letivo_id' | 'created_at' | 'updated_at'>): Promise<PeriodoLetivo> {
    try {
      const [periodo] = await connection('periodo_letivo')
        .insert({
          ...dados,
          created_at: connection.fn.now(),
          updated_at: connection.fn.now()
        })
        .returning('*');
      
      return periodo;
    } catch (error) {
      throw new Error(`Erro ao criar período letivo: ${error}`);
    }
  }

  // Atualizar período letivo
  static async atualizarPeriodoLetivo(
    periodo_letivo_id: string, 
    dados: Partial<Omit<PeriodoLetivo, 'periodo_letivo_id' | 'created_at' | 'updated_at'>>
  ): Promise<PeriodoLetivo | null> {
    try {
      const [periodo] = await connection('periodo_letivo')
        .where('periodo_letivo_id', periodo_letivo_id)
        .update({
          ...dados,
          updated_at: connection.fn.now()
        })
        .returning('*');
      
      return periodo || null;
    } catch (error) {
      throw new Error(`Erro ao atualizar período letivo: ${error}`);
    }
  }

  // Deletar período letivo
  static async deletarPeriodoLetivo(periodo_letivo_id: string): Promise<boolean> {
    try {
      const deletado = await connection('periodo_letivo')
        .where('periodo_letivo_id', periodo_letivo_id)
        .del();
      
      return deletado > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar período letivo: ${error}`);
    }
  }

  // Verificar se bimestre já existe para o ano letivo
  static async verificarBimestreExiste(bimestre: number, ano_letivo_id: string, periodo_letivo_id?: string): Promise<boolean> {
    try {
      let query = connection('periodo_letivo')
        .where('bimestre', bimestre)
        .where('ano_letivo_id', ano_letivo_id);
      
      if (periodo_letivo_id) {
        query = query.where('periodo_letivo_id', '!=', periodo_letivo_id);
      }
      
      const resultado = await query.first();
      return !!resultado;
    } catch (error) {
      throw new Error(`Erro ao verificar bimestre: ${error}`);
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
}

export default PeriodoLetivoModel;
