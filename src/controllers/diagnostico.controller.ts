import { Request, Response } from 'express';
import DiagnosticoService from '../services/diagnostico.service';
import { logError, logSuccess } from '../utils/logger';

export class DiagnosticoController {

  static async criarDiagnostico(req: Request, res: Response) {
    try {
      const diagnostico = await DiagnosticoService.criarDiagnostico(req.body);
      
      logSuccess('Diagnóstico criado com sucesso', 'controller', {
        diagnostico_id: diagnostico?.diagnostico_id,
        aluno_id: req.body.aluno_id
      });
      
      return res.status(201).json({
        sucesso: true,
        mensagem: 'Diagnóstico criado com sucesso',
        dados: diagnostico
      });
    } catch (error: any) {
      logError('Erro interno ao criar diagnóstico', 'controller', error);
      
      // Tratamento específico de erros conhecidos
      if (error.codigo === 'CAMPO_OBRIGATORIO') {
        return res.status(400).json({
          sucesso: false,
          mensagem: `Campo obrigatório: ${error.campo}`,
          erro: {
            codigo: error.codigo,
            campo: error.campo,
            detalhes: 'Este campo é obrigatório e deve ser fornecido'
          }
        });
      }
      
      if (error.codigo === 'ALUNO_NAO_ENCONTRADO') {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Aluno não encontrado',
          erro: {
            codigo: error.codigo,
            aluno_id: error.aluno_id,
            detalhes: 'O aluno especificado não existe no sistema'
          }
        });
      }
      
      if (error.codigo === 'DIAGNOSTICO_DUPLICADO') {
        return res.status(409).json({
          sucesso: false,
          mensagem: 'Já existe diagnóstico para este aluno',
          erro: {
            codigo: error.codigo,
            aluno_id: error.aluno_id,
            diagnostico_existente_id: error.diagnostico_existente_id,
            detalhes: 'Cada aluno pode ter apenas um diagnóstico. Use PUT para atualizar.'
          }
        });
      }
      
      if (error.codigo === 'CAMPO_MUITO_LONGO') {
        return res.status(400).json({
          sucesso: false,
          mensagem: `Campo ${error.campo} excede o tamanho máximo`,
          erro: {
            codigo: error.codigo,
            campo: error.campo,
            tamanho_atual: error.tamanho_atual,
            tamanho_maximo: error.tamanho_maximo,
            detalhes: `O campo deve ter no máximo ${error.tamanho_maximo} caracteres`
          }
        });
      }

      // Erros de banco de dados
      if (error.code) {
        return res.status(500).json({
          sucesso: false,
          mensagem: 'Erro interno do banco de dados',
          erro: {
            codigo_bd: error.code,
            mensagem_bd: error.message,
            detalhes_bd: {
              severity: error.severity,
              position: error.position,
              file: error.file,
              line: error.line,
              routine: error.routine
            }
          }
        });
      }
      
      // Erro genérico
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        erro: {
          detalhes: error.message || 'Erro desconhecido'
        }
      });
    }
  }

  static async listarDiagnosticos(req: Request, res: Response) {
    try {
      const diagnosticos = await DiagnosticoService.listarTodos();
      
      logSuccess('Lista de diagnósticos obtida', 'controller', {
        total: diagnosticos.length
      });
      
      return res.status(200).json({
        sucesso: true,
        mensagem: 'Lista de diagnósticos obtida com sucesso',
        dados: diagnosticos,
        total: diagnosticos.length
      });
    } catch (error: any) {
      logError('Erro interno ao listar diagnósticos', 'controller', error);
      
      // Erros de banco de dados
      if (error.code) {
        return res.status(500).json({
          sucesso: false,
          mensagem: 'Erro interno do banco de dados',
          erro: {
            codigo_bd: error.code,
            mensagem_bd: error.message,
            detalhes_bd: {
              severity: error.severity,
              position: error.position,
              file: error.file,
              line: error.line,
              routine: error.routine
            }
          }
        });
      }
      
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        erro: {
          detalhes: error.message || 'Erro desconhecido'
        }
      });
    }
  }

  static async buscarDiagnosticoPorId(req: Request, res: Response) {
    try {
      const { diagnostico_id } = req.params;
      const diagnostico = await DiagnosticoService.buscarPorId(diagnostico_id);
      
      if (!diagnostico) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Diagnóstico não encontrado',
          erro: {
            codigo: 'DIAGNOSTICO_NAO_ENCONTRADO',
            diagnostico_id,
            detalhes: 'O diagnóstico especificado não existe'
          }
        });
      }
      
      logSuccess('Diagnóstico encontrado', 'controller', {
        diagnostico_id
      });
      
      return res.status(200).json({
        sucesso: true,
        mensagem: 'Diagnóstico encontrado',
        dados: diagnostico
      });
    } catch (error: any) {
      logError('Erro interno ao buscar diagnóstico', 'controller', error);
      
      if (error.code) {
        return res.status(500).json({
          sucesso: false,
          mensagem: 'Erro interno do banco de dados',
          erro: {
            codigo_bd: error.code,
            mensagem_bd: error.message,
            detalhes_bd: {
              severity: error.severity,
              position: error.position,
              file: error.file,
              line: error.line,
              routine: error.routine
            }
          }
        });
      }
      
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        erro: {
          detalhes: error.message || 'Erro desconhecido'
        }
      });
    }
  }

  static async buscarDiagnosticoPorAluno(req: Request, res: Response) {
    try {
      const { aluno_id } = req.params;
      const diagnostico = await DiagnosticoService.buscarPorAlunoId(aluno_id);
      
      if (!diagnostico) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Diagnóstico não encontrado para este aluno',
          erro: {
            codigo: 'DIAGNOSTICO_NAO_ENCONTRADO',
            aluno_id,
            detalhes: 'Este aluno não possui diagnóstico cadastrado'
          }
        });
      }
      
      logSuccess('Diagnóstico encontrado para o aluno', 'controller', {
        aluno_id,
        diagnostico_id: diagnostico.diagnostico_id
      });
      
      return res.status(200).json({
        sucesso: true,
        mensagem: 'Diagnóstico encontrado para o aluno',
        dados: diagnostico
      });
    } catch (error: any) {
      logError('Erro interno ao buscar diagnóstico por aluno', 'controller', error);
      
      if (error.codigo === 'ALUNO_NAO_ENCONTRADO') {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Aluno não encontrado',
          erro: {
            codigo: error.codigo,
            aluno_id: error.aluno_id,
            detalhes: 'O aluno especificado não existe no sistema'
          }
        });
      }
      
      if (error.code) {
        return res.status(500).json({
          sucesso: false,
          mensagem: 'Erro interno do banco de dados',
          erro: {
            codigo_bd: error.code,
            mensagem_bd: error.message,
            detalhes_bd: {
              severity: error.severity,
              position: error.position,
              file: error.file,
              line: error.line,
              routine: error.routine
            }
          }
        });
      }
      
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        erro: {
          detalhes: error.message || 'Erro desconhecido'
        }
      });
    }
  }

  static async atualizarDiagnostico(req: Request, res: Response) {
    try {
      const { diagnostico_id } = req.params;
      const diagnostico = await DiagnosticoService.atualizarDiagnostico(diagnostico_id, req.body);
      
      logSuccess('Diagnóstico atualizado com sucesso', 'controller', {
        diagnostico_id
      });
      
      return res.status(200).json({
        sucesso: true,
        mensagem: 'Diagnóstico atualizado com sucesso',
        dados: diagnostico
      });
    } catch (error: any) {
      logError('Erro interno ao atualizar diagnóstico', 'controller', error);
      
      if (error.codigo === 'DIAGNOSTICO_NAO_ENCONTRADO') {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Diagnóstico não encontrado',
          erro: {
            codigo: error.codigo,
            diagnostico_id: error.diagnostico_id,
            detalhes: 'O diagnóstico especificado não existe'
          }
        });
      }
      
      if (error.codigo === 'CAMPO_MUITO_LONGO') {
        return res.status(400).json({
          sucesso: false,
          mensagem: `Campo ${error.campo} excede o tamanho máximo`,
          erro: {
            codigo: error.codigo,
            campo: error.campo,
            tamanho_atual: error.tamanho_atual,
            tamanho_maximo: error.tamanho_maximo,
            detalhes: `O campo deve ter no máximo ${error.tamanho_maximo} caracteres`
          }
        });
      }
      
      if (error.codigo === 'FALHA_ATUALIZACAO') {
        return res.status(500).json({
          sucesso: false,
          mensagem: 'Falha ao atualizar diagnóstico',
          erro: {
            codigo: error.codigo,
            diagnostico_id: error.diagnostico_id,
            detalhes: 'Erro interno ao processar atualização'
          }
        });
      }
      
      if (error.code) {
        return res.status(500).json({
          sucesso: false,
          mensagem: 'Erro interno do banco de dados',
          erro: {
            codigo_bd: error.code,
            mensagem_bd: error.message,
            detalhes_bd: {
              severity: error.severity,
              position: error.position,
              file: error.file,
              line: error.line,
              routine: error.routine
            }
          }
        });
      }
      
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        erro: {
          detalhes: error.message || 'Erro desconhecido'
        }
      });
    }
  }

  static async deletarDiagnostico(req: Request, res: Response) {
    try {
      const { diagnostico_id } = req.params;
      const deletado = await DiagnosticoService.deletarDiagnostico(diagnostico_id);
      
      if (!deletado) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Diagnóstico não encontrado',
          erro: {
            codigo: 'DIAGNOSTICO_NAO_ENCONTRADO',
            diagnostico_id,
            detalhes: 'O diagnóstico especificado não existe'
          }
        });
      }
      
      logSuccess('Diagnóstico deletado com sucesso', 'controller', {
        diagnostico_id
      });
      
      return res.status(200).json({
        sucesso: true,
        mensagem: 'Diagnóstico deletado com sucesso'
      });
    } catch (error: any) {
      logError('Erro interno ao deletar diagnóstico', 'controller', error);
      
      if (error.code) {
        return res.status(500).json({
          sucesso: false,
          mensagem: 'Erro interno do banco de dados',
          erro: {
            codigo_bd: error.code,
            mensagem_bd: error.message,
            detalhes_bd: {
              severity: error.severity,
              position: error.position,
              file: error.file,
              line: error.line,
              routine: error.routine
            }
          }
        });
      }
      
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        erro: {
          detalhes: error.message || 'Erro desconhecido'
        }
      });
    }
  }
}

export default DiagnosticoController;
