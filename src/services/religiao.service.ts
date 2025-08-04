import * as ReligiaoModel from '../model/religiao.model';
import { Religiao } from '../types/models';
import { logError, logSuccess } from '../utils/logger';

export class ReligiaoService {
  
  static async criarReligiao(dadosReligiao: Omit<Religiao, 'religiao_id' | 'created_at' | 'updated_at'>): Promise<Religiao | null> {
    try {
      // Validações básicas
      if (!dadosReligiao.nome_religiao || dadosReligiao.nome_religiao.trim().length === 0) {
        logError('Nome da religião é obrigatório', 'service', dadosReligiao);
        return null;
      }

      // Verifica se já existe uma religião com este nome
      const religiaoExistente = await ReligiaoModel.buscarPorNome(dadosReligiao.nome_religiao.trim());
      if (religiaoExistente) {
        logError('Religião já cadastrada com este nome', 'service', { nome: dadosReligiao.nome_religiao });
        return null;
      }

      // Cria a religião
      const novaReligiao = await ReligiaoModel.criar({
        nome_religiao: dadosReligiao.nome_religiao.trim()
      });
      
      logSuccess('Religião criada com sucesso', 'service', { 
        religiao_id: novaReligiao.religiao_id,
        nome: novaReligiao.nome_religiao
      });
      
      return novaReligiao;
    } catch (error) {
      logError('Erro ao criar religião', 'service', error);
      throw error;
    }
  }

  static async buscarPorId(religiao_id: string): Promise<Religiao | null> {
    try {
      const religiao = await ReligiaoModel.buscarPorId(religiao_id);
      if (!religiao) {
        logError('Religião não encontrada', 'service', { religiao_id });
        return null;
      }

      logSuccess('Religião encontrada', 'service', { religiao_id });
      return religiao;
    } catch (error) {
      logError('Erro ao buscar religião', 'service', error);
      throw error;
    }
  }

  static async listarTodas(): Promise<Religiao[]> {
    try {
      const religioes = await ReligiaoModel.listarTodos();
      
      logSuccess('Lista de religiões obtida', 'service', { 
        total: religioes.length 
      });
      
      return religioes;
    } catch (error) {
      logError('Erro ao listar religiões', 'service', error);
      throw error;
    }
  }

  static async atualizarReligiao(religiao_id: string, dadosAtualizacao: Partial<Omit<Religiao, 'religiao_id' | 'created_at' | 'updated_at'>>): Promise<Religiao | null> {
    try {
      // Verifica se a religião existe
      const religiaoExistente = await ReligiaoModel.buscarPorId(religiao_id);
      if (!religiaoExistente) {
        logError('Religião não encontrada para atualizar', 'service', { religiao_id });
        return null;
      }

      // Se está atualizando o nome, verifica duplicatas
      if (dadosAtualizacao.nome_religiao) {
        const religiaoComNome = await ReligiaoModel.buscarPorNome(dadosAtualizacao.nome_religiao);
        if (religiaoComNome && religiaoComNome.religiao_id !== religiao_id) {
          logError('Já existe uma religião com este nome', 'service', { nome: dadosAtualizacao.nome_religiao });
          return null;
        }
      }

      const religiaoAtualizada = await ReligiaoModel.atualizar(religiao_id, dadosAtualizacao);
      
      logSuccess('Religião atualizada com sucesso', 'service', { 
        religiao_id,
        nome: religiaoAtualizada?.nome_religiao
      });
      
      return religiaoAtualizada || null;
    } catch (error) {
      logError('Erro ao atualizar religião', 'service', error);
      throw error;
    }
  }

  static async deletarReligiao(religiao_id: string): Promise<boolean> {
    try {
      // Verifica se a religião existe
      const religiao = await ReligiaoModel.buscarPorId(religiao_id);
      if (!religiao) {
        logError('Religião não encontrada para deletar', 'service', { religiao_id });
        return false;
      }

      // Deleta a religião
      const deletado = await ReligiaoModel.deletar(religiao_id);
      
      if (deletado) {
        logSuccess('Religião deletada com sucesso', 'service', { religiao_id });
      } else {
        logError('Falha ao deletar religião', 'service', { religiao_id });
      }
      
      return deletado;
    } catch (error) {
      logError('Erro ao deletar religião', 'service', error);
      throw error;
    }
  }
}

export default ReligiaoService;
