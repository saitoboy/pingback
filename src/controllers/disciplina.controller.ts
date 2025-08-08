import { Request, Response } from 'express';
import DisciplinaService from '../services/disciplina.service';
import logger from '../utils/logger';

class DisciplinaController {

  /**
   * Listar todas as disciplinas
   * GET /disciplinas
   */
  static async listarDisciplinas(req: Request, res: Response): Promise<void> {
    try {
      logger.info('📚 Requisição para listar disciplinas', 'disciplina');
      
      const disciplinas = await DisciplinaService.listarDisciplinas();

      res.status(200).json({
        sucesso: true,
        mensagem: 'Lista de disciplinas obtida com sucesso',
        dados: disciplinas,
        total: disciplinas.length
      });
    } catch (error) {
      logger.error('❌ Erro no controller ao listar disciplinas', 'disciplina', error);
      res.status(500).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  /**
   * Buscar disciplina por ID
   * GET /disciplinas/:id
   */
  static async buscarDisciplinaPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id || !id.trim()) {
        res.status(400).json({
          sucesso: false,
          mensagem: 'ID da disciplina é obrigatório'
        });
        return;
      }

      logger.info(`🔍 Requisição para buscar disciplina: ${id}`, 'disciplina');
      
      const disciplina = await DisciplinaService.buscarDisciplinaPorId(id);

      res.status(200).json({
        sucesso: true,
        mensagem: 'Disciplina encontrada com sucesso',
        dados: disciplina
      });
    } catch (error) {
      logger.error('❌ Erro no controller ao buscar disciplina', 'disciplina', error);
      
      if (error instanceof Error && error.message === 'Disciplina não encontrada') {
        res.status(404).json({
          sucesso: false,
          mensagem: error.message
        });
        return;
      }

      res.status(500).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  /**
   * Criar nova disciplina
   * POST /disciplinas
   */
  static async criarDisciplina(req: Request, res: Response): Promise<void> {
    try {
      const { nome_disciplina } = req.body;

      if (!nome_disciplina || !nome_disciplina.trim()) {
        res.status(400).json({
          sucesso: false,
          mensagem: 'Nome da disciplina é obrigatório'
        });
        return;
      }

      logger.info(`📝 Requisição para criar disciplina: ${nome_disciplina}`, 'disciplina');
      
      const novaDisciplina = await DisciplinaService.criarDisciplina({ nome_disciplina });

      res.status(201).json({
        sucesso: true,
        mensagem: 'Disciplina criada com sucesso',
        dados: novaDisciplina
      });
    } catch (error) {
      logger.error('❌ Erro no controller ao criar disciplina', 'disciplina', error);
      
      if (error instanceof Error && error.message.includes('já existe')) {
        res.status(409).json({
          sucesso: false,
          mensagem: error.message
        });
        return;
      }

      if (error instanceof Error && (
        error.message.includes('obrigatório') || 
        error.message.includes('caracteres')
      )) {
        res.status(400).json({
          sucesso: false,
          mensagem: error.message
        });
        return;
      }

      res.status(500).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  /**
   * Atualizar disciplina existente
   * PUT /disciplinas/:id
   */
  static async atualizarDisciplina(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nome_disciplina } = req.body;

      if (!id || !id.trim()) {
        res.status(400).json({
          sucesso: false,
          mensagem: 'ID da disciplina é obrigatório'
        });
        return;
      }

      if (!nome_disciplina || !nome_disciplina.trim()) {
        res.status(400).json({
          sucesso: false,
          mensagem: 'Nome da disciplina é obrigatório'
        });
        return;
      }

      logger.info(`📝 Requisição para atualizar disciplina: ${id}`, 'disciplina');
      
      const disciplinaAtualizada = await DisciplinaService.atualizarDisciplina(id, { nome_disciplina });

      res.status(200).json({
        sucesso: true,
        mensagem: 'Disciplina atualizada com sucesso',
        dados: disciplinaAtualizada
      });
    } catch (error) {
      logger.error('❌ Erro no controller ao atualizar disciplina', 'disciplina', error);
      
      if (error instanceof Error && error.message === 'Disciplina não encontrada') {
        res.status(404).json({
          sucesso: false,
          mensagem: error.message
        });
        return;
      }

      if (error instanceof Error && error.message.includes('já existe')) {
        res.status(409).json({
          sucesso: false,
          mensagem: error.message
        });
        return;
      }

      if (error instanceof Error && (
        error.message.includes('obrigatório') || 
        error.message.includes('caracteres')
      )) {
        res.status(400).json({
          sucesso: false,
          mensagem: error.message
        });
        return;
      }

      res.status(500).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  /**
   * Deletar disciplina
   * DELETE /disciplinas/:id
   */
  static async deletarDisciplina(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || !id.trim()) {
        res.status(400).json({
          sucesso: false,
          mensagem: 'ID da disciplina é obrigatório'
        });
        return;
      }

      logger.info(`🗑️ Requisição para deletar disciplina: ${id}`, 'disciplina');
      
      await DisciplinaService.deletarDisciplina(id);

      res.status(200).json({
        sucesso: true,
        mensagem: 'Disciplina deletada com sucesso'
      });
    } catch (error) {
      logger.error('❌ Erro no controller ao deletar disciplina', 'disciplina', error);
      
      if (error instanceof Error && error.message === 'Disciplina não encontrada') {
        res.status(404).json({
          sucesso: false,
          mensagem: error.message
        });
        return;
      }

      if (error instanceof Error && error.message.includes('sendo usada')) {
        res.status(409).json({
          sucesso: false,
          mensagem: error.message
        });
        return;
      }

      res.status(500).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  /**
   * Buscar disciplinas por nome
   * GET /disciplinas/buscar/:nome
   */
  static async buscarDisciplinasPorNome(req: Request, res: Response): Promise<void> {
    try {
      const { nome } = req.params;

      if (!nome || !nome.trim()) {
        res.status(400).json({
          sucesso: false,
          mensagem: 'Nome para busca é obrigatório'
        });
        return;
      }

      if (nome.trim().length < 2) {
        res.status(400).json({
          sucesso: false,
          mensagem: 'Nome para busca deve ter pelo menos 2 caracteres'
        });
        return;
      }

      logger.info(`🔍 Requisição para buscar disciplinas por nome: ${nome}`, 'disciplina');
      
      const disciplinas = await DisciplinaService.buscarDisciplinasPorNome(nome);

      res.status(200).json({
        sucesso: true,
        mensagem: `Busca por "${nome}" realizada com sucesso`,
        dados: disciplinas,
        total: disciplinas.length
      });
    } catch (error) {
      logger.error('❌ Erro no controller ao buscar disciplinas por nome', 'disciplina', error);
      
      if (error instanceof Error && (
        error.message.includes('obrigatório') || 
        error.message.includes('caracteres')
      )) {
        res.status(400).json({
          sucesso: false,
          mensagem: error.message
        });
        return;
      }

      res.status(500).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }
}

export default DisciplinaController;
