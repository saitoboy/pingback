import { Request, Response } from 'express';
import GradeHorarioProfessorService from '../services/gradeHorarioProfessor.service';
import { logError, logSuccess } from '../utils/logger';

export class GradeHorarioProfessorController {
  static async listar(req: Request, res: Response) {
    try {
      const grades = await GradeHorarioProfessorService.listarGrades();
      res.status(200).json({
        status: 'sucesso',
        mensagem: 'Grades de horário obtidas com sucesso',
        dados: grades,
        total: grades.length
      });
    } catch (error: any) {
      logError('Erro ao listar grades de horário', 'controller', error);
      res.status(500).json({
        status: 'erro',
        mensagem: error.message || 'Erro interno do servidor'
      });
    }
  }

  static async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const grade = await GradeHorarioProfessorService.buscarGradePorId(id);
      res.status(200).json({
        status: 'sucesso',
        mensagem: 'Grade de horário encontrada',
        dados: grade
      });
    } catch (error: any) {
      const statusCode = error.message.includes('não encontrada') ? 404 : 500;
      logError('Erro ao buscar grade de horário', 'controller', error);
      res.status(statusCode).json({
        status: 'erro',
        mensagem: error.message || 'Erro interno do servidor'
      });
    }
  }

  static async buscarPorVinculacao(req: Request, res: Response) {
    try {
      const { vinculacaoId } = req.params;
      const grades = await GradeHorarioProfessorService.buscarGradesPorVinculacao(vinculacaoId);
      res.status(200).json({
        status: 'sucesso',
        mensagem: 'Grades de horário obtidas com sucesso',
        dados: grades,
        total: grades.length
      });
    } catch (error: any) {
      logError('Erro ao buscar grades por vinculação', 'controller', error);
      res.status(500).json({
        status: 'erro',
        mensagem: error.message || 'Erro interno do servidor'
      });
    }
  }

  static async buscarPorProfessor(req: Request, res: Response) {
    try {
      const { professorId } = req.params;
      const grades = await GradeHorarioProfessorService.buscarGradesPorProfessor(professorId);
      res.status(200).json({
        status: 'sucesso',
        mensagem: 'Grades de horário obtidas com sucesso',
        dados: grades,
        total: grades.length
      });
    } catch (error: any) {
      logError('Erro ao buscar grades por professor', 'controller', error);
      res.status(500).json({
        status: 'erro',
        mensagem: error.message || 'Erro interno do servidor'
      });
    }
  }

  static async criar(req: Request, res: Response) {
    try {
      const { turma_disciplina_professor_id, dia_semana, hora_inicio, hora_fim } = req.body;

      if (!turma_disciplina_professor_id || dia_semana === undefined || !hora_inicio || !hora_fim) {
        return res.status(400).json({
          status: 'erro',
          mensagem: 'Campos obrigatórios: turma_disciplina_professor_id, dia_semana, hora_inicio, hora_fim'
        });
      }

      const novaGrade = await GradeHorarioProfessorService.criarGrade({
        turma_disciplina_professor_id,
        dia_semana: parseInt(dia_semana),
        hora_inicio,
        hora_fim
      });

      logSuccess('Grade de horário criada', 'controller', { grade_horario_id: novaGrade.grade_horario_id });
      res.status(201).json({
        status: 'sucesso',
        mensagem: 'Grade de horário criada com sucesso',
        dados: novaGrade
      });
    } catch (error: any) {
      const statusCode = error.message.includes('Conflito') || error.message.includes('não encontrada') ? 400 : 500;
      logError('Erro ao criar grade de horário', 'controller', error);
      res.status(statusCode).json({
        status: 'erro',
        mensagem: error.message || 'Erro interno do servidor'
      });
    }
  }

  static async criarEmLote(req: Request, res: Response) {
    try {
      const { grades } = req.body;

      if (!Array.isArray(grades) || grades.length === 0) {
        return res.status(400).json({
          status: 'erro',
          mensagem: 'É necessário enviar um array de grades com pelo menos um item'
        });
      }

      const gradesCriadas = await GradeHorarioProfessorService.criarGradesEmLote(
        grades.map((g: any) => ({
          turma_disciplina_professor_id: g.turma_disciplina_professor_id,
          dia_semana: parseInt(g.dia_semana),
          hora_inicio: g.hora_inicio,
          hora_fim: g.hora_fim
        }))
      );

      logSuccess(`${gradesCriadas.length} grades criadas em lote`, 'controller');
      res.status(201).json({
        status: 'sucesso',
        mensagem: `${gradesCriadas.length} grades de horário criadas com sucesso`,
        dados: gradesCriadas,
        total: gradesCriadas.length
      });
    } catch (error: any) {
      const statusCode = error.message.includes('Conflito') || error.message.includes('não encontrada') ? 400 : 500;
      logError('Erro ao criar grades em lote', 'controller', error);
      res.status(statusCode).json({
        status: 'erro',
        mensagem: error.message || 'Erro interno do servidor'
      });
    }
  }

  static async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dadosAtualizacao = req.body;

      if (dadosAtualizacao.dia_semana !== undefined) {
        dadosAtualizacao.dia_semana = parseInt(dadosAtualizacao.dia_semana);
      }

      const gradeAtualizada = await GradeHorarioProfessorService.atualizarGrade(id, dadosAtualizacao);
      logSuccess('Grade de horário atualizada', 'controller', { grade_horario_id: id });
      res.status(200).json({
        status: 'sucesso',
        mensagem: 'Grade de horário atualizada com sucesso',
        dados: gradeAtualizada
      });
    } catch (error: any) {
      const statusCode = error.message.includes('não encontrada') || error.message.includes('Conflito') ? 400 : 500;
      logError('Erro ao atualizar grade de horário', 'controller', error);
      res.status(statusCode).json({
        status: 'erro',
        mensagem: error.message || 'Erro interno do servidor'
      });
    }
  }

  static async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await GradeHorarioProfessorService.deletarGrade(id);
      logSuccess('Grade de horário deletada', 'controller', { grade_horario_id: id });
      res.status(200).json({
        status: 'sucesso',
        mensagem: 'Grade de horário deletada com sucesso'
      });
    } catch (error: any) {
      const statusCode = error.message.includes('não encontrada') ? 404 : 500;
      logError('Erro ao deletar grade de horário', 'controller', error);
      res.status(statusCode).json({
        status: 'erro',
        mensagem: error.message || 'Erro interno do servidor'
      });
    }
  }

  static async deletarPorVinculacao(req: Request, res: Response) {
    try {
      const { vinculacaoId } = req.params;
      await GradeHorarioProfessorService.deletarGradesPorVinculacao(vinculacaoId);
      logSuccess('Grades deletadas por vinculação', 'controller', { turma_disciplina_professor_id: vinculacaoId });
      res.status(200).json({
        status: 'sucesso',
        mensagem: 'Grades de horário deletadas com sucesso'
      });
    } catch (error: any) {
      logError('Erro ao deletar grades por vinculação', 'controller', error);
      res.status(500).json({
        status: 'erro',
        mensagem: error.message || 'Erro interno do servidor'
      });
    }
  }
}

export default GradeHorarioProfessorController;

