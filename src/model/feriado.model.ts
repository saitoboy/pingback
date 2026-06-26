import { Feriado } from '../types/models';
import connection from '../connection';

class FeriadoModel {

  // Listar feriados de um ano letivo
  static async listarPorAno(ano_letivo_id: string): Promise<Feriado[]> {
    try {
      const feriados = await connection('feriado')
        .select('*')
        .where('ano_letivo_id', ano_letivo_id)
        .orderBy('data', 'asc');

      return feriados;
    } catch (error) {
      throw new Error(`Erro ao listar feriados por ano: ${error}`);
    }
  }

  // Buscar feriado por ID
  static async buscarPorId(feriado_id: string): Promise<Feriado | null> {
    try {
      const feriado = await connection('feriado')
        .select('*')
        .where('feriado_id', feriado_id)
        .first();

      return feriado || null;
    } catch (error) {
      throw new Error(`Erro ao buscar feriado por ID: ${error}`);
    }
  }

  // Verificar se já existe feriado nessa data para o ano letivo
  static async existeNaData(ano_letivo_id: string, data: string): Promise<boolean> {
    try {
      const resultado = await connection('feriado')
        .where('ano_letivo_id', ano_letivo_id)
        .where('data', data)
        .first();

      return !!resultado;
    } catch (error) {
      throw new Error(`Erro ao verificar feriado na data: ${error}`);
    }
  }

  // Criar feriado
  static async criar(dados: Omit<Feriado, 'feriado_id' | 'created_at' | 'updated_at'>): Promise<Feriado> {
    try {
      const [feriado] = await connection('feriado')
        .insert({
          ...dados,
          created_at: connection.fn.now(),
          updated_at: connection.fn.now(),
        })
        .returning('*');

      return feriado;
    } catch (error) {
      throw new Error(`Erro ao criar feriado: ${error}`);
    }
  }

  // Deletar feriado
  static async deletar(feriado_id: string): Promise<boolean> {
    try {
      const deletado = await connection('feriado')
        .where('feriado_id', feriado_id)
        .del();

      return deletado > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar feriado: ${error}`);
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

export default FeriadoModel;
