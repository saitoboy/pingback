import { Feriado } from '../types/models';
import FeriadoModel from '../model/feriado.model';

class FeriadoService {

  // Listar feriados por ano letivo
  static async listarPorAno(ano_letivo_id: string): Promise<Feriado[]> {
    try {
      if (!ano_letivo_id || ano_letivo_id.trim() === '') {
        throw new Error('ID do ano letivo é obrigatório');
      }

      return await FeriadoModel.listarPorAno(ano_letivo_id);
    } catch (error) {
      throw new Error(`Erro no service ao listar feriados por ano: ${error}`);
    }
  }

  // Criar feriado
  static async criar(dados: any): Promise<Feriado> {
    try {
      const erros: string[] = [];

      if (!dados.ano_letivo_id || typeof dados.ano_letivo_id !== 'string' || dados.ano_letivo_id.trim() === '') {
        erros.push("Campo 'ano_letivo_id' é obrigatório");
      }

      if (!dados.data || isNaN(Date.parse(dados.data))) {
        erros.push("Campo 'data' deve ser uma data válida");
      }

      if (!dados.descricao || typeof dados.descricao !== 'string' || dados.descricao.trim() === '') {
        erros.push("Campo 'descricao' é obrigatório");
      }

      if (erros.length > 0) {
        throw new Error(`Dados inválidos: ${erros.join(', ')}`);
      }

      // Verificar se o ano letivo existe
      const anoExiste = await FeriadoModel.verificarAnoLetivoExiste(dados.ano_letivo_id);
      if (!anoExiste) {
        throw new Error('Ano letivo não encontrado');
      }

      // Normaliza a data para YYYY-MM-DD (descarta hora/timezone)
      const dataNormalizada = String(dados.data).substring(0, 10);

      // Verificar se já existe feriado nessa data
      const jaExiste = await FeriadoModel.existeNaData(dados.ano_letivo_id, dataNormalizada);
      if (jaExiste) {
        throw new Error('Já existe um feriado cadastrado nessa data');
      }

      return await FeriadoModel.criar({
        ano_letivo_id: dados.ano_letivo_id.trim(),
        data: dataNormalizada,
        descricao: dados.descricao.trim(),
      });
    } catch (error) {
      throw new Error(`Erro no service ao criar feriado: ${error}`);
    }
  }

  // Deletar feriado
  static async deletar(feriado_id: string): Promise<boolean> {
    try {
      if (!feriado_id || feriado_id.trim() === '') {
        throw new Error('ID do feriado é obrigatório');
      }

      const existente = await FeriadoModel.buscarPorId(feriado_id);
      if (!existente) {
        throw new Error('Feriado não encontrado');
      }

      return await FeriadoModel.deletar(feriado_id);
    } catch (error) {
      throw new Error(`Erro no service ao deletar feriado: ${error}`);
    }
  }
}

export default FeriadoService;
