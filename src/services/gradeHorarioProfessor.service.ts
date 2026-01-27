import * as GradeHorarioModel from '../model/gradeHorarioProfessor.model';
import { logError, logSuccess } from '../utils/logger';

export default class GradeHorarioProfessorService {
  static async listarGrades() {
    try {
      const grades = await GradeHorarioModel.listarTodas();
      return grades;
    } catch (error) {
      logError('Erro ao listar grades de horário', 'service', error);
      throw error;
    }
  }

  static async buscarGradePorId(grade_horario_id: string) {
    try {
      const grade = await GradeHorarioModel.buscarPorId(grade_horario_id);
      if (!grade) {
        throw new Error('Grade de horário não encontrada');
      }
      return grade;
    } catch (error) {
      logError('Erro ao buscar grade de horário', 'service', error);
      throw error;
    }
  }

  static async buscarGradesPorVinculacao(turma_disciplina_professor_id: string) {
    try {
      const grades = await GradeHorarioModel.buscarPorVinculacao(turma_disciplina_professor_id);
      return grades;
    } catch (error) {
      logError('Erro ao buscar grades por vinculação', 'service', error);
      throw error;
    }
  }

  static async buscarGradesPorProfessor(professor_id: string) {
    try {
      const grades = await GradeHorarioModel.buscarPorProfessor(professor_id);
      return grades;
    } catch (error) {
      logError('Erro ao buscar grades por professor', 'service', error);
      throw error;
    }
  }

  static async criarGrade(dados: Omit<GradeHorarioModel.GradeHorarioProfessor, 'grade_horario_id' | 'created_at' | 'updated_at'>) {
    try {
      const novaGrade = await GradeHorarioModel.criar(dados);
      logSuccess('Grade de horário criada com sucesso', 'service', { grade_horario_id: novaGrade.grade_horario_id });
      return novaGrade;
    } catch (error) {
      logError('Erro ao criar grade de horário', 'service', error);
      throw error;
    }
  }

  static async criarGradesEmLote(
    grades: Array<Omit<GradeHorarioModel.GradeHorarioProfessor, 'grade_horario_id' | 'created_at' | 'updated_at'>>
  ) {
    try {
      const gradesCriadas = await GradeHorarioModel.criarEmLote(grades);
      logSuccess(`${gradesCriadas.length} grades de horário criadas com sucesso`, 'service');
      return gradesCriadas;
    } catch (error) {
      logError('Erro ao criar grades em lote', 'service', error);
      throw error;
    }
  }

  static async atualizarGrade(
    grade_horario_id: string,
    dadosAtualizacao: Partial<Omit<GradeHorarioModel.GradeHorarioProfessor, 'grade_horario_id' | 'created_at' | 'updated_at'>>
  ) {
    try {
      const gradeAtualizada = await GradeHorarioModel.atualizar(grade_horario_id, dadosAtualizacao);
      if (!gradeAtualizada) {
        throw new Error('Grade de horário não encontrada');
      }
      logSuccess('Grade de horário atualizada com sucesso', 'service', { grade_horario_id });
      return gradeAtualizada;
    } catch (error) {
      logError('Erro ao atualizar grade de horário', 'service', error);
      throw error;
    }
  }

  static async deletarGrade(grade_horario_id: string) {
    try {
      const deletado = await GradeHorarioModel.deletar(grade_horario_id);
      if (!deletado) {
        throw new Error('Grade de horário não encontrada');
      }
      logSuccess('Grade de horário deletada com sucesso', 'service', { grade_horario_id });
      return true;
    } catch (error) {
      logError('Erro ao deletar grade de horário', 'service', error);
      throw error;
    }
  }

  static async deletarGradesPorVinculacao(turma_disciplina_professor_id: string) {
    try {
      const deletado = await GradeHorarioModel.deletarPorVinculacao(turma_disciplina_professor_id);
      logSuccess('Grades de horário deletadas com sucesso', 'service', { turma_disciplina_professor_id });
      return deletado;
    } catch (error) {
      logError('Erro ao deletar grades por vinculação', 'service', error);
      throw error;
    }
  }

  static async buscarComDetalhes(grade_horario_id?: string) {
    try {
      const grades = await GradeHorarioModel.buscarComDetalhes(grade_horario_id);
      return grades;
    } catch (error) {
      logError('Erro ao buscar grades com detalhes', 'service', error);
      throw error;
    }
  }
}

