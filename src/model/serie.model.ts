import { Serie } from '../types/models';
import connection from '../connection';

class SerieModel {
  
  // Listar todas as séries
  static async listarSeries(): Promise<Serie[]> {
    try {
      const series = await connection('serie')
        .select('*')
        .orderBy('nome_serie', 'asc');
      
      return series;
    } catch (error) {
      throw new Error(`Erro ao listar séries: ${error}`);
    }
  }

  // Buscar série por ID
  static async buscarSeriePorId(serie_id: string): Promise<Serie | null> {
    try {
      const serie = await connection('serie')
        .select('*')
        .where('serie_id', serie_id)
        .first();
      
      return serie || null;
    } catch (error) {
      throw new Error(`Erro ao buscar série por ID: ${error}`);
    }
  }

  // Buscar série por nome
  static async buscarSeriePorNome(nome_serie: string): Promise<Serie | null> {
    try {
      const serie = await connection('serie')
        .select('*')
        .where('nome_serie', 'ilike', `%${nome_serie}%`)
        .first();
      
      return serie || null;
    } catch (error) {
      throw new Error(`Erro ao buscar série por nome: ${error}`);
    }
  }

  // Criar série
  static async criarSerie(dados: Omit<Serie, 'serie_id' | 'created_at' | 'updated_at'>): Promise<Serie> {
    try {
      const [serie] = await connection('serie')
        .insert({
          ...dados,
          created_at: connection.fn.now(),
          updated_at: connection.fn.now()
        })
        .returning('*');
      
      return serie;
    } catch (error) {
      throw new Error(`Erro ao criar série: ${error}`);
    }
  }

  // Atualizar série
  static async atualizarSerie(
    serie_id: string, 
    dados: Partial<Omit<Serie, 'serie_id' | 'created_at' | 'updated_at'>>
  ): Promise<Serie | null> {
    try {
      const [serie] = await connection('serie')
        .where('serie_id', serie_id)
        .update({
          ...dados,
          updated_at: connection.fn.now()
        })
        .returning('*');
      
      return serie || null;
    } catch (error) {
      throw new Error(`Erro ao atualizar série: ${error}`);
    }
  }

  // Deletar série
  static async deletarSerie(serie_id: string): Promise<boolean> {
    try {
      const deletado = await connection('serie')
        .where('serie_id', serie_id)
        .del();
      
      return deletado > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar série: ${error}`);
    }
  }

  // Verificar se nome já existe
  static async verificarNomeExiste(nome_serie: string, serie_id?: string): Promise<boolean> {
    try {
      let query = connection('serie')
        .where('nome_serie', 'ilike', nome_serie);
      
      if (serie_id) {
        query = query.where('serie_id', '!=', serie_id);
      }
      
      const resultado = await query.first();
      return !!resultado;
    } catch (error) {
      throw new Error(`Erro ao verificar nome da série: ${error}`);
    }
  }

  // Verificar se série tem turmas associadas
  static async verificarSerieTemTurmas(serie_id: string): Promise<boolean> {
    try {
      const resultado = await connection('turma')
        .where('serie_id', serie_id)
        .first();
      
      return !!resultado;
    } catch (error) {
      throw new Error(`Erro ao verificar turmas da série: ${error}`);
    }
  }
}

export default SerieModel;
