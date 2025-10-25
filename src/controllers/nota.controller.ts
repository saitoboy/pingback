import { Request, Response } from 'express';
import { NotaService } from '../services/nota.service';
import { TipoUsuario } from '../types/models';
import logger from '../utils/logger';

export class NotaController {

  static async listarTodas(req: Request, res: Response): Promise<Response> {
    try {
      const notas = await NotaService.listarTodas();
      
      return res.status(200).json({
        success: true,
        message: `${notas.length} notas encontradas`,
        data: notas
      });
    } catch (error) {
      logger.error('❌ Erro no controller ao listar notas:', 'controller', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async buscarPorId(req: Request, res: Response): Promise<Response> {
    try {
      const { nota_id } = req.params;
      const nota = await NotaService.buscarPorId(nota_id);
      
      if (!nota) {
        return res.status(404).json({
          success: false,
          message: 'Nota não encontrada',
          data: null
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Nota encontrada com sucesso',
        data: nota
      });
    } catch (error) {
      logger.error('❌ Erro no controller ao buscar nota por ID:', 'controller', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async buscarComDetalhes(req: Request, res: Response): Promise<Response> {
    try {
      const { nota_id } = req.params;
      
      if (nota_id) {
        // Buscar nota específica com detalhes
        const nota = await NotaService.buscarComDetalhesPorId(nota_id);
        
        if (!nota) {
          return res.status(404).json({
            success: false,
            message: 'Nota não encontrada',
            data: null
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Nota com detalhes encontrada com sucesso',
          data: nota
        });
      } else {
        // Buscar todas as notas com detalhes
        const notas = await NotaService.buscarComDetalhes();
        
        return res.status(200).json({
          success: true,
          message: `${notas.length} notas com detalhes encontradas`,
          data: notas
        });
      }
    } catch (error) {
      logger.error('❌ Erro no controller ao buscar notas com detalhes:', 'controller', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async buscarPorAtividade(req: Request, res: Response): Promise<Response> {
    try {
      const { atividade_id } = req.params;
      const notas = await NotaService.buscarPorAtividade(atividade_id);
      
      return res.status(200).json({
        success: true,
        message: `${notas.length} notas encontradas para a atividade`,
        data: notas
      });
    } catch (error) {
      logger.error('❌ Erro no controller ao buscar notas por atividade:', 'controller', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async buscarPorAluno(req: Request, res: Response): Promise<Response> {
    try {
      const { matricula_aluno_id } = req.params;
      const notas = await NotaService.buscarPorAluno(matricula_aluno_id);
      
      return res.status(200).json({
        success: true,
        message: `${notas.length} notas encontradas para o aluno`,
        data: notas
      });
    } catch (error) {
      logger.error('❌ Erro no controller ao buscar notas por aluno:', 'controller', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async buscarPorTurmaEDisciplina(req: Request, res: Response): Promise<Response> {
    try {
      const { turma_id, disciplina_id } = req.params;
      const notas = await NotaService.buscarPorTurmaEDisciplina(turma_id, disciplina_id);
      
      return res.status(200).json({
        success: true,
        message: `${notas.length} notas encontradas para turma/disciplina`,
        data: notas
      });
    } catch (error) {
      logger.error('❌ Erro no controller ao buscar notas por turma e disciplina:', 'controller', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async estatisticasPorAluno(req: Request, res: Response): Promise<Response> {
    try {
      const { matricula_aluno_id } = req.params;
      const stats = await NotaService.estatisticasPorAluno(matricula_aluno_id);
      
      return res.status(200).json({
        success: true,
        message: 'Estatísticas de notas geradas com sucesso',
        data: stats
      });
    } catch (error) {
      logger.error('❌ Erro no controller ao buscar estatísticas por aluno:', 'controller', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async criar(req: Request, res: Response): Promise<Response> {
    try {
      const dadosNota = req.body;
      const usuario = (req as any).usuario;

      // Validar permissões específicas para professores
      if (usuario.tipo_usuario_id === TipoUsuario.PROFESSOR) {
        // Professor só pode criar notas para suas próprias atividades
        // Verificar se a atividade pertence ao professor logado
        const atividade = await require('../model/atividade.model').buscarPorId(dadosNota.atividade_id);
        if (!atividade) {
          return res.status(404).json({
            success: false,
            message: 'Atividade não encontrada'
          });
        }

        const vinculacao = await require('../model/turmaDisciplinaProfessor.model').buscarPorId(atividade.turma_disciplina_professor_id);
        if (!vinculacao || vinculacao.professor_id !== usuario.professor_id) {
          return res.status(403).json({
            success: false,
            message: 'Acesso negado: você só pode criar notas para suas próprias atividades'
          });
        }
      }

      const novaNota = await NotaService.criar(dadosNota);
      
      return res.status(201).json({
        success: true,
        message: 'Nota criada com sucesso',
        data: novaNota
      });
    } catch (error) {
      logger.error('❌ Erro no controller ao criar nota:', 'controller', error);
      
      // Tratamento de erros específicos
      if (error instanceof Error) {
        if (error.message.includes('não vale nota')) {
          return res.status(400).json({
            success: false,
            message: 'Esta atividade não aceita notas',
            error: error.message
          });
        }
        
        if (error.message.includes('já existe nota')) {
          return res.status(409).json({
            success: false,
            message: 'Conflito: nota já existe',
            error: error.message
          });
        }
        
        if (error.message.includes('não está com matrícula ativa')) {
          return res.status(400).json({
            success: false,
            message: 'Aluno com matrícula inativa',
            error: error.message
          });
        }
        
        if (error.message.includes('deve estar entre 0 e 10')) {
          return res.status(400).json({
            success: false,
            message: 'Valor da nota inválido',
            error: error.message
          });
        }
      }

      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async lancarNotasLote(req: Request, res: Response): Promise<Response> {
    try {
      const { atividade_id, notas } = req.body;
      const usuario = (req as any).usuario;

      // Validações básicas
      if (!atividade_id || !notas || !Array.isArray(notas)) {
        return res.status(400).json({
          success: false,
          message: 'Campos obrigatórios: atividade_id e notas (array)'
        });
      }

      if (notas.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'O array de notas não pode estar vazio'
        });
      }

      // Validar estrutura de cada nota
      for (const nota of notas) {
        if (!nota.matricula_aluno_id || nota.valor === undefined) {
          return res.status(400).json({
            success: false,
            message: 'Cada item do array deve conter matricula_aluno_id e valor'
          });
        }
        
        if (typeof nota.valor !== 'number' || nota.valor < 0 || nota.valor > 10) {
          return res.status(400).json({
            success: false,
            message: 'O valor da nota deve ser um número entre 0 e 10'
          });
        }
      }

      // Validar permissões específicas para professores
      if (usuario.tipo_usuario_id === TipoUsuario.PROFESSOR) {
        // Professor só pode lançar notas para suas próprias atividades
        const atividade = await require('../model/atividade.model').buscarPorId(atividade_id);
        if (!atividade) {
          return res.status(404).json({
            success: false,
            message: 'Atividade não encontrada'
          });
        }

        const vinculacao = await require('../model/turmaDisciplinaProfessor.model').buscarPorId(atividade.turma_disciplina_professor_id);
        if (!vinculacao || vinculacao.professor_id !== usuario.professor_id) {
          return res.status(403).json({
            success: false,
            message: 'Acesso negado: você só pode lançar notas para suas próprias atividades'
          });
        }
      }

      logger.info(`Controller: Lançando notas em lote para atividade ${atividade_id}`);
      
      const notasRegistradas = await NotaService.lancarNotasLote(atividade_id, notas);
      
      return res.status(201).json({
        success: true,
        data: notasRegistradas,
        message: `Notas em lote lançadas com sucesso. Total: ${notasRegistradas.length} registros`
      });
    } catch (error) {
      logger.error('❌ Erro no controller ao lançar notas em lote:', 'controller', error);
      
      if (error instanceof Error) {
        if (error.message.includes('não encontrada') || error.message.includes('não encontrado')) {
          return res.status(404).json({
            success: false,
            message: error.message
          });
        }
        
        if (error.message.includes('obrigatório') || error.message.includes('deve ser maior')) {
          return res.status(400).json({
            success: false,
            message: error.message
          });
        }
        
        if (error.message.includes('Já existe')) {
          return res.status(409).json({
            success: false,
            message: error.message
          });
        }
      }
      
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async atualizar(req: Request, res: Response): Promise<Response> {
    try {
      const { nota_id } = req.params;
      const dadosAtualizacao = req.body;
      const usuario = (req as any).usuario;

      // Validar permissões específicas para professores
      if (usuario.tipo_usuario_id === TipoUsuario.PROFESSOR) {
        // Professor só pode atualizar notas de suas próprias atividades
        const nota = await NotaService.buscarComDetalhesPorId(nota_id);
        if (!nota) {
          return res.status(404).json({
            success: false,
            message: 'Nota não encontrada'
          });
        }

        const atividade = await require('../model/atividade.model').buscarPorId(nota.atividade_id);
        const vinculacao = await require('../model/turmaDisciplinaProfessor.model').buscarPorId(atividade.turma_disciplina_professor_id);
        
        if (!vinculacao || vinculacao.professor_id !== usuario.professor_id) {
          return res.status(403).json({
            success: false,
            message: 'Acesso negado: você só pode atualizar notas de suas próprias atividades'
          });
        }
      }

      const notaAtualizada = await NotaService.atualizar(nota_id, dadosAtualizacao);
      
      if (!notaAtualizada) {
        return res.status(404).json({
          success: false,
          message: 'Nota não encontrada para atualização'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Nota atualizada com sucesso',
        data: notaAtualizada
      });
    } catch (error) {
      logger.error('❌ Erro no controller ao atualizar nota:', 'controller', error);
      
      // Tratamento de erros específicos
      if (error instanceof Error && error.message.includes('deve estar entre 0 e 10')) {
        return res.status(400).json({
          success: false,
          message: 'Valor da nota inválido',
          error: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async deletar(req: Request, res: Response): Promise<Response> {
    try {
      const { nota_id } = req.params;
      const usuario = (req as any).usuario;

      // Validar permissões específicas para professores
      if (usuario.tipo_usuario_id === TipoUsuario.PROFESSOR) {
        // Professor só pode deletar notas de suas próprias atividades
        const nota = await NotaService.buscarComDetalhesPorId(nota_id);
        if (!nota) {
          return res.status(404).json({
            success: false,
            message: 'Nota não encontrada'
          });
        }

        const atividade = await require('../model/atividade.model').buscarPorId(nota.atividade_id);
        const vinculacao = await require('../model/turmaDisciplinaProfessor.model').buscarPorId(atividade.turma_disciplina_professor_id);
        
        if (!vinculacao || vinculacao.professor_id !== usuario.professor_id) {
          return res.status(403).json({
            success: false,
            message: 'Acesso negado: você só pode deletar notas de suas próprias atividades'
          });
        }
      }

      const sucesso = await NotaService.deletar(nota_id);
      
      if (!sucesso) {
        return res.status(404).json({
          success: false,
          message: 'Nota não encontrada para exclusão'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Nota deletada com sucesso'
      });
    } catch (error) {
      logger.error('❌ Erro no controller ao deletar nota:', 'controller', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
}
