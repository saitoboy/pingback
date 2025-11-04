import { Request, Response } from 'express';
import { AtividadeService } from '../services/atividade.service';
import { TipoUsuario } from '../types/models';
import logger from '../utils/logger';

export class AtividadeController {

  // GET /api/atividade - Listar todas as atividades
  static async listarTodas(req: Request, res: Response): Promise<void> {
    try {
      logger.info('📝 Controller: Listando atividades', 'atividade');
      
      const atividades = await AtividadeService.listarTodas();
      
      res.status(200).json({
        success: true,
        message: `${atividades.length} atividades encontradas`,
        data: atividades
      });
    } catch (error) {
      logger.error('❌ Controller: Erro ao listar atividades', 'atividade', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // GET /api/atividade/:atividade_id - Buscar atividade por ID
  static async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const { atividade_id } = req.params;
      logger.info(`📝 Controller: Buscando atividade ${atividade_id}`, 'atividade');
      
      const atividade = await AtividadeService.buscarPorId(atividade_id);
      
      if (!atividade) {
        res.status(404).json({
          success: false,
          message: 'Atividade não encontrada'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Atividade encontrada',
        data: atividade
      });
    } catch (error) {
      logger.error('❌ Controller: Erro ao buscar atividade', 'atividade', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // GET /api/atividade/aula/:aula_id - Buscar atividades por aula
  static async buscarPorAula(req: Request, res: Response): Promise<void> {
    try {
      const { aula_id } = req.params;
      logger.info(`📝 Controller: Buscando atividades da aula ${aula_id}`, 'atividade');
      
      const atividades = await AtividadeService.buscarPorAula(aula_id);
      
      res.status(200).json({
        success: true,
        message: `${atividades.length} atividades encontradas para a aula`,
        data: atividades
      });
    } catch (error) {
      logger.error('❌ Controller: Erro ao buscar atividades da aula', 'atividade', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // GET /api/atividade/vinculacao/:turma_disciplina_professor_id - Buscar atividades por vinculação
  static async buscarPorVinculacao(req: Request, res: Response): Promise<void> {
    try {
      const { turma_disciplina_professor_id } = req.params;
      logger.info(`📝 Controller: Buscando atividades da vinculação ${turma_disciplina_professor_id}`, 'atividade');
      
      const atividades = await AtividadeService.buscarPorVinculacao(turma_disciplina_professor_id);
      
      res.status(200).json({
        success: true,
        message: `${atividades.length} atividades encontradas para a vinculação`,
        data: atividades
      });
    } catch (error) {
      logger.error('❌ Controller: Erro ao buscar atividades da vinculação', 'atividade', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // GET /api/atividade/periodo/:periodo_letivo_id - Buscar atividades por período
  static async buscarPorPeriodo(req: Request, res: Response): Promise<void> {
    try {
      const { periodo_letivo_id } = req.params;
      logger.info(`📝 Controller: Buscando atividades do período ${periodo_letivo_id}`, 'atividade');
      
      const atividades = await AtividadeService.buscarPorPeriodo(periodo_letivo_id);
      
      res.status(200).json({
        success: true,
        message: `${atividades.length} atividades encontradas para o período`,
        data: atividades
      });
    } catch (error) {
      logger.error('❌ Controller: Erro ao buscar atividades do período', 'atividade', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // GET /api/atividade/avaliativas - Buscar atividades que valem nota
  static async buscarQueValemNota(req: Request, res: Response): Promise<void> {
    try {
      const { turma_disciplina_professor_id } = req.query;
      logger.info('📝 Controller: Buscando atividades avaliativas', 'atividade');
      
      const atividades = await AtividadeService.buscarQueValemNota(turma_disciplina_professor_id as string);
      
      res.status(200).json({
        success: true,
        message: `${atividades.length} atividades avaliativas encontradas`,
        data: atividades
      });
    } catch (error) {
      logger.error('❌ Controller: Erro ao buscar atividades avaliativas', 'atividade', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // GET /api/atividade/detalhes/:atividade_id? - Buscar atividades com detalhes
  static async buscarComDetalhes(req: Request, res: Response): Promise<void> {
    try {
      const { atividade_id } = req.params;
      logger.info('📝 Controller: Buscando atividades com detalhes', 'atividade');
      
      const resultado = await AtividadeService.buscarComDetalhes(atividade_id);
      
      if (atividade_id && !resultado) {
        res.status(404).json({
          success: false,
          message: 'Atividade não encontrada'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: atividade_id ? 'Atividade encontrada com detalhes' : 'Atividades listadas com detalhes',
        data: resultado
      });
    } catch (error) {
      logger.error('❌ Controller: Erro ao buscar atividades com detalhes', 'atividade', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // POST /api/atividade - Criar nova atividade
  static async criar(req: Request, res: Response): Promise<void> {
    try {
      const dadosAtividade = req.body;
      const usuario = (req as any).usuario;
      
      logger.info(`📝 Controller: Criando atividade: ${dadosAtividade.titulo}`, 'atividade');

      // Verificar se o professor pode criar atividade na vinculação especificada
      if (usuario.tipo_usuario_id === TipoUsuario.PROFESSOR) {
        // Para criação, não temos atividade_id ainda, então vamos apenas validar na service
        // A validação será feita no model através das FK constraints
      }

      const novaAtividade = await AtividadeService.criar(dadosAtividade);
      
      res.status(201).json({
        success: true,
        message: 'Atividade criada com sucesso',
        data: novaAtividade
      });
    } catch (error) {
      logger.error('❌ Controller: Erro ao criar atividade', 'atividade', error);
      
      // Tratar erros específicos
      if (error instanceof Error) {
        if (error.message.includes('não encontrada')) {
          res.status(404).json({
            success: false,
            message: error.message
          });
        } else if (error.message.includes('obrigatório') || error.message.includes('deve ser maior')) {
          res.status(400).json({
            success: false,
            message: error.message
          });
        } else {
          res.status(500).json({
            success: false,
            message: error.message
          });
        }
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  // PUT /api/atividade/:atividade_id - Atualizar atividade
  static async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { atividade_id } = req.params;
      const dadosAtualizacao = req.body;
      const usuario = (req as any).usuario;
      
      logger.info(`📝 Controller: Atualizando atividade ${atividade_id}`, 'atividade');

      // Verificar permissões: professor só pode atualizar suas próprias atividades
      if (usuario.tipo_usuario_id === TipoUsuario.PROFESSOR) {
        const temAcesso = await AtividadeService.verificarAcessoProfessor(atividade_id, usuario.usuario_id);
        if (!temAcesso) {
          res.status(403).json({
            success: false,
            message: 'Você só pode atualizar suas próprias atividades'
          });
          return;
        }
      }

      const atividadeAtualizada = await AtividadeService.atualizar(atividade_id, dadosAtualizacao);
      
      if (!atividadeAtualizada) {
        res.status(404).json({
          success: false,
          message: 'Atividade não encontrada'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Atividade atualizada com sucesso',
        data: atividadeAtualizada
      });
    } catch (error) {
      logger.error('❌ Controller: Erro ao atualizar atividade', 'atividade', error);
      
      if (error instanceof Error) {
        if (error.message.includes('não encontrada')) {
          res.status(404).json({
            success: false,
            message: error.message
          });
        } else if (error.message.includes('não pode ser vazio') || error.message.includes('caracteres')) {
          res.status(400).json({
            success: false,
            message: error.message
          });
        } else {
          res.status(500).json({
            success: false,
            message: error.message
          });
        }
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  // DELETE /api/atividade/:atividade_id - Deletar atividade
  static async deletar(req: Request, res: Response): Promise<void> {
    try {
      const { atividade_id } = req.params;
      const usuario = (req as any).usuario;
      
      logger.info(`📝 Controller: Deletando atividade ${atividade_id}`, 'atividade');

      // Verificar permissões: apenas ADMIN e PROFESSOR (suas próprias atividades)
      if (usuario.tipo_usuario_id === TipoUsuario.SECRETARIO) {
        res.status(403).json({
          success: false,
          message: 'Secretários não podem deletar atividades'
        });
        return;
      }

      if (usuario.tipo_usuario_id === TipoUsuario.PROFESSOR) {
        const temAcesso = await AtividadeService.verificarAcessoProfessor(atividade_id, usuario.usuario_id);
        if (!temAcesso) {
          res.status(403).json({
            success: false,
            message: 'Você só pode deletar suas próprias atividades'
          });
          return;
        }
      }

      const resultado = await AtividadeService.deletar(atividade_id);
      
      if (!resultado) {
        res.status(404).json({
          success: false,
          message: 'Atividade não encontrada'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Atividade deletada com sucesso'
      });
    } catch (error) {
      logger.error('❌ Controller: Erro ao deletar atividade', 'atividade', error);
      
      if (error instanceof Error) {
        if (error.message.includes('possui notas registradas')) {
          res.status(400).json({
            success: false,
            message: error.message,
            error: error.message
          });
        } else if (error.message.includes('não encontrada')) {
          res.status(404).json({
            success: false,
            message: error.message
          });
        } else {
          res.status(500).json({
            success: false,
            message: error.message
          });
        }
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  // GET /api/atividade/estatisticas/professor/:professor_id - Estatísticas do professor
  static async estatisticasPorProfessor(req: Request, res: Response): Promise<void> {
    try {
      const { professor_id } = req.params;
      const usuario = (req as any).usuario;
      
      logger.info(`📝 Controller: Buscando estatísticas do professor ${professor_id}`, 'atividade');

      // Verificar permissões: professor só pode ver suas próprias estatísticas
      if (usuario.tipo_usuario_id === TipoUsuario.PROFESSOR && usuario.usuario_id !== professor_id) {
        res.status(403).json({
          success: false,
          message: 'Você só pode ver suas próprias estatísticas'
        });
        return;
      }

      const estatisticas = await AtividadeService.estatisticasPorProfessor(professor_id);
      
      res.status(200).json({
        success: true,
        message: 'Estatísticas obtidas com sucesso',
        data: estatisticas
      });
    } catch (error) {
      logger.error('❌ Controller: Erro ao buscar estatísticas', 'atividade', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }
}
