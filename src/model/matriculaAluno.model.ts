import connection from '../connection';
import { MatriculaAluno } from '../types/models';

class MatriculaAlunoModel {

  // Listar todas as matrículas
  static async listarMatriculas(): Promise<MatriculaAluno[]> {
    return await connection('matricula_aluno')
      .select('*')
      .orderBy('created_at', 'desc');
  }

  // Buscar matrícula por ID
  static async buscarMatriculaPorId(matricula_aluno_id: string): Promise<MatriculaAluno | null> {
    if (!matricula_aluno_id?.trim()) {
      throw new Error('ID da matrícula é obrigatório');
    }

    const matriculas = await connection('matricula_aluno')
      .where({ matricula_aluno_id })
      .select('*');

    return matriculas.length > 0 ? matriculas[0] : null;
  }

  // Buscar matrículas por aluno
  static async buscarMatriculasPorAluno(aluno_id: string): Promise<MatriculaAluno[]> {
    if (!aluno_id?.trim()) {
      throw new Error('ID do aluno é obrigatório');
    }

    return await connection('matricula_aluno')
      .where({ aluno_id })
      .select('*')
      .orderBy('data_matricula', 'desc');
  }

  // Buscar matrículas por turma
  static async buscarMatriculasPorTurma(turma_id: string): Promise<MatriculaAluno[]> {
    if (!turma_id?.trim()) {
      throw new Error('ID da turma é obrigatório');
    }

    return await connection('matricula_aluno')
      .where({ turma_id })
      .select('*')
      .orderBy('data_matricula', 'desc');
  }

  // Buscar matrículas por ano letivo
  static async buscarMatriculasPorAnoLetivo(ano_letivo_id: string): Promise<MatriculaAluno[]> {
    if (!ano_letivo_id?.trim()) {
      throw new Error('ID do ano letivo é obrigatório');
    }

    return await connection('matricula_aluno')
      .where({ ano_letivo_id })
      .select('*')
      .orderBy('data_matricula', 'desc');
  }

  // Buscar matrículas por status
  static async buscarMatriculasPorStatus(status: string): Promise<MatriculaAluno[]> {
    const statusValidos = ['ativo', 'transferido', 'concluido', 'cancelado'];
    if (!statusValidos.includes(status)) {
      throw new Error(`Status deve ser um dos valores: ${statusValidos.join(', ')}`);
    }

    return await connection('matricula_aluno')
      .where({ status })
      .select('*')
      .orderBy('data_matricula', 'desc');
  }

  // Buscar matrícula ativa do aluno em um ano letivo
  static async buscarMatriculaAtivaAluno(aluno_id: string, ano_letivo_id: string): Promise<MatriculaAluno | null> {
    if (!aluno_id?.trim()) {
      throw new Error('ID do aluno é obrigatório');
    }
    if (!ano_letivo_id?.trim()) {
      throw new Error('ID do ano letivo é obrigatório');
    }

    const matriculas = await connection('matricula_aluno')
      .where({ 
        aluno_id, 
        ano_letivo_id,
        status: 'ativo'
      })
      .select('*');

    return matriculas.length > 0 ? matriculas[0] : null;
  }

  // Criar matrícula
  static async criarMatricula(dadosMatricula: Partial<MatriculaAluno>): Promise<MatriculaAluno> {
    // Validações
    if (!dadosMatricula.aluno_id?.trim()) {
      throw new Error('Dados inválidos: Campo "aluno_id" é obrigatório');
    }
    if (!dadosMatricula.turma_id?.trim()) {
      throw new Error('Dados inválidos: Campo "turma_id" é obrigatório');
    }
    if (!dadosMatricula.ano_letivo_id?.trim()) {
      throw new Error('Dados inválidos: Campo "ano_letivo_id" é obrigatório');
    }
    if (!dadosMatricula.data_matricula) {
      throw new Error('Dados inválidos: Campo "data_matricula" é obrigatório');
    }

    // Verificar se o aluno existe
    const alunoExiste = await connection('aluno')
      .where({ aluno_id: dadosMatricula.aluno_id })
      .first();
    if (!alunoExiste) {
      throw new Error('Aluno não encontrado');
    }

    // Verificar se a turma existe
    const turmaExiste = await connection('turma')
      .where({ turma_id: dadosMatricula.turma_id })
      .first();
    if (!turmaExiste) {
      throw new Error('Turma não encontrada');
    }

    // Verificar se o ano letivo existe
    const anoLetivoExiste = await connection('ano_letivo')
      .where({ ano_letivo_id: dadosMatricula.ano_letivo_id })
      .first();
    if (!anoLetivoExiste) {
      throw new Error('Ano letivo não encontrado');
    }

    // Verificar se já existe matrícula ativa para este aluno neste ano
    const matriculaExistente = await this.buscarMatriculaAtivaAluno(
      dadosMatricula.aluno_id,
      dadosMatricula.ano_letivo_id
    );
    if (matriculaExistente) {
      throw new Error('Aluno já possui matrícula ativa neste ano letivo');
    }

    const novaMatricula = {
      aluno_id: dadosMatricula.aluno_id,
      turma_id: dadosMatricula.turma_id,
      ano_letivo_id: dadosMatricula.ano_letivo_id,
      data_matricula: dadosMatricula.data_matricula,
      status: dadosMatricula.status || 'ativo'
    };

    const [matriculaCriada] = await connection('matricula_aluno')
      .insert(novaMatricula)
      .returning('*');

    return matriculaCriada;
  }

  // Atualizar matrícula
  static async atualizarMatricula(matricula_aluno_id: string, dadosAtualizacao: Partial<MatriculaAluno>): Promise<MatriculaAluno | null> {
    if (!matricula_aluno_id?.trim()) {
      throw new Error('ID da matrícula é obrigatório');
    }

    // Verificar se a matrícula existe
    const matriculaExiste = await this.buscarMatriculaPorId(matricula_aluno_id);
    if (!matriculaExiste) {
      return null;
    }

    // Validar status se fornecido
    if (dadosAtualizacao.status) {
      const statusValidos = ['ativo', 'transferido', 'concluido', 'cancelado'];
      if (!statusValidos.includes(dadosAtualizacao.status)) {
        throw new Error(`Dados inválidos: Status deve ser um dos valores: ${statusValidos.join(', ')}`);
      }
    }

    // Se está mudando para não ativo, data_saida deve ser fornecida
    if (dadosAtualizacao.status && dadosAtualizacao.status !== 'ativo' && !dadosAtualizacao.data_saida) {
      throw new Error('Data de saída é obrigatória para status não ativo');
    }

    const [matriculaAtualizada] = await connection('matricula_aluno')
      .where({ matricula_aluno_id })
      .update({
        ...dadosAtualizacao,
        updated_at: connection.fn.now()
      })
      .returning('*');

    return matriculaAtualizada;
  }

  // Deletar matrícula
  static async deletarMatricula(matricula_aluno_id: string): Promise<boolean> {
    if (!matricula_aluno_id?.trim()) {
      throw new Error('ID da matrícula é obrigatório');
    }

    // Verificar se a matrícula existe
    const matriculaExiste = await this.buscarMatriculaPorId(matricula_aluno_id);
    if (!matriculaExiste) {
      return false;
    }

    // Verificar se existem dependências (notas, frequências, etc.)
    const possuiNotas = await connection('nota')
      .join('atividade', 'nota.atividade_id', 'atividade.atividade_id')
      .where('nota.matricula_aluno_id', matricula_aluno_id)
      .first();

    if (possuiNotas) {
      throw new Error('Não é possível deletar matrícula que possui notas registradas');
    }

    const possuiFrequencias = await connection('frequencia')
      .where('matricula_aluno_id', matricula_aluno_id)
      .first();

    if (possuiFrequencias) {
      throw new Error('Não é possível deletar matrícula que possui frequências registradas');
    }

    const deletedRows = await connection('matricula_aluno')
      .where({ matricula_aluno_id })
      .del();

    return deletedRows > 0;
  }

  // Transferir aluno de turma
  static async transferirAluno(matricula_aluno_id: string, nova_turma_id: string, motivo?: string): Promise<MatriculaAluno | null> {
    if (!matricula_aluno_id?.trim()) {
      throw new Error('ID da matrícula é obrigatório');
    }
    if (!nova_turma_id?.trim()) {
      throw new Error('ID da nova turma é obrigatório');
    }

    // Verificar se a nova turma existe
    const turmaExiste = await connection('turma')
      .where({ turma_id: nova_turma_id })
      .first();
    if (!turmaExiste) {
      throw new Error('Nova turma não encontrada');
    }

    const [matriculaAtualizada] = await connection('matricula_aluno')
      .where({ matricula_aluno_id })
      .update({
        turma_id: nova_turma_id,
        motivo_saida: motivo || 'Transferência de turma',
        updated_at: connection.fn.now()
      })
      .returning('*');

    return matriculaAtualizada || null;
  }
}

export default MatriculaAlunoModel;
