import * as ResponsavelModel from '../model/responsavel.model';
import * as AlunoModel from '../model/aluno.model';
import * as ParentescoModel from '../model/parentesco.model';
import { Responsavel } from '../types/models';
import { logError, logSuccess } from '../utils/logger';

export class ResponsavelService {
  
  static async criarResponsavel(dadosResponsavel: Omit<Responsavel, 'responsavel_id' | 'created_at' | 'updated_at'>): Promise<Responsavel | null> {
    try {
      // Validações básicas
      const camposObrigatorios = [
        'aluno_id', 'nome_responsavel', 'sobrenome_responsavel', 
        'cpf_responsavel', 'rg_responsavel', 'telefone_responsavel',
        'email_responsavel', 'parentesco_id'
      ];
      
      for (const campo of camposObrigatorios) {
        if (!dadosResponsavel[campo as keyof typeof dadosResponsavel]) {
          logError(`Campo obrigatório ausente: ${campo}`, 'service', dadosResponsavel);
          return null;
        }
      }

      // Verifica se o aluno existe
      const aluno = await AlunoModel.buscarPorId(dadosResponsavel.aluno_id);
      if (!aluno) {
        logError('Aluno não encontrado', 'service', { aluno_id: dadosResponsavel.aluno_id });
        return null;
      }

      // Verifica se o parentesco existe
      const parentesco = await ParentescoModel.buscarPorId(dadosResponsavel.parentesco_id);
      if (!parentesco) {
        logError('Parentesco não encontrado', 'service', { parentesco_id: dadosResponsavel.parentesco_id });
        return null;
      }

      // Verifica se já existe responsável com este CPF
      const responsavelComCpf = await ResponsavelModel.buscarPorCpf(dadosResponsavel.cpf_responsavel);
      if (responsavelComCpf) {
        logError('CPF já cadastrado para outro responsável', 'service', { cpf: dadosResponsavel.cpf_responsavel });
        return null;
      }

      // Validação básica de CPF (apenas números e 11 dígitos)
      const cpfLimpo = dadosResponsavel.cpf_responsavel.replace(/\D/g, '');
      if (cpfLimpo.length !== 11) {
        logError('CPF deve ter 11 dígitos', 'service', { cpf: dadosResponsavel.cpf_responsavel });
        return null;
      }

      // Validação básica de telefone
      const telefoneLimpo = dadosResponsavel.telefone_responsavel.replace(/\D/g, '');
      if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
        logError('Telefone deve ter 10 ou 11 dígitos', 'service', { telefone: dadosResponsavel.telefone_responsavel });
        return null;
      }

      // Validação básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(dadosResponsavel.email_responsavel)) {
        logError('Email inválido', 'service', { email: dadosResponsavel.email_responsavel });
        return null;
      }

      // Cria o responsável
      const novoResponsavel = await ResponsavelModel.criar({
        ...dadosResponsavel,
        cpf_responsavel: cpfLimpo,
        telefone_responsavel: telefoneLimpo,
        nome_responsavel: dadosResponsavel.nome_responsavel.trim(),
        sobrenome_responsavel: dadosResponsavel.sobrenome_responsavel.trim(),
        rg_responsavel: dadosResponsavel.rg_responsavel.trim(),
        email_responsavel: dadosResponsavel.email_responsavel.trim().toLowerCase(),
        grau_instrucao_responsavel: dadosResponsavel.grau_instrucao_responsavel?.trim() || ''
      });
      
      logSuccess('Responsável criado com sucesso', 'service', { 
        responsavel_id: novoResponsavel.responsavel_id,
        nome: `${novoResponsavel.nome_responsavel} ${novoResponsavel.sobrenome_responsavel}`,
        aluno_id: dadosResponsavel.aluno_id
      });
      
      return novoResponsavel;
    } catch (error) {
      logError('Erro ao criar responsável', 'service', error);
      throw error;
    }
  }

  static async buscarPorId(responsavel_id: string): Promise<any | null> {
    try {
      const responsavel = await ResponsavelModel.buscarComDependencias(responsavel_id);
      if (!responsavel) {
        logError('Responsável não encontrado', 'service', { responsavel_id });
        return null;
      }

      logSuccess('Responsável encontrado', 'service', { 
        responsavel_id,
        nome: `${responsavel.nome_responsavel} ${responsavel.sobrenome_responsavel}`
      });
      
      return responsavel;
    } catch (error) {
      logError('Erro ao buscar responsável', 'service', error);
      throw error;
    }
  }

  static async listarTodos(): Promise<any[]> {
    try {
      const responsaveis = await ResponsavelModel.listarComDependencias();
      
      logSuccess('Lista de responsáveis obtida', 'service', { 
        total: responsaveis.length 
      });
      
      return responsaveis;
    } catch (error) {
      logError('Erro ao listar responsáveis', 'service', error);
      throw error;
    }
  }

  static async listarPorAluno(aluno_id: string): Promise<any[]> {
    try {
      // Verifica se o aluno existe
      const aluno = await AlunoModel.buscarPorId(aluno_id);
      if (!aluno) {
        logError('Aluno não encontrado', 'service', { aluno_id });
        return [];
      }

      const responsaveis = await ResponsavelModel.listarPorAlunoComDependencias(aluno_id);
      
      logSuccess('Lista de responsáveis do aluno obtida', 'service', { 
        aluno_id,
        total: responsaveis.length 
      });
      
      return responsaveis;
    } catch (error) {
      logError('Erro ao listar responsáveis por aluno', 'service', error);
      throw error;
    }
  }

  static async buscarPorCpf(cpf_responsavel: string): Promise<any | null> {
    try {
      const cpfLimpo = cpf_responsavel.replace(/\D/g, '');
      const responsavel = await ResponsavelModel.buscarPorCpf(cpfLimpo);
      
      if (!responsavel) {
        logError('Responsável não encontrado por CPF', 'service', { cpf: cpfLimpo });
        return null;
      }

      // Busca dados completos
      const responsavelCompleto = await ResponsavelModel.buscarComDependencias(responsavel.responsavel_id);
      
      logSuccess('Responsável encontrado por CPF', 'service', { 
        cpf: cpfLimpo,
        responsavel_id: responsavel.responsavel_id
      });
      
      return responsavelCompleto;
    } catch (error) {
      logError('Erro ao buscar responsável por CPF', 'service', error);
      throw error;
    }
  }

  static async atualizarResponsavel(responsavel_id: string, dadosAtualizacao: Partial<Omit<Responsavel, 'responsavel_id' | 'created_at' | 'updated_at'>>): Promise<Responsavel | null> {
    try {
      // Verifica se o responsável existe
      const responsavelExistente = await ResponsavelModel.buscarPorId(responsavel_id);
      if (!responsavelExistente) {
        logError('Responsável não encontrado para atualizar', 'service', { responsavel_id });
        return null;
      }

      // Se está atualizando CPF, verifica duplicatas
      if (dadosAtualizacao.cpf_responsavel) {
        const cpfLimpo = dadosAtualizacao.cpf_responsavel.replace(/\D/g, '');
        const responsavelComCpf = await ResponsavelModel.buscarPorCpf(cpfLimpo);
        if (responsavelComCpf && responsavelComCpf.responsavel_id !== responsavel_id) {
          logError('CPF já está sendo usado por outro responsável', 'service', { cpf: cpfLimpo });
          return null;
        }
        dadosAtualizacao.cpf_responsavel = cpfLimpo;
      }

      // Validações de campos se fornecidos
      if (dadosAtualizacao.telefone_responsavel) {
        const telefoneLimpo = dadosAtualizacao.telefone_responsavel.replace(/\D/g, '');
        if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
          logError('Telefone deve ter 10 ou 11 dígitos', 'service', { telefone: dadosAtualizacao.telefone_responsavel });
          return null;
        }
        dadosAtualizacao.telefone_responsavel = telefoneLimpo;
      }

      if (dadosAtualizacao.email_responsavel) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(dadosAtualizacao.email_responsavel)) {
          logError('Email inválido', 'service', { email: dadosAtualizacao.email_responsavel });
          return null;
        }
        dadosAtualizacao.email_responsavel = dadosAtualizacao.email_responsavel.trim().toLowerCase();
      }

      const responsavelAtualizado = await ResponsavelModel.atualizar(responsavel_id, dadosAtualizacao);
      
      logSuccess('Responsável atualizado com sucesso', 'service', { 
        responsavel_id,
        nome: responsavelAtualizado ? `${responsavelAtualizado.nome_responsavel} ${responsavelAtualizado.sobrenome_responsavel}` : 'N/A'
      });
      
      return responsavelAtualizado || null;
    } catch (error) {
      logError('Erro ao atualizar responsável', 'service', error);
      throw error;
    }
  }

  static async deletarResponsavel(responsavel_id: string): Promise<boolean> {
    try {
      // Verifica se o responsável existe
      const responsavel = await ResponsavelModel.buscarPorId(responsavel_id);
      if (!responsavel) {
        logError('Responsável não encontrado para deletar', 'service', { responsavel_id });
        return false;
      }

      // Deleta o responsável
      const deletado = await ResponsavelModel.deletar(responsavel_id);
      
      if (deletado) {
        logSuccess('Responsável deletado com sucesso', 'service', { responsavel_id });
      } else {
        logError('Falha ao deletar responsável', 'service', { responsavel_id });
      }
      
      return deletado;
    } catch (error) {
      logError('Erro ao deletar responsável', 'service', error);
      throw error;
    }
  }
}

export default ResponsavelService;
