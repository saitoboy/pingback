import { Request, Response } from 'express';
import AnoLetivoService from '../services/anoLetivo.service';
import { logError, logSuccess } from '../utils/logger';

export class AnoLetivoController {

  static async criarAnoLetivo(req: Request, res: Response) {
    try {
      const anoLetivo = await AnoLetivoService.criarAnoLetivo(req.body);
      
      logSuccess('Ano letivo criado com sucesso', 'controller', {
        ano_letivo_id: anoLetivo?.ano_letivo_id,
        ano: req.body.ano
      });
      
      return res.status(201).json({
        sucesso: true,
        mensagem: 'Ano letivo criado com sucesso',
        dados: anoLetivo
      });
    } catch (error: any) {
      logError('Erro interno ao criar ano letivo', 'controller', error);
      
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
      
      if (error.codigo === 'ANO_INVALIDO') {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Ano inválido',
          erro: {
            codigo: error.codigo,
            ano: error.ano,
            ano_minimo: error.ano_minimo,
            ano_maximo: error.ano_maximo,
            detalhes: `O ano deve estar entre ${error.ano_minimo} e ${error.ano_maximo}`
          }
        });
      }
      
      if (error.codigo === 'ANO_LETIVO_DUPLICADO') {
        return res.status(409).json({
          sucesso: false,
          mensagem: 'Já existe ano letivo para este ano',
          erro: {
            codigo: error.codigo,
            ano: error.ano,
            ano_letivo_existente_id: error.ano_letivo_existente_id,
            detalhes: 'Cada ano pode ter apenas um ano letivo. Use PUT para atualizar.'
          }
        });
      }
      
      if (error.codigo === 'DATA_FIM_INVALIDA') {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Data de fim inválida',
          erro: {
            codigo: error.codigo,
            data_inicio: error.data_inicio,
            data_fim: error.data_fim,
            detalhes: 'A data de fim deve ser posterior à data de início'
          }
        });
      }
      
      if (error.codigo === 'DATA_INICIO_ANO_INCORRETO' || error.codigo === 'DATA_FIM_ANO_INCORRETO') {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Data no ano incorreto',
          erro: {
            codigo: error.codigo,
            ano_esperado: error.ano_esperado,
            detalhes: error.message
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

  static async listarAnosLetivos(req: Request, res: Response) {
    try {
      const anosLetivos = await AnoLetivoService.listarTodos();
      
      logSuccess('Lista de anos letivos obtida', 'controller', {
        total: anosLetivos.length
      });
      
      return res.status(200).json({
        sucesso: true,
        mensagem: 'Lista de anos letivos obtida com sucesso',
        dados: anosLetivos,
        total: anosLetivos.length
      });
    } catch (error: any) {
      logError('Erro interno ao listar anos letivos', 'controller', error);
      
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

  static async buscarAnoLetivoPorId(req: Request, res: Response) {
    try {
      const { ano_letivo_id } = req.params;
      const anoLetivo = await AnoLetivoService.buscarPorId(ano_letivo_id);
      
      if (!anoLetivo) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Ano letivo não encontrado',
          erro: {
            codigo: 'ANO_LETIVO_NAO_ENCONTRADO',
            ano_letivo_id,
            detalhes: 'O ano letivo especificado não existe'
          }
        });
      }
      
      logSuccess('Ano letivo encontrado', 'controller', {
        ano_letivo_id
      });
      
      return res.status(200).json({
        sucesso: true,
        mensagem: 'Ano letivo encontrado',
        dados: anoLetivo
      });
    } catch (error: any) {
      logError('Erro interno ao buscar ano letivo', 'controller', error);
      
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

  static async buscarAnoLetivoPorAno(req: Request, res: Response) {
    try {
      const { ano } = req.params;
      const anoNumerico = parseInt(ano);
      
      if (isNaN(anoNumerico)) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Ano inválido',
          erro: {
            codigo: 'ANO_INVALIDO',
            ano: ano,
            detalhes: 'O ano deve ser um número válido'
          }
        });
      }
      
      const anoLetivo = await AnoLetivoService.buscarPorAno(anoNumerico);
      
      if (!anoLetivo) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Ano letivo não encontrado para este ano',
          erro: {
            codigo: 'ANO_LETIVO_NAO_ENCONTRADO',
            ano: anoNumerico,
            detalhes: 'Não existe ano letivo cadastrado para este ano'
          }
        });
      }
      
      logSuccess('Ano letivo encontrado para o ano', 'controller', {
        ano: anoNumerico,
        ano_letivo_id: anoLetivo.ano_letivo_id
      });
      
      return res.status(200).json({
        sucesso: true,
        mensagem: 'Ano letivo encontrado para o ano',
        dados: anoLetivo
      });
    } catch (error: any) {
      logError('Erro interno ao buscar ano letivo por ano', 'controller', error);
      
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

  static async atualizarAnoLetivo(req: Request, res: Response) {
    try {
      const { ano_letivo_id } = req.params;
      const anoLetivo = await AnoLetivoService.atualizarAnoLetivo(ano_letivo_id, req.body);
      
      logSuccess('Ano letivo atualizado com sucesso', 'controller', {
        ano_letivo_id
      });
      
      return res.status(200).json({
        sucesso: true,
        mensagem: 'Ano letivo atualizado com sucesso',
        dados: anoLetivo
      });
    } catch (error: any) {
      logError('Erro interno ao atualizar ano letivo', 'controller', error);
      
      if (error.codigo === 'ANO_LETIVO_NAO_ENCONTRADO') {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Ano letivo não encontrado',
          erro: {
            codigo: error.codigo,
            ano_letivo_id: error.ano_letivo_id,
            detalhes: 'O ano letivo especificado não existe'
          }
        });
      }
      
      if (error.codigo === 'ANO_INVALIDO') {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Ano inválido',
          erro: {
            codigo: error.codigo,
            ano: error.ano,
            ano_minimo: error.ano_minimo,
            ano_maximo: error.ano_maximo,
            detalhes: `O ano deve estar entre ${error.ano_minimo} e ${error.ano_maximo}`
          }
        });
      }
      
      if (error.codigo === 'ANO_LETIVO_DUPLICADO') {
        return res.status(409).json({
          sucesso: false,
          mensagem: 'Já existe outro ano letivo para este ano',
          erro: {
            codigo: error.codigo,
            ano: error.ano,
            ano_letivo_existente_id: error.ano_letivo_existente_id,
            detalhes: 'Cada ano pode ter apenas um ano letivo'
          }
        });
      }
      
      if (error.codigo === 'DATA_FIM_INVALIDA') {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Data de fim inválida',
          erro: {
            codigo: error.codigo,
            data_inicio: error.data_inicio,
            data_fim: error.data_fim,
            detalhes: 'A data de fim deve ser posterior à data de início'
          }
        });
      }
      
      if (error.codigo === 'DATA_INICIO_ANO_INCORRETO' || error.codigo === 'DATA_FIM_ANO_INCORRETO') {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Data no ano incorreto',
          erro: {
            codigo: error.codigo,
            ano_esperado: error.ano_esperado,
            detalhes: error.message
          }
        });
      }
      
      if (error.codigo === 'FALHA_ATUALIZACAO') {
        return res.status(500).json({
          sucesso: false,
          mensagem: 'Falha ao atualizar ano letivo',
          erro: {
            codigo: error.codigo,
            ano_letivo_id: error.ano_letivo_id,
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

  static async deletarAnoLetivo(req: Request, res: Response) {
    try {
      const { ano_letivo_id } = req.params;
      const deletado = await AnoLetivoService.deletarAnoLetivo(ano_letivo_id);
      
      if (!deletado) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Ano letivo não encontrado',
          erro: {
            codigo: 'ANO_LETIVO_NAO_ENCONTRADO',
            ano_letivo_id,
            detalhes: 'O ano letivo especificado não existe'
          }
        });
      }
      
      logSuccess('Ano letivo deletado com sucesso', 'controller', {
        ano_letivo_id
      });
      
      return res.status(200).json({
        sucesso: true,
        mensagem: 'Ano letivo deletado com sucesso'
      });
    } catch (error: any) {
      logError('Erro interno ao deletar ano letivo', 'controller', error);
      
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

export default AnoLetivoController;
