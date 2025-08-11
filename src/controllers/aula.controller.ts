import { Request, Response } from 'express';
import AulaService from '../services/aula.service';
import { TipoUsuario } from '../types/models';
import '../middleware/auth.middleware'; // Importa para carregar a extensão global
import logger from '../utils/logger';

class AulaController {

  /**
   * Listar todas as aulas
   * GET /api/aulas
   */
  static async listarAulas(req: Request, res: Response) {
    try {
      logger.info('📚 [API] Requisição para listar aulas', 'aula-controller');
      
      const aulas = await AulaService.listarAulas();
      
      logger.success(`✅ [API] ${aulas.length} aulas listadas com sucesso`, 'aula-controller');
      
      return res.status(200).json({
        success: true,
        message: `${aulas.length} aulas encontradas`,
        data: aulas
      });

    } catch (error: any) {
      logger.error('❌ [API] Erro ao listar aulas', 'aula-controller', error);
      
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  /**
   * Buscar aula por ID
   * GET /api/aulas/:id
   */
  static async buscarAulaPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      logger.info(`🔍 [API] Requisição para buscar aula: ${id}`, 'aula-controller');
      
      const aula = await AulaService.buscarAulaPorId(id);
      
      logger.success(`✅ [API] Aula encontrada: ${aula.data_aula}`, 'aula-controller');
      
      return res.status(200).json({
        success: true,
        message: 'Aula encontrada',
        data: aula
      });

    } catch (error: any) {
      logger.error('❌ [API] Erro ao buscar aula por ID', 'aula-controller', error);
      
      const statusCode = error.message === 'Aula não encontrada' ? 404 : 500;
      
      return res.status(statusCode).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }

  /**
   * Buscar aulas por vinculação
   * GET /api/aulas/vinculacao/:id
   */
  static async buscarAulasPorVinculacao(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      logger.info(`🔍 [API] Requisição para buscar aulas da vinculação: ${id}`, 'aula-controller');
      
      const aulas = await AulaService.buscarAulasPorVinculacao(id);
      
      logger.success(`✅ [API] ${aulas.length} aulas encontradas para a vinculação`, 'aula-controller');
      
      return res.status(200).json({
        success: true,
        message: `${aulas.length} aulas encontradas para a vinculação`,
        data: aulas
      });

    } catch (error: any) {
      logger.error('❌ [API] Erro ao buscar aulas por vinculação', 'aula-controller', error);
      
      return res.status(500).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }

  /**
   * Buscar aulas por data
   * GET /api/aulas/data/:data
   */
  static async buscarAulasPorData(req: Request, res: Response) {
    try {
      const { data } = req.params;
      
      logger.info(`🔍 [API] Requisição para buscar aulas da data: ${data}`, 'aula-controller');
      
      const aulas = await AulaService.buscarAulasPorData(data);
      
      logger.success(`✅ [API] ${aulas.length} aulas encontradas para a data`, 'aula-controller');
      
      return res.status(200).json({
        success: true,
        message: `${aulas.length} aulas encontradas para a data ${data}`,
        data: aulas
      });

    } catch (error: any) {
      logger.error('❌ [API] Erro ao buscar aulas por data', 'aula-controller', error);
      
      return res.status(400).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }

  /**
   * Criar nova aula
   * POST /api/aulas
   */
  static async criarAula(req: Request, res: Response) {
    try {
      const dadosAula = req.body;
      
      logger.info(`📝 [API] Requisição para criar aula: ${dadosAula.data_aula} ${dadosAula.hora_inicio}-${dadosAula.hora_fim}`, 'aula-controller');
      
      const novaAula = await AulaService.criarAula(dadosAula);
      
      logger.success(`🎉 [API] Aula criada com sucesso: ${novaAula.data_aula}`, 'aula-controller');
      
      return res.status(201).json({
        success: true,
        message: 'Aula criada com sucesso',
        data: novaAula
      });

    } catch (error: any) {
      logger.error('❌ [API] Erro ao criar aula', 'aula-controller', error);
      
      return res.status(400).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }

  /**
   * Atualizar aula existente
   * PUT /api/aulas/:id
   */
  static async atualizarAula(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dadosAtualizacao = req.body;
      const usuario = req.usuario!;
      
      logger.info(`📝 [API] Requisição para atualizar aula: ${id}`, 'aula-controller');
      
      // Se for professor, verificar se tem acesso à aula
      if (usuario.tipo_usuario_id === TipoUsuario.PROFESSOR) {
        const temAcesso = await AulaService.verificarAcessoProfessor(id, usuario.usuario_id);
        
        if (!temAcesso) {
          logger.warning(`⚠️ [API] Professor ${usuario.usuario_id} tentou atualizar aula ${id} sem permissão`, 'aula-controller');
          return res.status(403).json({
            success: false,
            message: 'Você só pode atualizar suas próprias aulas'
          });
        }
      }
      
      const aulaAtualizada = await AulaService.atualizarAula(id, dadosAtualizacao);
      
      logger.success(`✅ [API] Aula atualizada: ${aulaAtualizada.data_aula}`, 'aula-controller');
      
      return res.status(200).json({
        success: true,
        message: 'Aula atualizada com sucesso',
        data: aulaAtualizada
      });

    } catch (error: any) {
      logger.error('❌ [API] Erro ao atualizar aula', 'aula-controller', error);
      
      const statusCode = error.message === 'Aula não encontrada' ? 404 : 400;
      
      return res.status(statusCode).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }

  /**
   * Deletar aula
   * DELETE /api/aulas/:id
   */
  static async deletarAula(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const usuario = req.usuario!;
      
      logger.info(`🗑️ [API] Requisição para deletar aula: ${id}`, 'aula-controller');
      
      // Se for professor, verificar se tem acesso à aula
      if (usuario.tipo_usuario_id === TipoUsuario.PROFESSOR) {
        const temAcesso = await AulaService.verificarAcessoProfessor(id, usuario.usuario_id);
        
        if (!temAcesso) {
          logger.warning(`⚠️ [API] Professor ${usuario.usuario_id} tentou deletar aula ${id} sem permissão`, 'aula-controller');
          return res.status(403).json({
            success: false,
            message: 'Você só pode deletar suas próprias aulas'
          });
        }
      }
      
      await AulaService.deletarAula(id);
      
      logger.success(`✅ [API] Aula deletada com sucesso: ${id}`, 'aula-controller');
      
      return res.status(200).json({
        success: true,
        message: 'Aula deletada com sucesso'
      });

    } catch (error: any) {
      logger.error('❌ [API] Erro ao deletar aula', 'aula-controller', error);
      
      const statusCode = error.message === 'Aula não encontrada' ? 404 : 400;
      
      return res.status(statusCode).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }
}

export default AulaController;
