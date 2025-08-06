import { Serie } from '../types/models';
import SerieModel from '../model/serie.model';

class SerieService {

  // Validar dados da série
  private static validarDados(dados: any): string[] {
    const erros: string[] = [];

    if (!dados.nome_serie || typeof dados.nome_serie !== 'string' || dados.nome_serie.trim() === '') {
      erros.push("Campo 'nome_serie' é obrigatório e deve ser um texto válido");
    }

    if (dados.nome_serie && dados.nome_serie.length > 100) {
      erros.push("Campo 'nome_serie' deve ter no máximo 100 caracteres");
    }

    return erros;
  }

  // Listar todas as séries
  static async listarSeries(): Promise<Serie[]> {
    try {
      return await SerieModel.listarSeries();
    } catch (error) {
      throw new Error(`Erro no service ao listar séries: ${error}`);
    }
  }

  // Buscar série por ID
  static async buscarSeriePorId(serie_id: string): Promise<Serie | null> {
    try {
      if (!serie_id || serie_id.trim() === '') {
        throw new Error('ID da série é obrigatório');
      }

      return await SerieModel.buscarSeriePorId(serie_id);
    } catch (error) {
      throw new Error(`Erro no service ao buscar série por ID: ${error}`);
    }
  }

  // Buscar série por nome
  static async buscarSeriePorNome(nome_serie: string): Promise<Serie | null> {
    try {
      if (!nome_serie || nome_serie.trim() === '') {
        throw new Error('Nome da série é obrigatório');
      }

      return await SerieModel.buscarSeriePorNome(nome_serie.trim());
    } catch (error) {
      throw new Error(`Erro no service ao buscar série por nome: ${error}`);
    }
  }

  // Criar série
  static async criarSerie(dados: any): Promise<Serie> {
    try {
      // Validar dados
      const erros = this.validarDados(dados);
      if (erros.length > 0) {
        throw new Error(`Dados inválidos: ${erros.join(', ')}`);
      }

      // Verificar se o nome já existe
      const nomeExiste = await SerieModel.verificarNomeExiste(dados.nome_serie.trim());
      if (nomeExiste) {
        throw new Error(`Já existe uma série com o nome "${dados.nome_serie.trim()}"`);
      }

      // Preparar dados
      const dadosLimpos = {
        nome_serie: dados.nome_serie.trim()
      };

      return await SerieModel.criarSerie(dadosLimpos);
    } catch (error) {
      throw new Error(`Erro no service ao criar série: ${error}`);
    }
  }

  // Atualizar série
  static async atualizarSerie(serie_id: string, dados: any): Promise<Serie | null> {
    try {
      if (!serie_id || serie_id.trim() === '') {
        throw new Error('ID da série é obrigatório');
      }

      // Verificar se a série existe
      const serieExistente = await SerieModel.buscarSeriePorId(serie_id);
      if (!serieExistente) {
        throw new Error('Série não encontrada');
      }

      // Validar apenas os campos fornecidos
      const dadosParaValidar = { ...serieExistente, ...dados };
      const erros = this.validarDados(dadosParaValidar);
      if (erros.length > 0) {
        throw new Error(`Dados inválidos: ${erros.join(', ')}`);
      }

      // Verificar se o novo nome já existe (se nome foi alterado)
      if (dados.nome_serie && dados.nome_serie.trim() !== serieExistente.nome_serie) {
        const nomeExiste = await SerieModel.verificarNomeExiste(dados.nome_serie.trim(), serie_id);
        if (nomeExiste) {
          throw new Error(`Já existe uma série com o nome "${dados.nome_serie.trim()}"`);
        }
      }

      // Preparar dados para atualização
      const dadosLimpos: any = {};
      if (dados.nome_serie) dadosLimpos.nome_serie = dados.nome_serie.trim();

      return await SerieModel.atualizarSerie(serie_id, dadosLimpos);
    } catch (error) {
      throw new Error(`Erro no service ao atualizar série: ${error}`);
    }
  }

  // Deletar série
  static async deletarSerie(serie_id: string): Promise<boolean> {
    try {
      if (!serie_id || serie_id.trim() === '') {
        throw new Error('ID da série é obrigatório');
      }

      // Verificar se a série existe
      const serieExistente = await SerieModel.buscarSeriePorId(serie_id);
      if (!serieExistente) {
        throw new Error('Série não encontrada');
      }

      // Verificar se a série tem turmas associadas
      const temTurmas = await SerieModel.verificarSerieTemTurmas(serie_id);
      if (temTurmas) {
        throw new Error('Não é possível deletar a série pois ela possui turmas associadas');
      }

      return await SerieModel.deletarSerie(serie_id);
    } catch (error) {
      throw new Error(`Erro no service ao deletar série: ${error}`);
    }
  }
}

export default SerieService;
