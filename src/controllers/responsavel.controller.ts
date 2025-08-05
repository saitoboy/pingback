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
          codigo_erro: 'CAMPOS_OBRIGATORIOS',
          dados_faltando: camposFaltando
        });
      }

      const novoResponsavel = await ResponsavelService.criarResponsavel(dadosResponsavel);

      logSuccess('Responsável criado com sucesso', 'controller', { 
        responsavel_id: novoResponsavel.responsavel_id,
        nome: `${novoResponsavel.nome_responsavel} ${novoResponsavel.sobrenome_responsavel}`
      });

      return res.status(201).json({
        success: '✅ Responsável criado com sucesso',
        data: novoResponsavel
      });
      
    } catch (error: any) {
      logError('Erro ao criar responsável', 'controller', error);
      
      // Tratar erros específicos do service
      if (error.codigo) {
        switch (error.codigo) {
          case 'CAMPO_OBRIGATORIO':
            return res.status(400).json({
              error: '❌ Campo obrigatório ausente',
              message: `O campo '${error.campo}' é obrigatório`,
              codigo_erro: 'CAMPO_OBRIGATORIO',
              campo_faltando: error.campo
            });

          case 'CPF_DUPLICADO':
            return res.status(409).json({
              error: '❌ CPF já cadastrado',
              message: `O CPF ${error.cpf} já está cadastrado para outro responsável`,
              codigo_erro: 'CPF_DUPLICADO',
              cpf_problematico: error.cpf
            });

          case 'CPF_INVALIDO':
            return res.status(400).json({
              error: '❌ CPF inválido',
              message: `CPF deve ter exatamente 11 dígitos. Recebido: ${error.cpf}`,
              codigo_erro: 'CPF_INVALIDO',
              cpf_recebido: error.cpf,
              dica: 'Envie apenas números (ex: 12345678901)'
            });

          case 'TELEFONE_INVALIDO':
            return res.status(400).json({
              error: '❌ Telefone inválido',
              message: `Telefone deve ter 10 ou 11 dígitos. Recebido: ${error.telefone}`,
              codigo_erro: 'TELEFONE_INVALIDO',
              telefone_recebido: error.telefone,
              dica: 'Envie apenas números (ex: 11987654321)'
            });

          case 'EMAIL_INVALIDO':
            return res.status(400).json({
              error: '❌ Email inválido',
              message: `O email ${error.email} não possui formato válido`,
              codigo_erro: 'EMAIL_INVALIDO',
              email_recebido: error.email,
              dica: 'Use formato válido como: nome@dominio.com'
            });

          case 'ALUNO_NAO_ENCONTRADO':
            return res.status(404).json({
              error: '❌ Aluno não encontrado',
              message: `Não foi encontrado nenhum aluno com o ID: ${error.aluno_id}`,
              codigo_erro: 'ALUNO_NAO_ENCONTRADO',
              aluno_id_fornecido: error.aluno_id,
              dica: 'Verifique se o aluno_id está correto ou se o aluno existe no sistema'
            });

          case 'PARENTESCO_NAO_ENCONTRADO':
            return res.status(404).json({
              error: '❌ Parentesco não encontrado',
              message: `Não foi encontrado nenhum parentesco com o ID: ${error.parentesco_id}`,
              codigo_erro: 'PARENTESCO_NAO_ENCONTRADO',
              parentesco_id_fornecido: error.parentesco_id,
              dica: 'Verifique se o parentesco_id está correto ou liste os parentescos disponíveis'
            });

          default:
            return res.status(400).json({
              error: '❌ Erro de validação',
              message: error.message || 'Erro desconhecido na validação dos dados',
              codigo_erro: error.codigo
            });
        }
      }

      // Erro genérico
      return res.status(500).json({
        error: '❌ Erro interno do servidor',
        message: 'Ocorreu um erro inesperado ao criar o responsável',
        codigo_erro: 'ERRO_INTERNO'
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
          message: 'ID do responsável é obrigatório',
          codigo_erro: 'ID_OBRIGATORIO'
        });
      }

      const responsavel = await ResponsavelService.buscarPorId(id);
      
      if (!responsavel) {
        return res.status(404).json({
          error: '❌ Responsável não encontrado',
          message: 'Nenhum responsável foi encontrado com este ID',
          codigo_erro: 'RESPONSAVEL_NAO_ENCONTRADO',
          responsavel_id_fornecido: id
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
        message: 'Ocorreu um erro inesperado ao buscar o responsável',
        codigo_erro: 'ERRO_INTERNO'
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
        message: 'Ocorreu um erro inesperado ao listar os responsáveis',
        codigo_erro: 'ERRO_INTERNO'
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
          message: 'ID do aluno é obrigatório',
          codigo_erro: 'ID_ALUNO_OBRIGATORIO'
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
        message: 'Ocorreu um erro inesperado ao listar os responsáveis do aluno',
        codigo_erro: 'ERRO_INTERNO'
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
          message: 'CPF é obrigatório',
          codigo_erro: 'CPF_OBRIGATORIO'
        });
      }

      // Validação básica de formato de CPF
      const cpfLimpo = cpf.replace(/\D/g, '');
      if (cpfLimpo.length !== 11) {
        return res.status(400).json({
          error: '❌ CPF inválido',
          message: `CPF deve ter exatamente 11 dígitos. Recebido: ${cpf} (${cpfLimpo.length} dígitos)`,
          codigo_erro: 'CPF_FORMATO_INVALIDO',
          cpf_recebido: cpf,
          dica: 'Envie apenas números (ex: 12345678901)'
        });
      }

      const responsavel = await ResponsavelService.buscarPorCpf(cpf);
      
      if (!responsavel) {
        return res.status(404).json({
          error: '❌ Responsável não encontrado',
          message: 'Nenhum responsável foi encontrado com este CPF',
          codigo_erro: 'RESPONSAVEL_NAO_ENCONTRADO_CPF',
          cpf_pesquisado: cpfLimpo
        });
      }

      logSuccess('Responsável encontrado por CPF', 'controller', { 
        cpf: cpfLimpo,
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
        message: 'Ocorreu um erro inesperado ao buscar o responsável',
        codigo_erro: 'ERRO_INTERNO'
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
          message: 'ID do responsável é obrigatório',
          codigo_erro: 'ID_OBRIGATORIO'
        });
      }

      const dadosAtualizacao: Partial<Omit<Responsavel, 'responsavel_id' | 'created_at' | 'updated_at'>> = req.body;
      
      if (Object.keys(dadosAtualizacao).length === 0) {
        logError('Nenhum dado fornecido para atualização', 'controller', dadosAtualizacao);
        return res.status(400).json({
          error: '❌ Dados incompletos',
          message: 'Pelo menos um campo deve ser fornecido para atualização',
          codigo_erro: 'NENHUM_CAMPO_PARA_ATUALIZAR'
        });
      }

      const responsavelAtualizado = await ResponsavelService.atualizarResponsavel(id, dadosAtualizacao);
      
      if (!responsavelAtualizado) {
        return res.status(404).json({
          error: '❌ Responsável não encontrado',
          message: 'Não foi possível encontrar o responsável para atualizar',
          codigo_erro: 'RESPONSAVEL_NAO_ENCONTRADO',
          responsavel_id_fornecido: id
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
      
    } catch (error: any) {
      logError('Erro ao atualizar responsável', 'controller', error);
      
      // Tratar erros específicos do service (similares aos de criação)
      if (error.codigo) {
        switch (error.codigo) {
          case 'CPF_DUPLICADO':
            return res.status(409).json({
              error: '❌ CPF já está em uso',
              message: `O CPF ${error.cpf} já está cadastrado para outro responsável`,
              codigo_erro: 'CPF_DUPLICADO',
              cpf_problematico: error.cpf
            });

          case 'CPF_INVALIDO':
            return res.status(400).json({
              error: '❌ CPF inválido',
              message: `CPF deve ter exatamente 11 dígitos. Recebido: ${error.cpf}`,
              codigo_erro: 'CPF_INVALIDO',
              cpf_recebido: error.cpf,
              dica: 'Envie apenas números (ex: 12345678901)'
            });

          case 'TELEFONE_INVALIDO':
            return res.status(400).json({
              error: '❌ Telefone inválido',
              message: `Telefone deve ter 10 ou 11 dígitos. Recebido: ${error.telefone}`,
              codigo_erro: 'TELEFONE_INVALIDO',
              telefone_recebido: error.telefone,
              dica: 'Envie apenas números (ex: 11987654321)'
            });

          case 'EMAIL_INVALIDO':
            return res.status(400).json({
              error: '❌ Email inválido',
              message: `O email ${error.email} não possui formato válido`,
              codigo_erro: 'EMAIL_INVALIDO',
              email_recebido: error.email,
              dica: 'Use formato válido como: nome@dominio.com'
            });

          default:
            return res.status(400).json({
              error: '❌ Erro de validação',
              message: error.message || 'Erro desconhecido na validação dos dados',
              codigo_erro: error.codigo
            });
        }
      }

      return res.status(500).json({
        error: '❌ Erro interno do servidor',
        message: 'Ocorreu um erro inesperado ao atualizar o responsável',
        codigo_erro: 'ERRO_INTERNO'
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
          message: 'ID do responsável é obrigatório',
          codigo_erro: 'ID_OBRIGATORIO'
        });
      }

      const deletado = await ResponsavelService.deletarResponsavel(id);
      
      if (!deletado) {
        return res.status(404).json({
          error: '❌ Responsável não encontrado',
          message: 'Nenhum responsável foi encontrado com este ID para deletar',
          codigo_erro: 'RESPONSAVEL_NAO_ENCONTRADO',
          responsavel_id_fornecido: id
        });
      }

      logSuccess('Responsável deletado com sucesso', 'controller', { responsavel_id: id });

      return res.status(200).json({
        success: '✅ Responsável deletado com sucesso',
        message: 'O responsável foi removido do sistema',
        responsavel_id_deletado: id
      });
      
    } catch (error) {
      logError('Erro interno ao deletar responsável', 'controller', error);
      return res.status(500).json({
        error: '❌ Erro interno do servidor',
        message: 'Ocorreu um erro inesperado ao deletar o responsável',
        codigo_erro: 'ERRO_INTERNO'
      });
    }
  }
}

export default ResponsavelController;
