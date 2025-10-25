import connection from '../connection';
import { Professor } from '../types/models';

const tabela = 'professor';

export const buscarPorId = async (professor_id: string): Promise<Professor | undefined> => {
  return await connection(tabela)
    .where({ professor_id })
    .first();
};

export const buscarPorUsuarioId = async (usuario_id: string): Promise<Professor | undefined> => {
  return await connection(tabela)
    .where({ usuario_id })
    .first();
};

export const listarTodos = async (): Promise<Professor[]> => {
  return await connection(tabela)
    .select('*')
    .orderBy('created_at', 'desc');
};

export const criar = async (professor: Omit<Professor, 'professor_id' | 'created_at' | 'updated_at'>): Promise<Professor> => {
  const [novoProfessor] = await connection(tabela)
    .insert({
      ...professor,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning('*');
  return novoProfessor;
};

export const atualizar = async (professor_id: string, dadosAtualizacao: Partial<Omit<Professor, 'professor_id' | 'created_at'>>): Promise<Professor | undefined> => {
  const [professorAtualizado] = await connection(tabela)
    .where({ professor_id })
    .update({
      ...dadosAtualizacao,
      updated_at: new Date(),
    })
    .returning('*');
  return professorAtualizado;
};

export const deletar = async (professor_id: string): Promise<boolean> => {
  const linhasAfetadas = await connection(tabela)
    .where({ professor_id })
    .del();
  return linhasAfetadas > 0;
};

// Busca professor com dados do usuário (JOIN)
export const buscarComUsuario = async (professor_id: string) => {
  return await connection(tabela)
    .join('usuario', 'professor.usuario_id', 'usuario.usuario_id')
    .select(
      'professor.*',
      'usuario.nome_usuario',
      'usuario.email_usuario',
      'usuario.tipo_usuario_id'
    )
    .where('professor.professor_id', professor_id)
    .first();
};

// Lista todos os professores com dados do usuário
export const listarComUsuarios = async () => {
  return await connection(tabela)
    .join('usuario', 'professor.usuario_id', 'usuario.usuario_id')
    .select(
      'professor.*',
      'usuario.nome_usuario',
      'usuario.email_usuario',
      'usuario.tipo_usuario_id'
    )
    .orderBy('professor.created_at', 'desc');
};

// Lista usuários do tipo professor com turmas no ano letivo ativo
export const listarProfessoresComTurmas = async () => {
  return await connection('usuario')
    .join('usuario_tipo', 'usuario.tipo_usuario_id', 'usuario_tipo.tipo_usuario_id')
    .join('turma_disciplina_professor', 'usuario.usuario_id', 'turma_disciplina_professor.professor_id')
    .join('turma', 'turma_disciplina_professor.turma_id', 'turma.turma_id')
    .join('ano_letivo', 'turma.ano_letivo_id', 'ano_letivo.ano_letivo_id')
    .select(
      'usuario.usuario_id as professor_id',
      'usuario.usuario_id',
      'usuario.nome_usuario',
      'usuario.email_usuario',
      'ano_letivo.ano'
    )
    .where('usuario_tipo.nome_tipo', 'professor')
    .where('ano_letivo.ativo', true) // Apenas ano letivo ativo
    .groupBy('usuario.usuario_id', 'usuario.nome_usuario', 'usuario.email_usuario', 'ano_letivo.ano')
    .orderBy('usuario.nome_usuario', 'asc');
};

// Lista turmas e disciplinas de um professor específico
export const listarTurmasProfessor = async (professorId: string) => {
  return await connection('turma_disciplina_professor')
    .join('turma', 'turma_disciplina_professor.turma_id', 'turma.turma_id')
    .join('serie', 'turma.serie_id', 'serie.serie_id')
    .join('disciplina', 'turma_disciplina_professor.disciplina_id', 'disciplina.disciplina_id')
    .join('ano_letivo', 'turma.ano_letivo_id', 'ano_letivo.ano_letivo_id')
    .select(
      'turma.turma_id',
      'turma.nome_turma',
      'turma.turno',
      'turma.sala',
      'serie.nome_serie',
      'disciplina.disciplina_id',
      'disciplina.nome_disciplina',
      'ano_letivo.ano',
      'ano_letivo.ativo as ano_letivo_ativo',
      'turma_disciplina_professor.turma_disciplina_professor_id'
    )
    .where('turma_disciplina_professor.professor_id', professorId)
    .orderBy('turma.nome_turma', 'asc')
    .orderBy('disciplina.nome_disciplina', 'asc');
};