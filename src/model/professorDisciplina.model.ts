import connection from '../connection';
import { Disciplina, ProfessorDisciplina } from '../types/models';

const tabela = 'professor_disciplina';

/**
 * Lista as disciplinas que um professor está habilitado a lecionar,
 * já com os dados completos da disciplina (nome e categoria).
 * professor_id = usuario.usuario_id
 */
export const listarDisciplinasDoProfessor = async (professor_id: string): Promise<Disciplina[]> => {
  return await connection(`${tabela} as pd`)
    .select('d.disciplina_id', 'd.nome_disciplina', 'd.categoria', 'd.created_at', 'd.updated_at')
    .join('disciplina as d', 'pd.disciplina_id', 'd.disciplina_id')
    .where('pd.professor_id', professor_id)
    .orderBy('d.nome_disciplina', 'asc');
};

/**
 * Lista as vinculações cruas (sem join) de um professor.
 */
export const listarPorProfessor = async (professor_id: string): Promise<ProfessorDisciplina[]> => {
  return await connection(tabela)
    .where({ professor_id })
    .orderBy('created_at', 'asc');
};

/**
 * Lista os ids das disciplinas marcadas como "base" (currículo padrão).
 */
export const listarIdsDisciplinasBase = async (): Promise<string[]> => {
  const rows = await connection('disciplina')
    .select('disciplina_id')
    .where({ categoria: 'base' });
  return rows.map((r) => r.disciplina_id);
};

/**
 * Adiciona (sem sobrescrever) um conjunto de disciplinas a vários professores.
 * Ignora os vínculos que já existem. Retorna a quantidade de vínculos criados.
 */
export const adicionarDisciplinasParaProfessores = async (
  professor_ids: string[],
  disciplina_ids: string[]
): Promise<number> => {
  if (professor_ids.length === 0 || disciplina_ids.length === 0) return 0;

  return await connection.transaction(async (trx) => {
    // Buscar os vínculos que já existem para não duplicar
    const existentes = await trx(tabela)
      .whereIn('professor_id', professor_ids)
      .whereIn('disciplina_id', disciplina_ids)
      .select('professor_id', 'disciplina_id');

    const existentesSet = new Set(existentes.map((e) => `${e.professor_id}|${e.disciplina_id}`));

    const registros: Array<{ professor_id: string; disciplina_id: string; created_at: Date; updated_at: Date }> = [];
    for (const professor_id of professor_ids) {
      for (const disciplina_id of disciplina_ids) {
        if (!existentesSet.has(`${professor_id}|${disciplina_id}`)) {
          registros.push({ professor_id, disciplina_id, created_at: new Date(), updated_at: new Date() });
        }
      }
    }

    if (registros.length > 0) {
      await trx(tabela).insert(registros);
    }

    return registros.length;
  });
};

/**
 * Substitui todo o conjunto de disciplinas de um professor pelos ids informados.
 * Faz dentro de uma transação: apaga as atuais e insere as novas.
 */
export const definirDisciplinasDoProfessor = async (
  professor_id: string,
  disciplina_ids: string[]
): Promise<Disciplina[]> => {
  await connection.transaction(async (trx) => {
    // Remove as habilitações atuais do professor
    await trx(tabela).where({ professor_id }).del();

    // Insere as novas (sem duplicar ids repetidos)
    const idsUnicos = [...new Set(disciplina_ids)];
    if (idsUnicos.length > 0) {
      const registros = idsUnicos.map((disciplina_id) => ({
        professor_id,
        disciplina_id,
        created_at: new Date(),
        updated_at: new Date()
      }));
      await trx(tabela).insert(registros);
    }
  });

  return await listarDisciplinasDoProfessor(professor_id);
};
