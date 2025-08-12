import { Request, Response } from 'express';
import MediaDisciplinaBimestreService from '../services/mediaDisciplinaBimestre.service';
import { TipoUsuario } from '../types/models';
import logger from '../utils/logger';

export class MediaDisciplinaBimestreController {

  // GET /api/media-disciplina-bimestre - Listar todas as médias
  static async listarTodas(req: Request, res: Response): Promise<void> {
    try {
      logger.info('📈 Controller: Listando médias de disciplina por bimestre', 'media-disciplina-bimestre');
      
      const medias = await MediaDisciplinaBimestreService.listarTodas();
      
      res.status(200).json({
        success: true,
        message: `${medias.length} médias encontradas`,
        data: medias
      });
    } catch (error) {
      logger.error('❌ Controller: Erro ao listar médias', 'media-disciplina-bimestre', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // GET /api/media-disciplina-bimestre/:media_disciplina_bimestre_id - Buscar média por ID
  static async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const { media_disciplina_bimestre_id } = req.params;
      logger.info(`📈 Controller: Buscando média ${media_disciplina_bimestre_id}`, 'media-disciplina-bimestre');
      
      const media = await MediaDisciplinaBimestreService.buscarPorId(media_disciplina_bimestre_id);
      
      if (!media) {
        res.status(404).json({
          success: false,
          message: 'Média não encontrada'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Média encontrada',
        data: media
      });
    } catch (error) {
      logger.error('❌ Controller: Erro ao buscar média por ID', 'media-disciplina-bimestre', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // GET /api/media-disciplina-bimestre/detalhes - Listar médias com detalhes
  static async buscarComDetalhes(req: Request, res: Response): Promise<void> {
    try {
      const { media_disciplina_bimestre_id } = req.params;
      logger.info('📈 Controller: Buscando médias com detalhes', 'media-disciplina-bimestre');
      
      const resultado = await MediaDisciplinaBimestreService.buscarComDetalhes(media_disciplina_bimestre_id);
      
      if (media_disciplina_bimestre_id && !resultado) {
        res.status(404).json({
          success: false,
          message: 'Média não encontrada'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: media_disciplina_bimestre_id ? 'Média com detalhes encontrada' : `${Array.isArray(resultado) ? resultado.length : 1} médias com detalhes encontradas`,
        data: resultado
      });
    } catch (error) {
      logger.error('❌ Controller: Erro ao buscar médias com detalhes', 'media-disciplina-bimestre', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // GET /api/media-disciplina-bimestre/matricula/:matricula_aluno_id - Buscar médias por matrícula
  static async buscarPorMatricula(req: Request, res: Response): Promise<void> {
    try {
      const { matricula_aluno_id } = req.params;
      logger.info(`📈 Controller: Buscando médias da matrícula ${matricula_aluno_id}`, 'media-disciplina-bimestre');
      
      const medias = await MediaDisciplinaBimestreService.buscarPorMatricula(matricula_aluno_id);
      
      res.status(200).json({
        success: true,
        message: `${medias.length} médias encontradas para a matrícula`,
        data: medias
      });
    } catch (error) {
      logger.error('❌ Controller: Erro ao buscar médias por matrícula', 'media-disciplina-bimestre', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // GET /api/media-disciplina-bimestre/aluno/:aluno_id - Buscar médias por aluno
  static async buscarPorAluno(req: Request, res: Response): Promise<void> {
    try {
      const { aluno_id } = req.params;
      logger.info(`📈 Controller: Buscando médias do aluno ${aluno_id}`, 'media-disciplina-bimestre');
      
      const medias = await MediaDisciplinaBimestreService.buscarPorAluno(aluno_id);
      
      res.status(200).json({
        success: true,
        message: `${medias.length} médias encontradas para o aluno`,
        data: medias
      });
    } catch (error) {
      logger.error('❌ Controller: Erro ao buscar médias por aluno', 'media-disciplina-bimestre', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // GET /api/media-disciplina-bimestre/turma/:turma_id/disciplina/:disciplina_id - Buscar médias por turma e disciplina
  static async buscarPorTurmaEDisciplina(req: Request, res: Response): Promise<void> {
    try {
      const { turma_id, disciplina_id } = req.params;
      logger.info(`📈 Controller: Buscando médias da turma ${turma_id} e disciplina ${disciplina_id}`, 'media-disciplina-bimestre');
      
      const medias = await MediaDisciplinaBimestreService.buscarPorTurmaEDisciplina(turma_id, disciplina_id);
      
      res.status(200).json({
        success: true,
        message: `${medias.length} médias encontradas para a turma e disciplina`,
        data: medias
      });
    } catch (error) {
      logger.error('❌ Controller: Erro ao buscar médias por turma e disciplina', 'media-disciplina-bimestre', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // GET /api/media-disciplina-bimestre/periodo-letivo/:periodo_letivo_id - Buscar médias por período letivo
  static async buscarPorPeriodoLetivo(req: Request, res: Response): Promise<void> {
    try {
      const { periodo_letivo_id } = req.params;
      logger.info(`📈 Controller: Buscando médias do período letivo ${periodo_letivo_id}`, 'media-disciplina-bimestre');
      
      const medias = await MediaDisciplinaBimestreService.buscarPorPeriodoLetivo(periodo_letivo_id);
      
      res.status(200).json({
        success: true,
        message: `${medias.length} médias encontradas para o período letivo`,
        data: medias
      });
    } catch (error) {
      logger.error('❌ Controller: Erro ao buscar médias por período letivo', 'media-disciplina-bimestre', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // POST /api/media-disciplina-bimestre - Criar nova média
  static async criar(req: Request, res: Response): Promise<void> {
    try {
      logger.info('📈 Controller: Criando nova média de disciplina por bimestre', 'media-disciplina-bimestre');
      
      const mediaCriada = await MediaDisciplinaBimestreService.criar(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Média criada com sucesso',
        data: mediaCriada
      });
    } catch (error) {
      logger.error('❌ Controller: Erro ao criar média', 'media-disciplina-bimestre', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // PUT /api/media-disciplina-bimestre/:media_disciplina_bimestre_id - Atualizar média
  static async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { media_disciplina_bimestre_id } = req.params;
      logger.info(`📈 Controller: Atualizando média ${media_disciplina_bimestre_id}`, 'media-disciplina-bimestre');
      
      const mediaAtualizada = await MediaDisciplinaBimestreService.atualizar(media_disciplina_bimestre_id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Média atualizada com sucesso',
        data: mediaAtualizada
      });
    } catch (error) {
      logger.error('❌ Controller: Erro ao atualizar média', 'media-disciplina-bimestre', error);
      const status = error instanceof Error && error.message === 'Média não encontrada' ? 404 : 400;
      res.status(status).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // DELETE /api/media-disciplina-bimestre/:media_disciplina_bimestre_id - Deletar média
  static async deletar(req: Request, res: Response): Promise<void> {
    try {
      const { media_disciplina_bimestre_id } = req.params;
      logger.info(`📈 Controller: Deletando média ${media_disciplina_bimestre_id}`, 'media-disciplina-bimestre');
      
      await MediaDisciplinaBimestreService.deletar(media_disciplina_bimestre_id);
      
      res.status(200).json({
        success: true,
        message: 'Média deletada com sucesso'
      });
    } catch (error) {
      logger.error('❌ Controller: Erro ao deletar média', 'media-disciplina-bimestre', error);
      const status = error instanceof Error && error.message === 'Média não encontrada' ? 404 : 400;
      res.status(status).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // GET /api/media-disciplina-bimestre/estatisticas/aluno/:aluno_id/periodo-letivo/:periodo_letivo_id - Estatísticas por aluno
  static async obterEstatisticasPorAluno(req: Request, res: Response): Promise<void> {
    try {
      const { aluno_id } = req.params;
      logger.info(`📈 Controller: Obtendo estatísticas do aluno ${aluno_id}`, 'media-disciplina-bimestre');
      
      const stats = await MediaDisciplinaBimestreService.obterEstatisticasPorAluno(aluno_id);
      
      res.status(200).json({
        success: true,
        message: 'Estatísticas obtidas com sucesso',
        data: stats
      });
    } catch (error) {
      logger.error('❌ Controller: Erro ao obter estatísticas por aluno', 'media-disciplina-bimestre', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // GET /api/media-disciplina-bimestre/estatisticas/turma/:turma_id/disciplina/:disciplina_id/periodo-letivo/:periodo_letivo_id - Estatísticas por turma e disciplina
  static async obterEstatisticasPorTurmaDisciplina(req: Request, res: Response): Promise<void> {
    try {
      const { turma_id, disciplina_id, periodo_letivo_id } = req.params;
      logger.info(`📈 Controller: Obtendo estatísticas da turma ${turma_id}, disciplina ${disciplina_id} no período ${periodo_letivo_id}`, 'media-disciplina-bimestre');
      
      const stats = await MediaDisciplinaBimestreService.obterEstatisticasPorTurmaDisciplina(turma_id, disciplina_id, periodo_letivo_id);
      
      res.status(200).json({
        success: true,
        message: 'Estatísticas obtidas com sucesso',
        data: stats
      });
    } catch (error) {
      logger.error('❌ Controller: Erro ao obter estatísticas por turma e disciplina', 'media-disciplina-bimestre', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }
}
