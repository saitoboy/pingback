import connection from '../connection';
import { MatriculaAluno } from '../types/models';

class MatriculaAlunoModel {

  // Listar todas as matrículas
  static async listarMatriculas(): Promise<MatriculaAluno[]> {
    return await connection('matricula_aluno')
      .select('*')
      .orderBy('created_at', 'desc');
  }

  // Buscar matrícula por RA
  static async buscarMatriculaPorRA(ra: string): Promise<MatriculaAluno | null> {
    if (!ra?.trim()) {
      throw new Error('RA é obrigatório');
    }

    const matriculas = await connection('matricula_aluno')
      .where({ ra })
      .select('*');

    return matriculas.length > 0 ? matriculas[0] : null;
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
      .join('aluno', 'matricula_aluno.aluno_id', 'aluno.aluno_id')
      .where('matricula_aluno.turma_id', turma_id)
      .select(
        'matricula_aluno.*',
        'aluno.nome_aluno',
        'aluno.sobrenome_aluno'
      )
      .orderBy('aluno.nome_aluno', 'asc')
      .orderBy('aluno.sobrenome_aluno', 'asc');
  }

  // Buscar alunos matriculados em uma aula específica
  static async buscarAlunosPorAula(aula_id: string): Promise<any[]> {
    if (!aula_id?.trim()) {
      throw new Error('ID da aula é obrigatório');
    }

    return await connection('matricula_aluno as ma')
      .join('aluno as a', 'ma.aluno_id', 'a.aluno_id')
      .join('turma_disciplina_professor as tdp', 'ma.turma_id', 'tdp.turma_id')
      .join('aula as au', function() {
        this.on('au.turma_disciplina_professor_id', '=', 'tdp.turma_disciplina_professor_id')
          .andOn('au.aula_id', '=', connection.raw('?', [aula_id]));
      })
      .select(
        'ma.matricula_aluno_id',
        'ma.ra',
        'a.nome_aluno',
        'a.sobrenome_aluno'
      )
      .orderBy('a.nome_aluno', 'asc')
      .orderBy('a.sobrenome_aluno', 'asc');
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

  // Gerar próximo RA disponível
  static async gerarProximoRA(ano_letivo_id: string, turma_id: string): Promise<string> {
    // Buscar dados do ano letivo
    const dadosMatricula = await connection('ano_letivo')
      .where('ano_letivo_id', ano_letivo_id)
      .first('ano');

    // Buscar dados da turma e série
    const dadosTurma = await connection('turma')
      .join('serie', 'turma.serie_id', 'serie.serie_id')
      .where('turma.turma_id', turma_id)
      .first('serie.nome_serie');

    if (!dadosMatricula || !dadosTurma) {
      throw new Error('Dados do ano letivo ou turma não encontrados');
    }

    const ano = dadosMatricula.ano;
    // Extrair número da série do nome (ex: "1ª série" → 1)
    const serie = dadosTurma.nome_serie ? parseInt(dadosTurma.nome_serie.match(/\d+/)?.[0]) || 1 : 1;

    // Buscar o último RA para este ano/série
    const ultimaMatricula = await connection('matricula_aluno')
      .join('turma', 'matricula_aluno.turma_id', 'turma.turma_id')
      .join('serie', 'turma.serie_id', 'serie.serie_id')
      .join('ano_letivo', 'matricula_aluno.ano_letivo_id', 'ano_letivo.ano_letivo_id')
      .where('ano_letivo.ano', ano)
      .whereRaw('serie.nome_serie ~ ?', [`^${serie}`])
      .whereNotNull('matricula_aluno.ra')
      .orderBy('matricula_aluno.ra', 'desc')
      .first('matricula_aluno.ra');

    let proximoSequencial = 1;

    if (ultimaMatricula && ultimaMatricula.ra) {
      // Extrair o sequencial do último RA (últimos 3 dígitos)
      const sequencialAtual = parseInt(ultimaMatricula.ra.slice(-3));
      proximoSequencial = sequencialAtual + 1;
    }

    // Gerar RA no formato: ANOSERIENNN
    const ra = `${ano}${serie}${proximoSequencial.toString().padStart(3, '0')}`;
    
    return ra;
  }

  // Criar matrícula
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

    // Gerar RA automaticamente
    const ra = await this.gerarProximoRA(dadosMatricula.ano_letivo_id, dadosMatricula.turma_id);

    const novaMatricula = {
      ra,
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

  // Transferir aluno de turma (mesmo ano letivo) ou criar nova matrícula (ano diferente)
  static async transferirAluno(matricula_aluno_id: string, nova_turma_id: string, motivo?: string): Promise<MatriculaAluno | null> {
    if (!matricula_aluno_id?.trim()) {
      throw new Error('ID da matrícula é obrigatório');
    }
    if (!nova_turma_id?.trim()) {
      throw new Error('ID da nova turma é obrigatório');
    }

    // Buscar dados da matrícula atual
    const matriculaAtual = await this.buscarMatriculaPorId(matricula_aluno_id);
    if (!matriculaAtual) {
      throw new Error('Matrícula não encontrada');
    }

    // Verificar se a nova turma existe e obter seus dados
    const novaTurma = await connection('turma')
      .join('serie', 'turma.serie_id', 'serie.serie_id')
      .join('ano_letivo as ano_novo', 'turma.ano_letivo_id', 'ano_novo.ano_letivo_id')
      .where('turma.turma_id', nova_turma_id)
      .first('turma.*', 'serie.nome_serie as nova_serie', 'ano_novo.ano as novo_ano', 'ano_novo.ano_letivo_id as novo_ano_letivo_id');

    if (!novaTurma) {
      throw new Error('Nova turma não encontrada');
    }

    // Buscar dados da turma atual
    const turmaAtual = await connection('turma')
      .join('serie', 'turma.serie_id', 'serie.serie_id')
      .join('ano_letivo as ano_atual', 'turma.ano_letivo_id', 'ano_atual.ano_letivo_id')
      .where('turma.turma_id', matriculaAtual.turma_id)
      .first('turma.*', 'serie.nome_serie as serie_atual', 'ano_atual.ano as ano_atual');

    // Verificar se é transferência no mesmo ano letivo ou mudança de ano
    const mesmoAnoLetivo = matriculaAtual.ano_letivo_id === novaTurma.novo_ano_letivo_id;

    if (mesmoAnoLetivo) {
      // TRANSFERÊNCIA DE TURMA (mesmo ano letivo) - UPDATE na matrícula existente
      const [matriculaAtualizada] = await connection('matricula_aluno')
        .where({ matricula_aluno_id })
        .update({
          turma_id: nova_turma_id,
          motivo_saida: motivo || `Transferência de turma: ${turmaAtual?.nome_turma || 'turma anterior'} → ${novaTurma.nome_turma}`,
          updated_at: connection.fn.now()
        })
        .returning('*');

      return matriculaAtualizada || null;

    } else {
      // MUDANÇA DE ANO LETIVO - Finalizar matrícula atual e criar nova
      
      // 1. Finalizar matrícula atual
      await connection('matricula_aluno')
        .where({ matricula_aluno_id })
        .update({
          status: 'transferido',
          data_saida: new Date(),
          motivo_saida: motivo || `Transferência para ${novaTurma.nova_serie} - ${novaTurma.novo_ano}`,
          updated_at: connection.fn.now()
        });

      // 2. Criar nova matrícula
      const novaMatricula = await this.criarMatricula({
        aluno_id: matriculaAtual.aluno_id,
        turma_id: nova_turma_id,
        ano_letivo_id: novaTurma.novo_ano_letivo_id,
        data_matricula: new Date(),
        status: 'ativo'
      });

      return novaMatricula;
    }
  }
}

export default MatriculaAlunoModel;
