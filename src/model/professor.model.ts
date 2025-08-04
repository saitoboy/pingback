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
