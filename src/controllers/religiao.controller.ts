import { Request, Response } from 'express';
import ReligiaoService from '../services/religiao.service';
import { logError, logSuccess } from '../utils/logger';

export class ReligiaoController {
  
  static async criarReligiao(req: Request, res: Response) {
    try {
      const { nome_religiao } = req.body;
      
      if (!nome_religiao) {
        logError('Nome da religião não fornecido', 'controller', req.body);
        return res.status(400).json({ 
          mensagem: 'Campo nome_religiao é obrigatório.' 
        });
      }

      if (typeof nome_religiao !== 'string' || nome_religiao.trim().length === 0) {
        logError('Nome da religião inválido', 'controller', { nome_religiao });
        return res.status(400).json({ 
          mensagem: 'Nome da religião deve ser um texto válido.' 
        });
      }

      const novaReligiao = await ReligiaoService.criarReligiao({
        nome_religiao: nome_religiao.trim()
      });
      
      if (!novaReligiao) {
        logError('Falha ao criar religião no service', 'controller', { nome_religiao });
        return res.status(400).json({ 
          mensagem: 'Não foi possível criar a religião. Verifique se o nome não está duplicado.' 
        });
      }

      logSuccess(`Religião criada com sucesso: ${novaReligiao.nome_religiao}`, 'controller', { 
        religiao_id: novaReligiao.religiao_id 
      });
      
      return res.status(201).json({ 
        mensagem: 'Religião criada com sucesso.',
        religiao: novaReligiao 
      });
      
    } catch (error: any) {
      if (error.code === '23505') {
        logError('Erro ao criar religião: nome duplicado (constraint)', 'controller', error);
        return res.status(409).json({ 
          mensagem: 'Já existe uma religião com este nome.' 
        });
      }
      
      logError('Erro inesperado ao criar religião', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async buscarReligiaoPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        logError('ID da religião não fornecido', 'controller', req.params);
        return res.status(400).json({ 
          mensagem: 'ID da religião é obrigatório.' 
        });
      }

      const religiao = await ReligiaoService.buscarPorId(id);
      
      if (!religiao) {
        logError(`Religião não encontrada: ${id}`, 'controller', { id });
        return res.status(404).json({ 
          mensagem: 'Religião não encontrada.' 
        });
      }

      logSuccess(`Religião encontrada: ${religiao.nome_religiao}`, 'controller', { religiao_id: id });
      return res.status(200).json({ religiao });
      
    } catch (error: any) {
      logError('Erro inesperado ao buscar religião', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async listarReligioes(req: Request, res: Response) {
    try {
      const religioes = await ReligiaoService.listarTodas();
      
      logSuccess('Lista de religiões obtida com sucesso', 'controller', { 
        total: religioes.length 
      });
      
      return res.status(200).json({ 
        religioes,
        total: religioes.length 
      });
      
    } catch (error: any) {
      logError('Erro inesperado ao listar religiões', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async atualizarReligiao(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        logError('ID da religião não fornecido para atualização', 'controller', req.params);
        return res.status(400).json({ 
          mensagem: 'ID da religião é obrigatório.' 
        });
      }

      if (Object.keys(req.body).length === 0) {
        logError('Nenhum dado fornecido para atualização', 'controller', req.body);
        return res.status(400).json({ 
          mensagem: 'Pelo menos um campo deve ser fornecido para atualização.' 
        });
      }

      const religiaoAtualizada = await ReligiaoService.atualizarReligiao(id, req.body);
      
      if (!religiaoAtualizada) {
        logError(`Falha ao atualizar religião: ${id}`, 'controller', { religiao_id: id });
        return res.status(404).json({ 
          mensagem: 'Religião não encontrada ou dados inválidos.' 
        });
      }

      logSuccess(`Religião atualizada: ${religiaoAtualizada.nome_religiao}`, 'controller', { 
        religiao_id: id 
      });
      
      return res.status(200).json({ 
        mensagem: 'Religião atualizada com sucesso.',
        religiao: religiaoAtualizada 
      });
      
    } catch (error: any) {
      logError('Erro inesperado ao atualizar religião', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async removerReligiao(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        logError('ID da religião não fornecido para deletar', 'controller', req.params);
        return res.status(400).json({ 
          mensagem: 'ID da religião é obrigatório.' 
        });
      }

      const deletado = await ReligiaoService.deletarReligiao(id);
      
      if (!deletado) {
        logError(`Religião não encontrada para deletar: ${id}`, 'controller', { religiao_id: id });
        return res.status(404).json({ 
          mensagem: 'Religião não encontrada.' 
        });
      }

      logSuccess(`Religião deletada com sucesso: ${id}`, 'controller', { religiao_id: id });
      return res.status(200).json({ 
        mensagem: 'Religião deletada com sucesso.' 
      });
      
    } catch (error: any) {
      if (error.code === '23503') {
        logError('Erro ao deletar religião: constraint de FK (alunos dependentes)', 'controller', error);
        return res.status(400).json({ 
          mensagem: 'Não é possível deletar esta religião pois existem alunos vinculados a ela.' 
        });
      }
      
      logError('Erro inesperado ao deletar religião', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }
}

export default ReligiaoController;
