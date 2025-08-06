import * as AnoLetivoModel from '../model/anoLetivo.model';
import { AnoLetivo } from '../types/models';
import { logError, logSuccess } from '../utils/logger';

export class AnoLetivoService {
  
  static async criarAnoLetivo(anoLetivo: Omit<AnoLetivo, 'ano_letivo_id' | 'created_at' | 'updated_at'>): Promise<AnoLetivo | null> {
    try {
      // Validações básicas
      const camposObrigatorios = ['ano', 'data_inicio', 'data_fim'];
      
      for (const campo of camposObrigatorios) {
        if (anoLetivo[campo as keyof typeof anoLetivo] === undefined || anoLetivo[campo as keyof typeof anoLetivo] === null) {
          const erro = new Error(`Campo obrigatório ausente: ${campo}`);
          (erro as any).codigo = 'CAMPO_OBRIGATORIO';
          (erro as any).campo = campo;
          throw erro;
        }
      }

      // Validação do ano
      const anoAtual = new Date().getFullYear();
      if (anoLetivo.ano < 2000 || anoLetivo.ano > (anoAtual + 10)) {
        const erro = new Error(`Ano inválido: ${anoLetivo.ano}. Deve estar entre 2000 e ${anoAtual + 10}`);
        (erro as any).codigo = 'ANO_INVALIDO';
        (erro as any).ano = anoLetivo.ano;
        (erro as any).ano_minimo = 2000;
        (erro as any).ano_maximo = anoAtual + 10;
        throw erro;
      }

      // Verifica se já existe ano letivo para este ano
      const anoLetivoExistente = await AnoLetivoModel.buscarPorAno(anoLetivo.ano);
      if (anoLetivoExistente) {
        const erro = new Error(`Já existe ano letivo cadastrado para o ano: ${anoLetivo.ano}`);
        (erro as any).codigo = 'ANO_LETIVO_DUPLICADO';
        (erro as any).ano = anoLetivo.ano;
        (erro as any).ano_letivo_existente_id = anoLetivoExistente.ano_letivo_id;
        throw erro;
      }

      // Validação de datas
      const dataInicio = new Date(anoLetivo.data_inicio);
      const dataFim = new Date(anoLetivo.data_fim);
      
      if (dataFim <= dataInicio) {
        const erro = new Error('Data de fim deve ser posterior à data de início');
        (erro as any).codigo = 'DATA_FIM_INVALIDA';
        (erro as any).data_inicio = anoLetivo.data_inicio;
        (erro as any).data_fim = anoLetivo.data_fim;
        throw erro;
      }

      // Verifica se as datas estão no ano correto
      if (dataInicio.getFullYear() !== anoLetivo.ano) {
        const erro = new Error(`Data de início deve estar no ano ${anoLetivo.ano}`);
        (erro as any).codigo = 'DATA_INICIO_ANO_INCORRETO';
        (erro as any).ano_esperado = anoLetivo.ano;
        (erro as any).ano_data_inicio = dataInicio.getFullYear();
        throw erro;
      }

      // Data fim pode estar no ano seguinte (para casos que o ano letivo termina no ano seguinte)
      if (dataFim.getFullYear() !== anoLetivo.ano && dataFim.getFullYear() !== (anoLetivo.ano + 1)) {
        const erro = new Error(`Data de fim deve estar no ano ${anoLetivo.ano} ou ${anoLetivo.ano + 1}`);
        (erro as any).codigo = 'DATA_FIM_ANO_INCORRETO';
        (erro as any).ano_esperado = anoLetivo.ano;
        (erro as any).ano_data_fim = dataFim.getFullYear();
        throw erro;
      }

      // Cria o ano letivo
      const novoAnoLetivo = await AnoLetivoModel.criar(anoLetivo);
      
      logSuccess('Ano letivo criado com sucesso', 'service', { 
        ano_letivo_id: novoAnoLetivo.ano_letivo_id,
        ano: anoLetivo.ano
      });
      
      return novoAnoLetivo;
    } catch (error) {
      logError('Erro ao criar ano letivo', 'service', error);
      throw error;
    }
  }

  static async buscarPorId(ano_letivo_id: string): Promise<AnoLetivo | null> {
    try {
      const anoLetivo = await AnoLetivoModel.buscarPorId(ano_letivo_id);
      if (!anoLetivo) {
        logError('Ano letivo não encontrado', 'service', { ano_letivo_id });
        return null;
      }

      logSuccess('Ano letivo encontrado', 'service', { 
        ano_letivo_id,
        ano: anoLetivo.ano
      });
      
      return anoLetivo;
    } catch (error) {
      logError('Erro ao buscar ano letivo', 'service', error);
      throw error;
    }
  }

  static async buscarPorAno(ano: number): Promise<AnoLetivo | null> {
    try {
      const anoLetivo = await AnoLetivoModel.buscarPorAno(ano);
      if (!anoLetivo) {
        logError('Ano letivo não encontrado para o ano', 'service', { ano });
        return null;
      }

      logSuccess('Ano letivo encontrado para o ano', 'service', { 
        ano,
        ano_letivo_id: anoLetivo.ano_letivo_id
      });
      
      return anoLetivo;
    } catch (error) {
      logError('Erro ao buscar ano letivo por ano', 'service', error);
      throw error;
    }
  }

  static async listarTodos(): Promise<AnoLetivo[]> {
    try {
      const anosLetivos = await AnoLetivoModel.listarTodos();
      
      logSuccess('Lista de anos letivos obtida', 'service', { 
        total: anosLetivos.length 
      });
      
      return anosLetivos;
    } catch (error) {
      logError('Erro ao listar anos letivos', 'service', error);
      throw error;
    }
  }

  static async atualizarAnoLetivo(ano_letivo_id: string, anoLetivoAtualizacao: Partial<Omit<AnoLetivo, 'ano_letivo_id' | 'created_at' | 'updated_at'>>): Promise<AnoLetivo | null> {
    try {
      // Verifica se o ano letivo existe
      const anoLetivoExistente = await AnoLetivoModel.buscarPorId(ano_letivo_id);
      if (!anoLetivoExistente) {
        const erro = new Error(`Ano letivo não encontrado com ID: ${ano_letivo_id}`);
        (erro as any).codigo = 'ANO_LETIVO_NAO_ENCONTRADO';
        (erro as any).ano_letivo_id = ano_letivo_id;
        throw erro;
      }

      // Validação do ano se fornecido
      if (anoLetivoAtualizacao.ano !== undefined) {
        const anoAtual = new Date().getFullYear();
        if (anoLetivoAtualizacao.ano < 2000 || anoLetivoAtualizacao.ano > (anoAtual + 10)) {
          const erro = new Error(`Ano inválido: ${anoLetivoAtualizacao.ano}. Deve estar entre 2000 e ${anoAtual + 10}`);
          (erro as any).codigo = 'ANO_INVALIDO';
          (erro as any).ano = anoLetivoAtualizacao.ano;
          (erro as any).ano_minimo = 2000;
          (erro as any).ano_maximo = anoAtual + 10;
          throw erro;
        }

        // Verifica se já existe outro ano letivo para este ano
        if (anoLetivoAtualizacao.ano !== anoLetivoExistente.ano) {
          const outroAnoLetivo = await AnoLetivoModel.buscarPorAno(anoLetivoAtualizacao.ano);
          if (outroAnoLetivo && outroAnoLetivo.ano_letivo_id !== ano_letivo_id) {
            const erro = new Error(`Já existe outro ano letivo cadastrado para o ano: ${anoLetivoAtualizacao.ano}`);
            (erro as any).codigo = 'ANO_LETIVO_DUPLICADO';
            (erro as any).ano = anoLetivoAtualizacao.ano;
            (erro as any).ano_letivo_existente_id = outroAnoLetivo.ano_letivo_id;
            throw erro;
          }
        }
      }

      // Validação de datas se fornecidas
      let dataInicio = anoLetivoExistente.data_inicio;
      let dataFim = anoLetivoExistente.data_fim;
      let ano = anoLetivoExistente.ano;

      if (anoLetivoAtualizacao.data_inicio) {
        dataInicio = new Date(anoLetivoAtualizacao.data_inicio);
      }
      if (anoLetivoAtualizacao.data_fim) {
        dataFim = new Date(anoLetivoAtualizacao.data_fim);
      }
      if (anoLetivoAtualizacao.ano) {
        ano = anoLetivoAtualizacao.ano;
      }

      if (dataFim <= dataInicio) {
        const erro = new Error('Data de fim deve ser posterior à data de início');
        (erro as any).codigo = 'DATA_FIM_INVALIDA';
        (erro as any).data_inicio = dataInicio;
        (erro as any).data_fim = dataFim;
        throw erro;
      }

      // Verifica se as datas estão no ano correto
      if (dataInicio.getFullYear() !== ano) {
        const erro = new Error(`Data de início deve estar no ano ${ano}`);
        (erro as any).codigo = 'DATA_INICIO_ANO_INCORRETO';
        (erro as any).ano_esperado = ano;
        (erro as any).ano_data_inicio = dataInicio.getFullYear();
        throw erro;
      }

      if (dataFim.getFullYear() !== ano && dataFim.getFullYear() !== (ano + 1)) {
        const erro = new Error(`Data de fim deve estar no ano ${ano} ou ${ano + 1}`);
        (erro as any).codigo = 'DATA_FIM_ANO_INCORRETO';
        (erro as any).ano_esperado = ano;
        (erro as any).ano_data_fim = dataFim.getFullYear();
        throw erro;
      }

      const anoLetivoAtualizado = await AnoLetivoModel.atualizar(ano_letivo_id, anoLetivoAtualizacao);
      
      if (!anoLetivoAtualizado) {
        const erro = new Error(`Falha ao atualizar ano letivo com ID: ${ano_letivo_id}`);
        (erro as any).codigo = 'FALHA_ATUALIZACAO';
        (erro as any).ano_letivo_id = ano_letivo_id;
        throw erro;
      }
      
      logSuccess('Ano letivo atualizado com sucesso', 'service', { 
        ano_letivo_id,
        ano: anoLetivoAtualizado.ano
      });
      
      return anoLetivoAtualizado;
    } catch (error) {
      logError('Erro ao atualizar ano letivo', 'service', error);
      throw error;
    }
  }

  static async deletarAnoLetivo(ano_letivo_id: string): Promise<boolean> {
    try {
      // Verifica se o ano letivo existe
      const anoLetivo = await AnoLetivoModel.buscarPorId(ano_letivo_id);
      if (!anoLetivo) {
        logError('Ano letivo não encontrado para deletar', 'service', { ano_letivo_id });
        return false;
      }

      // Deleta o ano letivo
      const deletado = await AnoLetivoModel.deletar(ano_letivo_id);
      
      if (deletado) {
        logSuccess('Ano letivo deletado com sucesso', 'service', { ano_letivo_id });
      } else {
        logError('Falha ao deletar ano letivo', 'service', { ano_letivo_id });
      }
      
      return deletado;
    } catch (error) {
      logError('Erro ao deletar ano letivo', 'service', error);
      throw error;
    }
  }
}

export default AnoLetivoService;
