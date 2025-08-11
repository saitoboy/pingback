import connection from '../connection';
import { ConteudoAula } from '../types/models';

const tabela = 'conteudo_aula';

export const listarTodos = async (): Promise<ConteudoAula[]> => {
  return await connection(tabela)
    .select('*')
    .orderBy('created_at', 'desc');
};

export const buscarPorId = async (conteudo_aula_id: string): Promise<ConteudoAula | undefined> => {
  return await connection(tabela)
    .where({ conteudo_aula_id })
    .first();
};

export const buscarPorAula = async (aula_id: string): Promise<ConteudoAula[]> => {
  return await connection(tabela)
    .where({ aula_id })
    .orderBy('created_at', 'asc');
};

export const criar = async (
  conteudo: Omit<ConteudoAula, 'conteudo_aula_id' | 'created_at' | 'updated_at'>
): Promise<ConteudoAula> => {
  // Verificar se a aula existe
  const aulaExiste = await connection('aula')
    .where({ aula_id: conteudo.aula_id })
    .first();

  if (!aulaExiste) {
    throw new Error('Aula não encontrada');
  }

  const [novoConteudo] = await connection(tabela)
    .insert({
      ...conteudo,
      created_at: new Date(),
      updated_at: new Date()
    })
    .returning('*');

  return novoConteudo;
};

export const atualizar = async (
  conteudo_aula_id: string,
  dadosAtualizacao: Partial<Omit<ConteudoAula, 'conteudo_aula_id' | 'aula_id' | 'created_at' | 'updated_at'>>
): Promise<ConteudoAula | undefined> => {
  const [conteudoAtualizado] = await connection(tabela)
    .where({ conteudo_aula_id })
    .update({
      ...dadosAtualizacao,
      updated_at: new Date()
    })
    .returning('*');

  return conteudoAtualizado;
};

export const deletar = async (conteudo_aula_id: string): Promise<boolean> => {
  const deletados = await connection(tabela)
    .where({ conteudo_aula_id })
    .del();

  return deletados > 0;
};

// Buscar conteúdo com detalhes da aula e vinculação
export const buscarComDetalhes = async (conteudo_aula_id?: string): Promise<any> => {
  let query = connection(tabela)
    .select('*')
    .orderBy('created_at', 'desc');

  if (conteudo_aula_id) {
    return await query.where('conteudo_aula_id', conteudo_aula_id).first();
  }

  return await query;
};

// Verificar se um professor tem acesso a um conteúdo (é o professor responsável pela aula)
export const verificarAcessoProfessor = async (conteudo_aula_id: string, professor_id: string): Promise<boolean> => {
  const conteudo = await connection(tabela)
    .select('ca.conteudo_aula_id')
    .from(`${tabela} as ca`)
    .join('aula as a', 'ca.aula_id', 'a.aula_id')
    .join('turma_disciplina_professor as tdp', 'a.turma_disciplina_professor_id', 'tdp.turma_disciplina_professor_id')
    .where('ca.conteudo_aula_id', conteudo_aula_id)
    .where('tdp.professor_id', professor_id)
    .first();

  return !!conteudo;
};
