import * as ParentescoModel from '../model/parentesco.model';
import { Parentesco } from '../types/models';
import { logError, logSuccess } from '../utils/logger';

export class ParentescoService {
  
  static async criarParentesco(dadosParentesco: Omit<Parentesco, 'parentesco_id' | 'created_at' | 'updated_at'>): Promise<Parentesco | null> {
    try {
      // Validações básicas
      if (!dadosParentesco.nome_parentesco || dadosParentesco.nome_parentesco.trim().length === 0) {
        logError('Nome do parentesco é obrigatório', 'service', dadosParentesco);
        return null;
      }

      // Verifica se já existe um parentesco com este nome
      const parentescoExistente = await ParentescoModel.buscarPorNome(dadosParentesco.nome_parentesco.trim());
      if (parentescoExistente) {
        logError('Parentesco já cadastrado com este nome', 'service', { nome: dadosParentesco.nome_parentesco });
        return null;
      }

      // Cria o parentesco
      const novoParentesco = await ParentescoModel.criar({
        nome_parentesco: dadosParentesco.nome_parentesco.trim()
      });
      
      logSuccess('Parentesco criado com sucesso', 'service', { 
        parentesco_id: novoParentesco.parentesco_id,
        nome: novoParentesco.nome_parentesco
      });
      
      return novoParentesco;
    } catch (error) {
      logError('Erro ao criar parentesco', 'service', error);
      throw error;
    }
  }

  static async buscarPorId(parentesco_id: string): Promise<Parentesco | null> {
    try {
      const parentesco = await ParentescoModel.buscarPorId(parentesco_id);
      if (!parentesco) {
        logError('Parentesco não encontrado', 'service', { parentesco_id });
        return null;
      }

      logSuccess('Parentesco encontrado', 'service', { parentesco_id });
      return parentesco;
    } catch (error) {
      logError('Erro ao buscar parentesco', 'service', error);
      throw error;
    }
  }

  static async listarTodos(): Promise<Parentesco[]> {
    try {
      const parentescos = await ParentescoModel.listarTodos();
      
      logSuccess('Lista de parentescos obtida', 'service', { 
        total: parentescos.length 
      });
      
      return parentescos;
    } catch (error) {
      logError('Erro ao listar parentescos', 'service', error);
      throw error;
    }
  }

  static async atualizarParentesco(parentesco_id: string, dadosAtualizacao: Partial<Omit<Parentesco, 'parentesco_id' | 'created_at' | 'updated_at'>>): Promise<Parentesco | null> {
    try {
      // Verifica se o parentesco existe
      const parentescoExistente = await ParentescoModel.buscarPorId(parentesco_id);
      if (!parentescoExistente) {
        logError('Parentesco não encontrado para atualizar', 'service', { parentesco_id });
        return null;
      }

      // Se está atualizando o nome, verifica duplicatas
      if (dadosAtualizacao.nome_parentesco) {
        const parentescoComNome = await ParentescoModel.buscarPorNome(dadosAtualizacao.nome_parentesco);
        if (parentescoComNome && parentescoComNome.parentesco_id !== parentesco_id) {
          logError('Já existe um parentesco com este nome', 'service', { nome: dadosAtualizacao.nome_parentesco });
          return null;
        }
      }

      const parentescoAtualizado = await ParentescoModel.atualizar(parentesco_id, dadosAtualizacao);
      
      logSuccess('Parentesco atualizado com sucesso', 'service', { 
        parentesco_id,
        nome: parentescoAtualizado?.nome_parentesco
      });
      
      return parentescoAtualizado || null;
    } catch (error) {
      logError('Erro ao atualizar parentesco', 'service', error);
      throw error;
    }
  }

  static async deletarParentesco(parentesco_id: string): Promise<boolean> {
    try {
      // Verifica se o parentesco existe
      const parentesco = await ParentescoModel.buscarPorId(parentesco_id);
      if (!parentesco) {
        logError('Parentesco não encontrado para deletar', 'service', { parentesco_id });
        return false;
      }

      // Deleta o parentesco
      const deletado = await ParentescoModel.deletar(parentesco_id);
      
      if (deletado) {
        logSuccess('Parentesco deletado com sucesso', 'service', { parentesco_id });
      } else {
        logError('Falha ao deletar parentesco', 'service', { parentesco_id });
      }
      
      return deletado;
    } catch (error) {
      logError('Erro ao deletar parentesco', 'service', error);
      throw error;
    }
  }
}

export default ParentescoService;
