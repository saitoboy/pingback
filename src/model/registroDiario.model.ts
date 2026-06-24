import connection from '../connection';
import { RegistroDiario } from '../types/models';

const tabela = 'registro_diario';

type DadosRegistro = Partial<Omit<RegistroDiario, 'registro_diario_id' | 'created_at' | 'updated_at'>>;

// Serializa campos jsonb (arrays) antes de gravar
const serializar = (dados: DadosRegistro): Record<string, any> => {
  const out: Record<string, any> = { ...dados };
  if (dados.recursos !== undefined) {
    out.recursos = dados.recursos === null ? null : JSON.stringify(dados.recursos);
  }
  if (dados.fotos !== undefined) {
    out.fotos = dados.fotos === null ? null : JSON.stringify(dados.fotos);
  }
  return out;
};

export const buscarPorId = async (registro_diario_id: string): Promise<RegistroDiario | undefined> => {
  return await connection(tabela).where({ registro_diario_id }).first();
};

// Busca o registro de uma vinculação numa data específica (único por dia)
export const buscarPorDataEVinculacao = async (
  turma_disciplina_professor_id: string,
  data_aula: string
): Promise<RegistroDiario | undefined> => {
  return await connection(tabela)
    .where({ turma_disciplina_professor_id })
    .whereRaw('DATE(data_aula) = DATE(?)', [data_aula])
    .first();
};

// Lista todos os registros de uma vinculação (para timeline / calendário)
export const listarPorVinculacao = async (
  turma_disciplina_professor_id: string
): Promise<RegistroDiario[]> => {
  return await connection(tabela)
    .where({ turma_disciplina_professor_id })
    .orderBy('data_aula', 'desc');
};

// Lista todos os registros de um professor com detalhes da turma/disciplina (visão admin)
export const listarPorProfessorComDetalhes = async (professor_id: string): Promise<any[]> => {
  return await connection(`${tabela} as rd`)
    .join('turma_disciplina_professor as tdp', 'rd.turma_disciplina_professor_id', 'tdp.turma_disciplina_professor_id')
    .join('disciplina as d', 'tdp.disciplina_id', 'd.disciplina_id')
    .join('turma as t', 'tdp.turma_id', 't.turma_id')
    .leftJoin('serie as s', 't.serie_id', 's.serie_id')
    .where('tdp.professor_id', professor_id)
    .select(
      'rd.registro_diario_id',
      'rd.turma_disciplina_professor_id',
      'rd.data_aula',
      'rd.status',
      'rd.resumo',
      'rd.created_at',
      'rd.updated_at',
      'd.nome_disciplina',
      't.nome_turma',
      't.turno',
      's.nome_serie'
    )
    .orderBy('rd.data_aula', 'desc');
};

export const criar = async (
  dados: Omit<RegistroDiario, 'registro_diario_id' | 'created_at' | 'updated_at'>
): Promise<RegistroDiario> => {
  const vinculacaoExiste = await connection('turma_disciplina_professor')
    .where({ turma_disciplina_professor_id: dados.turma_disciplina_professor_id })
    .first();

  if (!vinculacaoExiste) {
    throw new Error('Vinculação professor-turma-disciplina não encontrada');
  }

  const [registro] = await connection(tabela)
    .insert({
      ...serializar(dados),
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning('*');

  return registro;
};

export const atualizar = async (
  registro_diario_id: string,
  dados: DadosRegistro
): Promise<RegistroDiario | undefined> => {
  const [registro] = await connection(tabela)
    .where({ registro_diario_id })
    .update({
      ...serializar(dados),
      updated_at: new Date(),
    })
    .returning('*');

  return registro;
};

export const deletar = async (registro_diario_id: string): Promise<boolean> => {
  const deletados = await connection(tabela).where({ registro_diario_id }).del();
  return deletados > 0;
};

// Verifica se o professor é o responsável pela vinculação do registro
export const verificarAcessoProfessor = async (
  registro_diario_id: string,
  professor_id: string
): Promise<boolean> => {
  const registro = await connection(`${tabela} as rd`)
    .join('turma_disciplina_professor as tdp', 'rd.turma_disciplina_professor_id', 'tdp.turma_disciplina_professor_id')
    .where('rd.registro_diario_id', registro_diario_id)
    .where('tdp.professor_id', professor_id)
    .select('rd.registro_diario_id')
    .first();

  return !!registro;
};

// Verifica se o professor é o responsável por uma vinculação
export const professorEhDonoDaVinculacao = async (
  turma_disciplina_professor_id: string,
  professor_id: string
): Promise<boolean> => {
  const vinculacao = await connection('turma_disciplina_professor')
    .where({ turma_disciplina_professor_id, professor_id })
    .first();

  return !!vinculacao;
};
