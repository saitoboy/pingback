import { Request, Response } from 'express';
import { ResponsavelService } from '../services/responsavel.service';
import { Responsavel } from '../types/models';
import { logError, logInfo, logSuccess } from '../utils/logger';

export class ResponsavelController {

  static async criarResponsavel(req: Request, res: Response): Promise<Response> {
    logInfo('Iniciando criação de responsável', 'controller', req.body);
    
    try {
      const dadosResponsavel: Omit<Responsavel, 'responsavel_id' | 'created_at' | 'updated_at'> = req.body;
      
      // Validação básica dos dados obrigatórios
      const camposObrigatorios = [
        'aluno_id', 'nome_responsavel', 'sobrenome_responsavel',
        'cpf_responsavel', 'rg_responsavel', 'telefone_responsavel',
        'email_responsavel', 'parentesco_id'
      ];
      
      const camposFaltando = camposObrigatorios.filter(campo => 
        !req.body[campo] || req.body[campo].toString().trim() === ''
      );
      
      if (camposFaltando.length > 0) {
        logError('Campos obrigatórios ausentes', 'controller', { camposFaltando });
        return res.status(400).json({
          error: '❌ Dados incompletos',
          message: `Os seguintes campos são obrigatórios: ${camposFaltando.join(', ')}`,
          dados_faltando: camposFaltando
        });
      }

      const novoResponsavel = await ResponsavelService.criarResponsavel(dadosResponsavel);
      
      if (!novoResponsavel) {
        logError('Falha na criação do responsável no service', 'controller', dadosResponsavel);
        return res.status(400).json({
          error: '❌ Erro na validação',
          message: 'Não foi possível criar o responsável. Verifique os dados fornecidos.'
        });
      }

      logSuccess('Responsável criado com sucesso', 'controller', { 
        responsavel_id: novoResponsavel.responsavel_id,
        nome: `${novoResponsavel.nome_responsavel} ${novoResponsavel.sobrenome_responsavel}`
      });

      return res.status(201).json({
        success: '✅ Responsável criado com sucesso',
        data: novoResponsavel
      });
      
    } catch (error) {
      logError('Erro interno ao criar responsável', 'controller', error);
      return res.status(500).json({
        error: '❌ Erro interno do servidor',
        message: 'Ocorreu um erro inesperado ao criar o responsável'
      });
    }
  }

  static async buscarResponsavelPorId(req: Request, res: Response): Promise<Response> {
    logInfo('Buscando responsável por ID', 'controller', { responsavel_id: req.params.id });
    
    try {
      const { id } = req.params;
      
      if (!id || id.trim() === '') {
        logError('ID do responsável não fornecido', 'controller', { id });
        return res.status(400).json({
          error: '❌ ID inválido',
          message: 'ID do responsável é obrigatório'
        });
      }

      const responsavel = await ResponsavelService.buscarPorId(id);
      
      if (!responsavel) {
        return res.status(404).json({
          error: '❌ Responsável não encontrado',
          message: 'Nenhum responsável foi encontrado com este ID'
        });
      }

      logSuccess('Responsável encontrado', 'controller', { 
        responsavel_id: id,
        nome: `${responsavel.nome_responsavel} ${responsavel.sobrenome_responsavel}`
      });

      return res.status(200).json({
        success: '✅ Responsável encontrado',
        data: responsavel
      });
      
    } catch (error) {
      logError('Erro interno ao buscar responsável', 'controller', error);
      return res.status(500).json({
        error: '❌ Erro interno do servidor',
        message: 'Ocorreu um erro inesperado ao buscar o responsável'
      });
    }
  }

  static async listarResponsaveis(req: Request, res: Response): Promise<Response> {
    logInfo('Listando todos os responsáveis', 'controller');
    
    try {
      const responsaveis = await ResponsavelService.listarTodos();

      logSuccess('Lista de responsáveis obtida', 'controller', { total: responsaveis.length });

      return res.status(200).json({
        success: '✅ Lista de responsáveis obtida com sucesso',
        total: responsaveis.length,
        data: responsaveis
      });
      
    } catch (error) {
      logError('Erro interno ao listar responsáveis', 'controller', error);
      return res.status(500).json({
        error: '❌ Erro interno do servidor',
        message: 'Ocorreu um erro inesperado ao listar os responsáveis'
      });
    }
  }

  static async listarResponsaveisPorAluno(req: Request, res: Response): Promise<Response> {
    logInfo('Listando responsáveis por aluno', 'controller', { aluno_id: req.params.aluno_id });
    
    try {
      const { aluno_id } = req.params;
      
      if (!aluno_id || aluno_id.trim() === '') {
        logError('ID do aluno não fornecido', 'controller', { aluno_id });
        return res.status(400).json({
          error: '❌ ID inválido',
          message: 'ID do aluno é obrigatório'
        });
      }

      const responsaveis = await ResponsavelService.listarPorAluno(aluno_id);

      logSuccess('Lista de responsáveis do aluno obtida', 'controller', { 
        aluno_id,
        total: responsaveis.length 
      });

      return res.status(200).json({
        success: '✅ Lista de responsáveis do aluno obtida com sucesso',
        aluno_id,
        total: responsaveis.length,
        data: responsaveis
      });
      
    } catch (error) {
      logError('Erro interno ao listar responsáveis por aluno', 'controller', error);
      return res.status(500).json({
        error: '❌ Erro interno do servidor',
        message: 'Ocorreu um erro inesperado ao listar os responsáveis do aluno'
      });
    }
  }

  static async buscarResponsavelPorCpf(req: Request, res: Response): Promise<Response> {
    logInfo('Buscando responsável por CPF', 'controller', { cpf: req.params.cpf });
    
    try {
      const { cpf } = req.params;
      
      if (!cpf || cpf.trim() === '') {
        logError('CPF não fornecido', 'controller', { cpf });
        return res.status(400).json({
          error: '❌ CPF inválido',
          message: 'CPF é obrigatório'
        });
      }

      const responsavel = await ResponsavelService.buscarPorCpf(cpf);
      
      if (!responsavel) {
        return res.status(404).json({
          error: '❌ Responsável não encontrado',
          message: 'Nenhum responsável foi encontrado com este CPF'
        });
      }

      logSuccess('Responsável encontrado por CPF', 'controller', { 
        cpf,
        responsavel_id: responsavel.responsavel_id
      });

      return res.status(200).json({
        success: '✅ Responsável encontrado',
        data: responsavel
      });
      
    } catch (error) {
      logError('Erro interno ao buscar responsável por CPF', 'controller', error);
      return res.status(500).json({
        error: '❌ Erro interno do servidor',
        message: 'Ocorreu um erro inesperado ao buscar o responsável'
      });
    }
  }

  static async atualizarResponsavel(req: Request, res: Response): Promise<Response> {
    logInfo('Atualizando responsável', 'controller', { 
      responsavel_id: req.params.id,
      dados: req.body 
    });
    
    try {
      const { id } = req.params;
      
      if (!id || id.trim() === '') {
        logError('ID do responsável não fornecido', 'controller', { id });
        return res.status(400).json({
          error: '❌ ID inválido',
          message: 'ID do responsável é obrigatório'
        });
      }

      const dadosAtualizacao: Partial<Omit<Responsavel, 'responsavel_id' | 'created_at' | 'updated_at'>> = req.body;
      
      if (Object.keys(dadosAtualizacao).length === 0) {
        logError('Nenhum dado fornecido para atualização', 'controller', dadosAtualizacao);
        return res.status(400).json({
          error: '❌ Dados incompletos',
          message: 'Pelo menos um campo deve ser fornecido para atualização'
        });
      }

      const responsavelAtualizado = await ResponsavelService.atualizarResponsavel(id, dadosAtualizacao);
      
      if (!responsavelAtualizado) {
        return res.status(404).json({
          error: '❌ Responsável não encontrado ou dados inválidos',
          message: 'Não foi possível atualizar o responsável'
        });
      }

      logSuccess('Responsável atualizado com sucesso', 'controller', { 
        responsavel_id: id,
        nome: `${responsavelAtualizado.nome_responsavel} ${responsavelAtualizado.sobrenome_responsavel}`
      });

      return res.status(200).json({
        success: '✅ Responsável atualizado com sucesso',
        data: responsavelAtualizado
      });
      
    } catch (error) {
      logError('Erro interno ao atualizar responsável', 'controller', error);
      return res.status(500).json({
        error: '❌ Erro interno do servidor',
        message: 'Ocorreu um erro inesperado ao atualizar o responsável'
      });
    }
  }

  static async deletarResponsavel(req: Request, res: Response): Promise<Response> {
    logInfo('Deletando responsável', 'controller', { responsavel_id: req.params.id });
    
    try {
      const { id } = req.params;
      
      if (!id || id.trim() === '') {
        logError('ID do responsável não fornecido', 'controller', { id });
        return res.status(400).json({
          error: '❌ ID inválido',
          message: 'ID do responsável é obrigatório'
        });
      }

      const deletado = await ResponsavelService.deletarResponsavel(id);
      
      if (!deletado) {
        return res.status(404).json({
          error: '❌ Responsável não encontrado',
          message: 'Nenhum responsável foi encontrado com este ID para deletar'
        });
      }

      logSuccess('Responsável deletado com sucesso', 'controller', { responsavel_id: id });

      return res.status(200).json({
        success: '✅ Responsável deletado com sucesso',
        message: 'O responsável foi removido do sistema'
      });
      
    } catch (error) {
      logError('Erro interno ao deletar responsável', 'controller', error);
      return res.status(500).json({
        error: '❌ Erro interno do servidor',
        message: 'Ocorreu um erro inesperado ao deletar o responsável'
      });
    }
  }
}

export default ResponsavelController;
