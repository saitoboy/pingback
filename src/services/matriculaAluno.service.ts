import MatriculaAlunoModel from '../model/matriculaAluno.model';
import { MatriculaAluno } from '../types/models';

class MatriculaAlunoService {

  // Listar todas as matrículas
  static async listarMatriculas(): Promise<MatriculaAluno[]> {
    return await MatriculaAlunoModel.listarMatriculas();
  }

  // Buscar matrícula por RA
  static async buscarMatriculaPorRA(ra: string): Promise<MatriculaAluno | null> {
    return await MatriculaAlunoModel.buscarMatriculaPorRA(ra);
  }

  // Buscar matrícula por ID
  static async buscarMatriculaPorId(matricula_aluno_id: string): Promise<MatriculaAluno | null> {
    return await MatriculaAlunoModel.buscarMatriculaPorId(matricula_aluno_id);
  }

  // Buscar matrículas por aluno
  static async buscarMatriculasPorAluno(aluno_id: string): Promise<MatriculaAluno[]> {
    return await MatriculaAlunoModel.buscarMatriculasPorAluno(aluno_id);
  }

  // Buscar matrículas por turma
  static async buscarMatriculasPorTurma(turma_id: string): Promise<MatriculaAluno[]> {
    return await MatriculaAlunoModel.buscarMatriculasPorTurma(turma_id);
  }

  // Buscar matrículas por ano letivo
  static async buscarMatriculasPorAnoLetivo(ano_letivo_id: string): Promise<MatriculaAluno[]> {
    return await MatriculaAlunoModel.buscarMatriculasPorAnoLetivo(ano_letivo_id);
  }

  // Buscar matrículas por status
  static async buscarMatriculasPorStatus(status: string): Promise<MatriculaAluno[]> {
    return await MatriculaAlunoModel.buscarMatriculasPorStatus(status);
  }

  // Buscar matrícula ativa do aluno
  static async buscarMatriculaAtivaAluno(aluno_id: string, ano_letivo_id: string): Promise<MatriculaAluno | null> {
    return await MatriculaAlunoModel.buscarMatriculaAtivaAluno(aluno_id, ano_letivo_id);
  }

  // Criar matrícula
  static async criarMatricula(dadosMatricula: Partial<MatriculaAluno>): Promise<MatriculaAluno> {
    return await MatriculaAlunoModel.criarMatricula(dadosMatricula);
  }

  // Atualizar matrícula
  static async atualizarMatricula(matricula_aluno_id: string, dadosAtualizacao: Partial<MatriculaAluno>): Promise<MatriculaAluno | null> {
    return await MatriculaAlunoModel.atualizarMatricula(matricula_aluno_id, dadosAtualizacao);
  }

  // Deletar matrícula
  static async deletarMatricula(matricula_aluno_id: string): Promise<boolean> {
    return await MatriculaAlunoModel.deletarMatricula(matricula_aluno_id);
  }

  // Transferir aluno de turma
  static async transferirAluno(matricula_aluno_id: string, nova_turma_id: string, motivo?: string): Promise<MatriculaAluno | null> {
    return await MatriculaAlunoModel.transferirAluno(matricula_aluno_id, nova_turma_id, motivo);
  }

  // Finalizar matrícula (concluir ou cancelar)
  static async finalizarMatricula(matricula_aluno_id: string, status: 'concluido' | 'cancelado', motivo: string): Promise<MatriculaAluno | null> {
    const dadosFinalizacao = {
      status,
      data_saida: new Date(),
      motivo_saida: motivo
    };

    return await MatriculaAlunoModel.atualizarMatricula(matricula_aluno_id, dadosFinalizacao);
  }

  // Listar matrículas com informações detalhadas (joins)
  static async listarMatriculasDetalhadas(): Promise<any[]> {
    // Esta função poderia fazer joins com aluno, turma, etc.
    // Por enquanto, retorna as matrículas básicas
    return await this.listarMatriculas();
  }
}

export default MatriculaAlunoService;
