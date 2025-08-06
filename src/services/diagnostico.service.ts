import * as DiagnosticoModel from '../model/diagnostico.model';
// import * as AlunoModel from '../model/aluno.model'; // TEMPORÁRIO: Comentado até tabela aluno estar pronta
import { Diagnostico } from '../types/models';
import { logError, logSuccess } from '../utils/logger';

export class DiagnosticoService {
  
  static async criarDiagnostico(diagnostico: Omit<Diagnostico, 'diagnostico_id' | 'created_at' | 'updated_at'>): Promise<Diagnostico | null> {
    try {
      // Validações básicas
      const camposObrigatorios = [
        'aluno_id', 'cegueira', 'baixa_visao', 'surdez', 'deficiencia_auditiva',
        'surdocegueira', 'deficiencia_fisica', 'deficiencia_multipla', 
        'deficiencia_intelectual', 'sindrome_down', 'altas_habilidades',
        'tea', 'alteracoes_processamento_auditivo', 'tdah'
      ];
      
      for (const campo of camposObrigatorios) {
        if (diagnostico[campo as keyof typeof diagnostico] === undefined || diagnostico[campo as keyof typeof diagnostico] === null) {
          const erro = new Error(`Campo obrigatório ausente: ${campo}`);
          (erro as any).codigo = 'CAMPO_OBRIGATORIO';
          (erro as any).campo = campo;
          throw erro;
        }
      }

      // TEMPORÁRIO: Comentando validação de aluno até tabela estar pronta
      /* const aluno = await AlunoModel.buscarPorId(diagnostico.aluno_id);
      if (!aluno) {
        const erro = new Error(`Aluno não encontrado com ID: ${diagnostico.aluno_id}`);
        (erro as any).codigo = 'ALUNO_NAO_ENCONTRADO';
        (erro as any).aluno_id = diagnostico.aluno_id;
        throw erro;
      } */

      // Verifica se já existe diagnóstico para este aluno
      const diagnosticoExistente = await DiagnosticoModel.buscarPorAlunoId(diagnostico.aluno_id);
      if (diagnosticoExistente) {
        const erro = new Error(`Já existe diagnóstico cadastrado para este aluno: ${diagnostico.aluno_id}`);
        (erro as any).codigo = 'DIAGNOSTICO_DUPLICADO';
        (erro as any).aluno_id = diagnostico.aluno_id;
        (erro as any).diagnostico_existente_id = diagnosticoExistente.diagnostico_id;
        throw erro;
      }

      // Validação de campos de texto
      const dadosLimpos = { ...diagnostico };
      
      // Limpa e valida o campo outros_diagnosticos
      if (dadosLimpos.outros_diagnosticos) {
        const valor = String(dadosLimpos.outros_diagnosticos).trim();
        if (valor.length > 500) {
          const erro = new Error(`Campo outros_diagnosticos deve ter no máximo 500 caracteres. Recebido: ${valor.length} caracteres`);
          (erro as any).codigo = 'CAMPO_MUITO_LONGO';
          (erro as any).campo = 'outros_diagnosticos';
          (erro as any).tamanho_atual = valor.length;
          (erro as any).tamanho_maximo = 500;
          throw erro;
        }
        dadosLimpos.outros_diagnosticos = valor;
      } else {
        // Se não fornecido, define como string vazia
        dadosLimpos.outros_diagnosticos = '';
      }

      // Cria o diagnóstico
      const novoDiagnostico = await DiagnosticoModel.criar(dadosLimpos);
      
      logSuccess('Diagnóstico criado com sucesso', 'service', { 
        diagnostico_id: novoDiagnostico.diagnostico_id,
        aluno_id: diagnostico.aluno_id
      });
      
      return novoDiagnostico;
    } catch (error) {
      logError('Erro ao criar diagnóstico', 'service', error);
      throw error;
    }
  }

  static async buscarPorId(diagnostico_id: string): Promise<any | null> {
    try {
      const diagnostico = await DiagnosticoModel.buscarComDependencias(diagnostico_id);
      if (!diagnostico) {
        logError('Diagnóstico não encontrado', 'service', { diagnostico_id });
        return null;
      }

      logSuccess('Diagnóstico encontrado', 'service', { 
        diagnostico_id
        // TEMPORÁRIO: Removido aluno até tabela estar pronta
      });
      
      return diagnostico;
    } catch (error) {
      logError('Erro ao buscar diagnóstico', 'service', error);
      throw error;
    }
  }

  static async buscarPorAlunoId(aluno_id: string): Promise<any | null> {
    try {
      // TEMPORÁRIO: Comentando validação de aluno até tabela estar pronta
      /* const aluno = await AlunoModel.buscarPorId(aluno_id);
      if (!aluno) {
        const erro = new Error(`Aluno não encontrado com ID: ${aluno_id}`);
        (erro as any).codigo = 'ALUNO_NAO_ENCONTRADO';
        (erro as any).aluno_id = aluno_id;
        throw erro;
      } */

      const diagnostico = await DiagnosticoModel.buscarPorAlunoComDependencias(aluno_id);
      if (!diagnostico) {
        logError('Diagnóstico não encontrado para o aluno', 'service', { aluno_id });
        return null;
      }

      logSuccess('Diagnóstico encontrado para o aluno', 'service', { 
        aluno_id,
        diagnostico_id: diagnostico.diagnostico_id
      });
      
      return diagnostico;
    } catch (error) {
      logError('Erro ao buscar diagnóstico por aluno', 'service', error);
      throw error;
    }
  }

  static async listarTodos(): Promise<any[]> {
    try {
      const diagnosticos = await DiagnosticoModel.listarComDependencias();
      
      logSuccess('Lista de diagnósticos obtida', 'service', { 
        total: diagnosticos.length 
      });
      
      return diagnosticos;
    } catch (error) {
      logError('Erro ao listar diagnósticos', 'service', error);
      throw error;
    }
  }

  static async atualizarDiagnostico(diagnostico_id: string, diagnosticoAtualizacao: Partial<Omit<Diagnostico, 'diagnostico_id' | 'created_at' | 'updated_at'>>): Promise<Diagnostico | null> {
    try {
      // Verifica se o diagnóstico existe
      const diagnosticoExistente = await DiagnosticoModel.buscarPorId(diagnostico_id);
      if (!diagnosticoExistente) {
        const erro = new Error(`Diagnóstico não encontrado com ID: ${diagnostico_id}`);
        (erro as any).codigo = 'DIAGNOSTICO_NAO_ENCONTRADO';
        (erro as any).diagnostico_id = diagnostico_id;
        throw erro;
      }

      // Validação de campo de texto se fornecido
      const dadosLimpos = { ...diagnosticoAtualizacao };
      
      if (dadosLimpos.outros_diagnosticos !== undefined) {
        const valor = String(dadosLimpos.outros_diagnosticos).trim();
        if (valor.length > 500) {
          const erro = new Error(`Campo outros_diagnosticos deve ter no máximo 500 caracteres. Recebido: ${valor.length} caracteres`);
          (erro as any).codigo = 'CAMPO_MUITO_LONGO';
          (erro as any).campo = 'outros_diagnosticos';
          (erro as any).tamanho_atual = valor.length;
          (erro as any).tamanho_maximo = 500;
          throw erro;
        }
        dadosLimpos.outros_diagnosticos = valor;
      }

      const diagnosticoAtualizado = await DiagnosticoModel.atualizar(diagnostico_id, dadosLimpos);
      
      if (!diagnosticoAtualizado) {
        const erro = new Error(`Falha ao atualizar diagnóstico com ID: ${diagnostico_id}`);
        (erro as any).codigo = 'FALHA_ATUALIZACAO';
        (erro as any).diagnostico_id = diagnostico_id;
        throw erro;
      }
      
      logSuccess('Diagnóstico atualizado com sucesso', 'service', { 
        diagnostico_id,
        aluno_id: diagnosticoAtualizado.aluno_id
      });
      
      return diagnosticoAtualizado;
    } catch (error) {
      logError('Erro ao atualizar diagnóstico', 'service', error);
      throw error;
    }
  }

  static async deletarDiagnostico(diagnostico_id: string): Promise<boolean> {
    try {
      // Verifica se o diagnóstico existe
      const diagnostico = await DiagnosticoModel.buscarPorId(diagnostico_id);
      if (!diagnostico) {
        logError('Diagnóstico não encontrado para deletar', 'service', { diagnostico_id });
        return false;
      }

      // Deleta o diagnóstico
      const deletado = await DiagnosticoModel.deletar(diagnostico_id);
      
      if (deletado) {
        logSuccess('Diagnóstico deletado com sucesso', 'service', { diagnostico_id });
      } else {
        logError('Falha ao deletar diagnóstico', 'service', { diagnostico_id });
      }
      
      return deletado;
    } catch (error) {
      logError('Erro ao deletar diagnóstico', 'service', error);
      throw error;
    }
  }
}

export default DiagnosticoService;
