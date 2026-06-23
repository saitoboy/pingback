import { Request, Response } from 'express';
import RegistroDiarioService from '../services/registroDiario.service';
import { TipoUsuario } from '../types/models';
import '../middleware/auth.middleware';
import logger from '../utils/logger';

class RegistroDiarioController {
  /**
   * Buscar registro do dia por vinculação e data
   * GET /registro-diario/data/:vinculacaoId/:data
   */
  static async buscarPorDataEVinculacao(req: Request, res: Response): Promise<void> {
    try {
      const { vinculacaoId, data } = req.params;

      if (!vinculacaoId || !data) {
        res.status(400).json({ sucesso: false, mensagem: 'ID da vinculação e data são obrigatórios' });
        return;
      }

      const registro = await RegistroDiarioService.buscarPorDataEVinculacao(vinculacaoId, data);

      res.status(200).json({
        sucesso: true,
        mensagem: registro ? 'Registro diário encontrado' : 'Nenhum registro para a data',
        dados: registro,
      });
    } catch (error) {
      logger.error('❌ Erro ao buscar registro por data e vinculação', 'registro-diario', error);
      res.status(500).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor',
      });
    }
  }

  /**
   * Listar registros de uma vinculação (timeline / calendário)
   * GET /registro-diario/vinculacao/:vinculacaoId
   */
  static async listarPorVinculacao(req: Request, res: Response): Promise<void> {
    try {
      const { vinculacaoId } = req.params;

      if (!vinculacaoId) {
        res.status(400).json({ sucesso: false, mensagem: 'ID da vinculação é obrigatório' });
        return;
      }

      const registros = await RegistroDiarioService.listarPorVinculacao(vinculacaoId);

      res.status(200).json({
        sucesso: true,
        mensagem: 'Registros encontrados',
        dados: registros,
        total: registros.length,
      });
    } catch (error) {
      logger.error('❌ Erro ao listar registros por vinculação', 'registro-diario', error);
      res.status(500).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor',
      });
    }
  }

  /**
   * Listar registros de um professor (visão admin)
   * GET /registro-diario/professor/:professorId
   */
  static async listarPorProfessor(req: Request, res: Response): Promise<void> {
    try {
      const { professorId } = req.params;

      if (!professorId) {
        res.status(400).json({ sucesso: false, mensagem: 'ID do professor é obrigatório' });
        return;
      }

      const registros = await RegistroDiarioService.listarPorProfessor(professorId);

      res.status(200).json({
        sucesso: true,
        mensagem: 'Registros do professor encontrados',
        dados: registros,
        total: registros.length,
      });
    } catch (error) {
      logger.error('❌ Erro ao listar registros por professor', 'registro-diario', error);
      res.status(500).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor',
      });
    }
  }

  /**
   * Criar ou atualizar o registro do dia (upsert)
   * POST /registro-diario
   */
  static async salvar(req: Request, res: Response): Promise<void> {
    try {
      const usuario = req.usuario!;
      const { turma_disciplina_professor_id } = req.body;

      if (!turma_disciplina_professor_id) {
        res.status(400).json({ sucesso: false, mensagem: 'Vinculação (turma_disciplina_professor_id) é obrigatória' });
        return;
      }

      // Professor só pode registrar em suas próprias vinculações
      if (usuario.tipo_usuario_id === TipoUsuario.PROFESSOR) {
        const ehDono = await RegistroDiarioService.professorEhDonoDaVinculacao(
          turma_disciplina_professor_id,
          usuario.usuario_id
        );
        if (!ehDono) {
          res.status(403).json({
            sucesso: false,
            mensagem: 'Você só pode registrar em suas próprias turmas/disciplinas',
          });
          return;
        }
      }

      const registro = await RegistroDiarioService.salvar(req.body);

      res.status(200).json({
        sucesso: true,
        mensagem: 'Registro diário salvo com sucesso',
        dados: registro,
      });
    } catch (error) {
      logger.error('❌ Erro ao salvar registro diário', 'registro-diario', error);
      const statusCode =
        error instanceof Error &&
        (error.message.includes('obrigatóri') || error.message.includes('não encontrada'))
          ? 400
          : 500;
      res.status(statusCode).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor',
      });
    }
  }

  /**
   * Atualizar registro existente por ID
   * PUT /registro-diario/:id
   */
  static async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const usuario = req.usuario!;

      if (!id) {
        res.status(400).json({ sucesso: false, mensagem: 'ID do registro é obrigatório' });
        return;
      }

      if (usuario.tipo_usuario_id === TipoUsuario.PROFESSOR) {
        const temAcesso = await RegistroDiarioService.verificarAcessoProfessor(id, usuario.usuario_id);
        if (!temAcesso) {
          res.status(403).json({
            sucesso: false,
            mensagem: 'Você só pode atualizar registros das suas próprias aulas',
          });
          return;
        }
      }

      const registro = await RegistroDiarioService.atualizar(id, req.body);

      res.status(200).json({
        sucesso: true,
        mensagem: 'Registro diário atualizado com sucesso',
        dados: registro,
      });
    } catch (error) {
      logger.error('❌ Erro ao atualizar registro diário', 'registro-diario', error);
      const statusCode = error instanceof Error && error.message.includes('não encontrado') ? 404 : 500;
      res.status(statusCode).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor',
      });
    }
  }

  /**
   * Deletar registro
   * DELETE /registro-diario/:id
   */
  static async deletar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const usuario = req.usuario!;

      if (!id) {
        res.status(400).json({ sucesso: false, mensagem: 'ID do registro é obrigatório' });
        return;
      }

      if (usuario.tipo_usuario_id === TipoUsuario.PROFESSOR) {
        const temAcesso = await RegistroDiarioService.verificarAcessoProfessor(id, usuario.usuario_id);
        if (!temAcesso) {
          res.status(403).json({
            sucesso: false,
            mensagem: 'Você só pode deletar registros das suas próprias aulas',
          });
          return;
        }
      }

      await RegistroDiarioService.deletar(id);

      res.status(200).json({ sucesso: true, mensagem: 'Registro diário deletado com sucesso' });
    } catch (error) {
      logger.error('❌ Erro ao deletar registro diário', 'registro-diario', error);
      const statusCode = error instanceof Error && error.message.includes('não encontrado') ? 404 : 500;
      res.status(statusCode).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor',
      });
    }
  }
}

export default RegistroDiarioController;
