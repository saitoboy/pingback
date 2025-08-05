import { Request, Response } from 'express';
import ParentescoService from '../services/parentesco.service';
import { logError, logSuccess } from '../utils/logger';

export class ParentescoController {
  
  static async criarParentesco(req: Request, res: Response) {
    try {
      const { nome_parentesco } = req.body;
      
      if (!nome_parentesco) {
        logError('Nome do parentesco não fornecido', 'controller', req.body);
        return res.status(400).json({ 
          mensagem: 'Campo nome_parentesco é obrigatório.' 
        });
      }

      if (typeof nome_parentesco !== 'string' || nome_parentesco.trim().length === 0) {
        logError('Nome do parentesco inválido', 'controller', { nome_parentesco });
        return res.status(400).json({ 
          mensagem: 'Nome do parentesco deve ser um texto válido.' 
        });
      }

      const novoParentesco = await ParentescoService.criarParentesco({
        nome_parentesco: nome_parentesco.trim()
      });
      
      if (!novoParentesco) {
        logError('Falha ao criar parentesco no service', 'controller', { nome_parentesco });
        return res.status(400).json({ 
          mensagem: 'Não foi possível criar o parentesco. Verifique se o nome não está duplicado.' 
        });
      }

      logSuccess(`Parentesco criado com sucesso: ${novoParentesco.nome_parentesco}`, 'controller', { 
        parentesco_id: novoParentesco.parentesco_id 
      });
      
      return res.status(201).json({ 
        mensagem: 'Parentesco criado com sucesso.',
        parentesco: novoParentesco 
      });
      
    } catch (error: any) {
      if (error.code === '23505') {
        logError('Erro ao criar parentesco: nome duplicado (constraint)', 'controller', error);
        return res.status(409).json({ 
          mensagem: 'Já existe um parentesco com este nome.' 
        });
      }
      
      logError('Erro inesperado ao criar parentesco', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async buscarParentescoPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        logError('ID do parentesco não fornecido', 'controller', req.params);
        return res.status(400).json({ 
          mensagem: 'ID do parentesco é obrigatório.' 
        });
      }

      const parentesco = await ParentescoService.buscarPorId(id);
      
      if (!parentesco) {
        logError(`Parentesco não encontrado: ${id}`, 'controller', { id });
        return res.status(404).json({ 
          mensagem: 'Parentesco não encontrado.' 
        });
      }

      logSuccess(`Parentesco encontrado: ${parentesco.nome_parentesco}`, 'controller', { parentesco_id: id });
      return res.status(200).json({ parentesco });
      
    } catch (error: any) {
      logError('Erro inesperado ao buscar parentesco', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async listarParentescos(req: Request, res: Response) {
    try {
      const parentescos = await ParentescoService.listarTodos();
      
      logSuccess('Lista de parentescos obtida com sucesso', 'controller', { 
        total: parentescos.length 
      });
      
      return res.status(200).json({ 
        parentescos,
        total: parentescos.length 
      });
      
    } catch (error: any) {
      logError('Erro inesperado ao listar parentescos', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async atualizarParentesco(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        logError('ID do parentesco não fornecido para atualização', 'controller', req.params);
        return res.status(400).json({ 
          mensagem: 'ID do parentesco é obrigatório.' 
        });
      }

      if (Object.keys(req.body).length === 0) {
        logError('Nenhum dado fornecido para atualização', 'controller', req.body);
        return res.status(400).json({ 
          mensagem: 'Pelo menos um campo deve ser fornecido para atualização.' 
        });
      }

      const parentescoAtualizado = await ParentescoService.atualizarParentesco(id, req.body);
      
      if (!parentescoAtualizado) {
        logError(`Falha ao atualizar parentesco: ${id}`, 'controller', { parentesco_id: id });
        return res.status(404).json({ 
          mensagem: 'Parentesco não encontrado ou dados inválidos.' 
        });
      }

      logSuccess(`Parentesco atualizado: ${parentescoAtualizado.nome_parentesco}`, 'controller', { 
        parentesco_id: id 
      });
      
      return res.status(200).json({ 
        mensagem: 'Parentesco atualizado com sucesso.',
        parentesco: parentescoAtualizado 
      });
      
    } catch (error: any) {
      logError('Erro inesperado ao atualizar parentesco', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async removerParentesco(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        logError('ID do parentesco não fornecido para deletar', 'controller', req.params);
        return res.status(400).json({ 
          mensagem: 'ID do parentesco é obrigatório.' 
        });
      }

      const deletado = await ParentescoService.deletarParentesco(id);
      
      if (!deletado) {
        logError(`Parentesco não encontrado para deletar: ${id}`, 'controller', { parentesco_id: id });
        return res.status(404).json({ 
          mensagem: 'Parentesco não encontrado.' 
        });
      }

      logSuccess(`Parentesco deletado com sucesso: ${id}`, 'controller', { parentesco_id: id });
      return res.status(200).json({ 
        mensagem: 'Parentesco deletado com sucesso.' 
      });
      
    } catch (error: any) {
      if (error.code === '23503') {
        logError('Erro ao deletar parentesco: constraint de FK (responsáveis dependentes)', 'controller', error);
        return res.status(400).json({ 
          mensagem: 'Não é possível deletar este parentesco pois existem responsáveis vinculados a ele.' 
        });
      }
      
      logError('Erro inesperado ao deletar parentesco', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }
}

export default ParentescoController;
