import { Request, Response } from 'express';
import AlocacaoProfessorService from '../services/alocacaoProfessor.service';
import { logError, logSuccess, logInfo } from '../utils/logger';

/**
 * Controller para gerenciar alocação de professores em disciplinas
 */
export class AlocacaoProfessorController {

  /**
   * Lista todas as alocações de um ano letivo
   * GET /alocacao-professor/ano-letivo/:ano_letivo_id
   */
  static async listarPorAnoLetivo(req: Request, res: Response) {
    try {
      const { ano_letivo_id } = req.params;

      if (!ano_letivo_id) {
        return res.status(400).json({
          status: 'erro',
          mensagem: 'ID do ano letivo é obrigatório'
        });
      }

      const alocacoes = await AlocacaoProfessorService.listarAlocacoesPorAnoLetivo(ano_letivo_id);

      return res.status(200).json({
        status: 'sucesso',
        mensagem: 'Alocações listadas com sucesso',
        dados: alocacoes,
        total: alocacoes.length
      });
    } catch (error: any) {
      logError('Erro ao listar alocações por ano letivo', 'controller', error);
      return res.status(500).json({
        status: 'erro',
        mensagem: 'Erro ao listar alocações',
        detalhes: error.message
      });
    }
  }

  /**
   * Lista alocações de um professor específico
   * GET /alocacao-professor/professor/:professor_id
   */
  static async listarPorProfessor(req: Request, res: Response) {
    try {
      const { professor_id } = req.params;

      if (!professor_id) {
        return res.status(400).json({
          status: 'erro',
          mensagem: 'ID do professor é obrigatório'
        });
      }

      const alocacoes = await AlocacaoProfessorService.listarAlocacoesPorProfessor(professor_id);

      return res.status(200).json({
        status: 'sucesso',
        mensagem: 'Alocações do professor listadas com sucesso',
        dados: alocacoes,
        total: alocacoes.length
      });
    } catch (error: any) {
      logError('Erro ao listar alocações do professor', 'controller', error);
      return res.status(500).json({
        status: 'erro',
        mensagem: 'Erro ao listar alocações do professor',
        detalhes: error.message
      });
    }
  }

  /**
   * Cria uma ou múltiplas alocações
   * POST /alocacao-professor
   */
  static async criar(req: Request, res: Response) {
    try {
      const { alocacoes } = req.body;

      // Validação
      if (!alocacoes || !Array.isArray(alocacoes) || alocacoes.length === 0) {
        return res.status(400).json({
          status: 'erro',
          mensagem: 'Alocações devem ser fornecidas como array'
        });
      }

      // Validar cada alocação
      for (const alocacao of alocacoes) {
        if (!alocacao.turma_id || !alocacao.disciplina_id || !alocacao.professor_id) {
          return res.status(400).json({
            status: 'erro',
            mensagem: 'Cada alocação deve conter turma_id, disciplina_id e professor_id'
          });
        }
      }

      const resultado = await AlocacaoProfessorService.criarAlocacoes(alocacoes);

      logSuccess(`Alocações criadas: ${resultado.criadas.length}`, 'controller');

      return res.status(201).json({
        status: 'sucesso',
        mensagem: `${resultado.criadas.length} alocações criadas com sucesso`,
        dados: resultado
      });
    } catch (error: any) {
      logError('Erro ao criar alocações', 'controller', error);
      return res.status(500).json({
        status: 'erro',
        mensagem: error.message || 'Erro ao criar alocações',
        detalhes: error.message
      });
    }
  }

  /**
   * Remove uma alocação específica
   * DELETE /alocacao-professor/:id
   */
  static async remover(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          status: 'erro',
          mensagem: 'ID da alocação é obrigatório'
        });
      }

      const removido = await AlocacaoProfessorService.removerAlocacao(id);

      if (!removido) {
        return res.status(404).json({
          status: 'erro',
          mensagem: 'Alocação não encontrada'
        });
      }

      return res.status(200).json({
        status: 'sucesso',
        mensagem: 'Alocação removida com sucesso'
      });
    } catch (error: any) {
      logError('Erro ao remover alocação', 'controller', error);
      return res.status(500).json({
        status: 'erro',
        mensagem: error.message || 'Erro ao remover alocação',
        detalhes: error.message
      });
    }
  }

  /**
   * Remove todas as alocações de um professor em um ano específico
   * DELETE /alocacao-professor/professor/:professor_id/ano-letivo/:ano_letivo_id
   */
  static async removerPorProfessorAno(req: Request, res: Response) {
    try {
      const { professor_id, ano_letivo_id } = req.params;

      if (!professor_id || !ano_letivo_id) {
        return res.status(400).json({
          status: 'erro',
          mensagem: 'ID do professor e ano letivo são obrigatórios'
        });
      }

      const removidos = await AlocacaoProfessorService.removerAlocacoesProfessorAno(professor_id, ano_letivo_id);

      return res.status(200).json({
        status: 'sucesso',
        mensagem: `${removidos} alocações removidas com sucesso`,
        dados: { removidos }
      });
    } catch (error: any) {
      logError('Erro ao remover alocações do professor', 'controller', error);
      return res.status(500).json({
        status: 'erro',
        mensagem: error.message || 'Erro ao remover alocações',
        detalhes: error.message
      });
    }
  }

  /**
   * Busca turmas disponíveis de um ano letivo
   * GET /alocacao-professor/turmas/:ano_letivo_id
   */
  static async buscarTurmas(req: Request, res: Response) {
    try {
      const { ano_letivo_id } = req.params;

      if (!ano_letivo_id) {
        return res.status(400).json({
          status: 'erro',
          mensagem: 'ID do ano letivo é obrigatório'
        });
      }

      const turmas = await AlocacaoProfessorService.buscarTurmasDisponiveis(ano_letivo_id);

      return res.status(200).json({
        status: 'sucesso',
        dados: turmas,
        total: turmas.length
      });
    } catch (error: any) {
      logError('Erro ao buscar turmas', 'controller', error);
      return res.status(500).json({
        status: 'erro',
        mensagem: 'Erro ao buscar turmas',
        detalhes: error.message
      });
    }
  }

  /**
   * Busca professores disponíveis
   * GET /alocacao-professor/professores
   */
  static async buscarProfessores(req: Request, res: Response) {
    try {
      const professores = await AlocacaoProfessorService.buscarProfessoresDisponiveis();

      return res.status(200).json({
        status: 'sucesso',
        dados: professores,
        total: professores.length
      });
    } catch (error: any) {
      logError('Erro ao buscar professores', 'controller', error);
      return res.status(500).json({
        status: 'erro',
        mensagem: 'Erro ao buscar professores',
        detalhes: error.message
      });
    }
  }

  /**
   * Busca disciplinas disponíveis
   * GET /alocacao-professor/disciplinas
   */
  static async buscarDisciplinas(req: Request, res: Response) {
    try {
      const disciplinas = await AlocacaoProfessorService.buscarDisciplinasDisponiveis();

      return res.status(200).json({
        status: 'sucesso',
        dados: disciplinas,
        total: disciplinas.length
      });
    } catch (error: any) {
      logError('Erro ao buscar disciplinas', 'controller', error);
      return res.status(500).json({
        status: 'erro',
        mensagem: 'Erro ao buscar disciplinas',
        detalhes: error.message
      });
    }
  }

  /**
   * Obter estatísticas de alocação por ano letivo
   * GET /alocacao-professor/estatisticas/:ano_letivo_id
   */
  static async obterEstatisticas(req: Request, res: Response) {
    try {
      const { ano_letivo_id } = req.params;

      if (!ano_letivo_id) {
        return res.status(400).json({
          status: 'erro',
          mensagem: 'ID do ano letivo é obrigatório'
        });
      }

      const estatisticas = await AlocacaoProfessorService.obterEstatisticasAnoLetivo(ano_letivo_id);

      return res.status(200).json({
        status: 'sucesso',
        dados: estatisticas
      });
    } catch (error: any) {
      logError('Erro ao obter estatísticas', 'controller', error);
      return res.status(500).json({
        status: 'erro',
        mensagem: 'Erro ao obter estatísticas',
        detalhes: error.message
      });
    }
  }
}

export default AlocacaoProfessorController;

