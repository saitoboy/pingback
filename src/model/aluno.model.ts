import connection from '../connection';
import { Aluno } from '../types/models';

const tabela = 'aluno';

export const buscarPorId = async (aluno_id: string): Promise<Aluno | undefined> => {
  return await connection(tabela)
    .where({ aluno_id })
    .first();
};

export const buscarPorCpf = async (cpf_aluno: string): Promise<Aluno | undefined> => {
  return await connection(tabela)
    .where({ cpf_aluno })
    .first();
};

export const buscarPorRg = async (rg_aluno: string): Promise<Aluno | undefined> => {
  return await connection(tabela)
    .where({ rg_aluno })
    .first();
};

export const listarTodos = async (): Promise<Aluno[]> => {
  return await connection(tabela)
    .select('*')
    .orderBy('nome_aluno', 'asc');
};

export const listarPorIdade = async (idadeMinima: number, idadeMaxima: number): Promise<Aluno[]> => {
  const dataMinima = new Date();
  dataMinima.setFullYear(dataMinima.getFullYear() - idadeMaxima);
  
  const dataMaxima = new Date();
  dataMaxima.setFullYear(dataMaxima.getFullYear() - idadeMinima);
  
  return await connection(tabela)
    .whereBetween('data_nascimento_aluno', [dataMinima, dataMaxima])
    .orderBy('nome_aluno', 'asc');
};

export const criar = async (aluno: Omit<Aluno, 'aluno_id' | 'created_at' | 'updated_at'>): Promise<Aluno> => {
  const [novoAluno] = await connection(tabela)
    .insert({
      ...aluno,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning('*');
  return novoAluno;
};

export const atualizar = async (aluno_id: string, dadosAtualizacao: Partial<Omit<Aluno, 'aluno_id' | 'created_at'>>): Promise<Aluno | undefined> => {
  const [alunoAtualizado] = await connection(tabela)
    .where({ aluno_id })
    .update({
      ...dadosAtualizacao,
      updated_at: new Date(),
    })
    .returning('*');
  return alunoAtualizado;
};

export const deletar = async (aluno_id: string): Promise<boolean> => {
  const linhasAfetadas = await connection(tabela)
    .where({ aluno_id })
    .del();
  return linhasAfetadas > 0;
};

// Busca aluno com dados da religião e certidão (JOIN)
export const buscarComDependencias = async (aluno_id: string) => {
  return await connection(tabela)
    .leftJoin('religiao', 'aluno.religiao_id', 'religiao.religiao_id')
    .leftJoin('certidao_nascimento', 'aluno.certidao_id', 'certidao_nascimento.certidao_id')
    .select(
      'aluno.*',
      'religiao.nome_religiao',
      'certidao_nascimento.livro_certidao',
      'certidao_nascimento.matricula_certidao',
      'certidao_nascimento.termo_certidao',
      'certidao_nascimento.folha_certidao',
      'certidao_nascimento.data_expedicao_certidao',
      'certidao_nascimento.nome_cartorio_certidao'
    )
    .where('aluno.aluno_id', aluno_id)
    .first();
};

// Lista todos os alunos com dados da religião e certidão
export const listarComDependencias = async () => {
  return await connection(tabela)
    .leftJoin('religiao', 'aluno.religiao_id', 'religiao.religiao_id')
    .leftJoin('certidao_nascimento', 'aluno.certidao_id', 'certidao_nascimento.certidao_id')
    .select(
      'aluno.*',
      'religiao.nome_religiao',
      'certidao_nascimento.livro_certidao',
      'certidao_nascimento.matricula_certidao',
      'certidao_nascimento.termo_certidao'
    )
    .orderBy('aluno.nome_aluno', 'asc');
};

// Pesquisa alunos por nome
export const pesquisarPorNome = async (termo: string): Promise<Aluno[]> => {
  return await connection(tabela)
    .where('nome_aluno', 'ilike', `%${termo}%`)
    .orWhere('sobrenome_aluno', 'ilike', `%${termo}%`)
    .orderBy('nome_aluno', 'asc');
};

// Busca aluno por CPF com dependências (religião e certidão)
export const buscarPorCpfComDependencias = async (cpf_aluno: string) => {
  return await connection(tabela)
    .leftJoin('religiao', 'aluno.religiao_id', 'religiao.religiao_id')
    .leftJoin('certidao_nascimento', 'aluno.certidao_id', 'certidao_nascimento.certidao_id')
    .select(
      'aluno.*',
      'religiao.nome_religiao',
      'certidao_nascimento.livro_certidao',
      'certidao_nascimento.matricula_certidao',
      'certidao_nascimento.termo_certidao',
      'certidao_nascimento.folha_certidao',
      'certidao_nascimento.data_expedicao_certidao',
      'certidao_nascimento.nome_cartorio_certidao'
    )
    .where('aluno.cpf_aluno', cpf_aluno)
    .first();
};

// Busca aluno por número de matrícula com dependências
export const buscarPorMatriculaComDependencias = async (numero_matricula: string) => {
  return await connection(tabela)
    .leftJoin('religiao', 'aluno.religiao_id', 'religiao.religiao_id')
    .leftJoin('certidao_nascimento', 'aluno.certidao_id', 'certidao_nascimento.certidao_id')
    .select(
      'aluno.*',
      'religiao.nome_religiao',
      'certidao_nascimento.livro_certidao',
      'certidao_nascimento.matricula_certidao',
      'certidao_nascimento.termo_certidao',
      'certidao_nascimento.folha_certidao',
      'certidao_nascimento.data_expedicao_certidao',
      'certidao_nascimento.nome_cartorio_certidao'
    )
    .where('aluno.numero_matricula_aluno', numero_matricula)
    .first();
};

// Obter estatísticas gerais dos alunos
export const obterEstatisticas = async () => {
  // Total de alunos
  const totalResult = await connection(tabela).count('* as total');
  const totalAlunos = parseInt(totalResult[0].total as string);

  // Religião mais comum
  const religiaoResult = await connection(tabela)
    .join('religiao', 'aluno.religiao_id', 'religiao.religiao_id')
    .select('religiao.nome_religiao')
    .count('* as total')
    .groupBy('religiao.religiao_id', 'religiao.nome_religiao')
    .orderBy('total', 'desc')
    .limit(1);

  // Calcular faixa etária usando JavaScript para simplicidade
  const alunos = await connection(tabela).select('data_nascimento_aluno');
  
  let idadeMinima = 999;
  let idadeMaxima = 0;
  let somaIdades = 0;
  const distribuicaoIdades: Record<number, number> = {};

  alunos.forEach(aluno => {
    const hoje = new Date();
    const nascimento = new Date(aluno.data_nascimento_aluno);
    const idade = hoje.getFullYear() - nascimento.getFullYear();
    
    if (idade < idadeMinima) idadeMinima = idade;
    if (idade > idadeMaxima) idadeMaxima = idade;
    somaIdades += idade;
    
    distribuicaoIdades[idade] = (distribuicaoIdades[idade] || 0) + 1;
  });

  const idadeMedia = alunos.length > 0 ? Math.round((somaIdades / alunos.length) * 100) / 100 : 0;

  return {
    total_alunos: totalAlunos,
    religiao_mais_comum: religiaoResult.length > 0 ? {
      nome: religiaoResult[0].nome_religiao,
      total: parseInt(religiaoResult[0].total as string)
    } : null,
    faixa_etaria: {
      idade_minima: alunos.length > 0 ? idadeMinima : 0,
      idade_maxima: alunos.length > 0 ? idadeMaxima : 0,
      idade_media: idadeMedia
    },
    distribuicao_por_idade: distribuicaoIdades
  };
};
