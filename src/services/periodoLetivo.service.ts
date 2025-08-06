import { PeriodoLetivo } from '../types/models';
import PeriodoLetivoModel from '../model/periodoLetivo.model';

class PeriodoLetivoService {

  // Validar dados do período letivo
  private static validarDados(dados: any): string[] {
    const erros: string[] = [];

    if (dados.bimestre === undefined || dados.bimestre === null) {
      erros.push("Campo 'bimestre' é obrigatório");
    }

    if (dados.bimestre !== undefined && (!Number.isInteger(Number(dados.bimestre)) || Number(dados.bimestre) < 1 || Number(dados.bimestre) > 4)) {
      erros.push("Campo 'bimestre' deve ser um número inteiro entre 1 e 4");
    }

    if (!dados.ano_letivo_id || typeof dados.ano_letivo_id !== 'string' || dados.ano_letivo_id.trim() === '') {
      erros.push("Campo 'ano_letivo_id' é obrigatório e deve ser um UUID válido");
    }

    return erros;
  }

  // Listar todos os períodos letivos
  static async listarPeriodosLetivos(): Promise<PeriodoLetivo[]> {
    try {
      return await PeriodoLetivoModel.listarPeriodosLetivos();
    } catch (error) {
      throw new Error(`Erro no service ao listar períodos letivos: ${error}`);
    }
  }

  // Buscar período letivo por ID
  static async buscarPeriodoLetivoPorId(periodo_letivo_id: string): Promise<PeriodoLetivo | null> {
    try {
      if (!periodo_letivo_id || periodo_letivo_id.trim() === '') {
        throw new Error('ID do período letivo é obrigatório');
      }

      return await PeriodoLetivoModel.buscarPeriodoLetivoPorId(periodo_letivo_id);
    } catch (error) {
      throw new Error(`Erro no service ao buscar período letivo por ID: ${error}`);
    }
  }

  // Buscar períodos letivos por ano letivo
  static async buscarPeriodosLetivosPorAno(ano_letivo_id: string): Promise<PeriodoLetivo[]> {
    try {
      if (!ano_letivo_id || ano_letivo_id.trim() === '') {
        throw new Error('ID do ano letivo é obrigatório');
      }

      // Verificar se o ano letivo existe
      const anoExiste = await PeriodoLetivoModel.verificarAnoLetivoExiste(ano_letivo_id);
      if (!anoExiste) {
        throw new Error('Ano letivo não encontrado');
      }

      return await PeriodoLetivoModel.buscarPeriodosLetivosPorAno(ano_letivo_id);
    } catch (error) {
      throw new Error(`Erro no service ao buscar períodos letivos por ano: ${error}`);
    }
  }

  // Buscar período letivo específico (bimestre + ano)
  static async buscarPeriodoLetivoPorBimestreEAno(bimestre: number, ano_letivo_id: string): Promise<PeriodoLetivo | null> {
    try {
      if (!Number.isInteger(bimestre) || bimestre < 1 || bimestre > 4) {
        throw new Error('Bimestre deve ser um número inteiro entre 1 e 4');
      }

      if (!ano_letivo_id || ano_letivo_id.trim() === '') {
        throw new Error('ID do ano letivo é obrigatório');
      }

      return await PeriodoLetivoModel.buscarPeriodoLetivoPorBimestreEAno(bimestre, ano_letivo_id);
    } catch (error) {
      throw new Error(`Erro no service ao buscar período letivo por bimestre e ano: ${error}`);
    }
  }

  // Criar período letivo
  static async criarPeriodoLetivo(dados: any): Promise<PeriodoLetivo> {
    try {
      // Validar dados
      const erros = this.validarDados(dados);
      if (erros.length > 0) {
        throw new Error(`Dados inválidos: ${erros.join(', ')}`);
      }

      // Verificar se o ano letivo existe
      const anoExiste = await PeriodoLetivoModel.verificarAnoLetivoExiste(dados.ano_letivo_id);
      if (!anoExiste) {
        throw new Error('Ano letivo não encontrado');
      }

      // Verificar se o bimestre já existe para este ano letivo
      const bimestreExiste = await PeriodoLetivoModel.verificarBimestreExiste(Number(dados.bimestre), dados.ano_letivo_id);
      if (bimestreExiste) {
        throw new Error(`Já existe o ${dados.bimestre}º bimestre para este ano letivo`);
      }

      // Preparar dados
      const dadosLimpos = {
        bimestre: Number(dados.bimestre),
        ano_letivo_id: dados.ano_letivo_id.trim()
      };

      return await PeriodoLetivoModel.criarPeriodoLetivo(dadosLimpos);
    } catch (error) {
      throw new Error(`Erro no service ao criar período letivo: ${error}`);
    }
  }

  // Atualizar período letivo
  static async atualizarPeriodoLetivo(periodo_letivo_id: string, dados: any): Promise<PeriodoLetivo | null> {
    try {
      if (!periodo_letivo_id || periodo_letivo_id.trim() === '') {
        throw new Error('ID do período letivo é obrigatório');
      }

      // Verificar se o período existe
      const periodoExistente = await PeriodoLetivoModel.buscarPeriodoLetivoPorId(periodo_letivo_id);
      if (!periodoExistente) {
        throw new Error('Período letivo não encontrado');
      }

      // Validar apenas os campos fornecidos
      const dadosParaValidar = { ...periodoExistente, ...dados };
      const erros = this.validarDados(dadosParaValidar);
      if (erros.length > 0) {
        throw new Error(`Dados inválidos: ${erros.join(', ')}`);
      }

      // Verificar se o novo ano letivo existe (se foi alterado)
      if (dados.ano_letivo_id && dados.ano_letivo_id !== periodoExistente.ano_letivo_id) {
        const anoExiste = await PeriodoLetivoModel.verificarAnoLetivoExiste(dados.ano_letivo_id);
        if (!anoExiste) {
          throw new Error('Novo ano letivo não encontrado');
        }
      }

      // Verificar se o novo bimestre já existe (se bimestre ou ano foram alterados)
      if ((dados.bimestre && Number(dados.bimestre) !== periodoExistente.bimestre) || 
          (dados.ano_letivo_id && dados.ano_letivo_id !== periodoExistente.ano_letivo_id)) {
        
        const novoAnoLetivo = dados.ano_letivo_id || periodoExistente.ano_letivo_id;
        const novoBimestre = dados.bimestre ? Number(dados.bimestre) : periodoExistente.bimestre;
        
        const bimestreExiste = await PeriodoLetivoModel.verificarBimestreExiste(novoBimestre, novoAnoLetivo, periodo_letivo_id);
        if (bimestreExiste) {
          throw new Error(`Já existe o ${novoBimestre}º bimestre para este ano letivo`);
        }
      }

      // Preparar dados para atualização
      const dadosLimpos: any = {};
      if (dados.bimestre !== undefined) dadosLimpos.bimestre = Number(dados.bimestre);
      if (dados.ano_letivo_id) dadosLimpos.ano_letivo_id = dados.ano_letivo_id.trim();

      return await PeriodoLetivoModel.atualizarPeriodoLetivo(periodo_letivo_id, dadosLimpos);
    } catch (error) {
      throw new Error(`Erro no service ao atualizar período letivo: ${error}`);
    }
  }

  // Deletar período letivo
  static async deletarPeriodoLetivo(periodo_letivo_id: string): Promise<boolean> {
    try {
      if (!periodo_letivo_id || periodo_letivo_id.trim() === '') {
        throw new Error('ID do período letivo é obrigatório');
      }

      // Verificar se o período existe
      const periodoExistente = await PeriodoLetivoModel.buscarPeriodoLetivoPorId(periodo_letivo_id);
      if (!periodoExistente) {
        throw new Error('Período letivo não encontrado');
      }

      return await PeriodoLetivoModel.deletarPeriodoLetivo(periodo_letivo_id);
    } catch (error) {
      throw new Error(`Erro no service ao deletar período letivo: ${error}`);
    }
  }

  // Criar todos os bimestres para um ano letivo
  static async criarTodosBimestres(ano_letivo_id: string): Promise<PeriodoLetivo[]> {
    try {
      if (!ano_letivo_id || ano_letivo_id.trim() === '') {
        throw new Error('ID do ano letivo é obrigatório');
      }

      // Verificar se o ano letivo existe
      const anoExiste = await PeriodoLetivoModel.verificarAnoLetivoExiste(ano_letivo_id);
      if (!anoExiste) {
        throw new Error('Ano letivo não encontrado');
      }

      const bimestres: PeriodoLetivo[] = [];
      
      for (let bimestre = 1; bimestre <= 4; bimestre++) {
        // Verificar se o bimestre já existe
        const existe = await PeriodoLetivoModel.verificarBimestreExiste(bimestre, ano_letivo_id);
        
        if (!existe) {
          const novoBimestre = await this.criarPeriodoLetivo({
            bimestre,
            ano_letivo_id
          });
          bimestres.push(novoBimestre);
        }
      }

      return bimestres;
    } catch (error) {
      throw new Error(`Erro no service ao criar todos os bimestres: ${error}`);
    }
  }
}

export default PeriodoLetivoService;
