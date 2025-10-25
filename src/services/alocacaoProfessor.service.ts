import connection from '../connection';
import { logError, logSuccess, logInfo } from '../utils/logger';

/**
 * Service para gerenciar alocação de professores em disciplinas por ano letivo
 */
class AlocacaoProfessorService {

  /**
   * Lista todas as alocações de professores de um ano letivo específico
   */
  static async listarAlocacoesPorAnoLetivo(ano_letivo_id: string): Promise<any[]> {
    try {
      logInfo(`🔍 Buscando alocações do ano letivo: ${ano_letivo_id}`, 'alocacao');

      const alocacoes = await connection('turma_disciplina_professor as tdp')
        .select(
          'tdp.turma_disciplina_professor_id',
          'tdp.turma_id',
          'tdp.disciplina_id',
          'tdp.professor_id', // Retornar como professor_id (que agora é usuario_id)
          'tdp.created_at',
          'tdp.updated_at',
          'd.nome_disciplina',
          't.nome_turma',
          't.turno',
          't.sala',
          's.nome_serie',
          'u.nome_usuario as nome_professor',
          'u.email_usuario as email_professor',
          'al.ano as ano_letivo'
        )
        .join('turma as t', 'tdp.turma_id', 't.turma_id')
        .join('disciplina as d', 'tdp.disciplina_id', 'd.disciplina_id')
        .join('usuario as u', 'tdp.professor_id', 'u.usuario_id')
        .join('ano_letivo as al', 't.ano_letivo_id', 'al.ano_letivo_id')
        .join('serie as s', 't.serie_id', 's.serie_id')
        .where('t.ano_letivo_id', ano_letivo_id)
        .orderBy('u.nome_usuario', 'asc')
        .orderBy('d.nome_disciplina', 'asc');

      logSuccess(`✅ ${alocacoes.length} alocações encontradas`, 'alocacao');
      return alocacoes;
    } catch (error) {
      logError('❌ Erro ao listar alocações por ano letivo', 'alocacao', error);
      throw error;
    }
  }

  /**
   * Lista alocações de um professor específico (usando usuario_id)
   */
  static async listarAlocacoesPorProfessor(usuario_id: string): Promise<any[]> {
    try {
      logInfo(`🔍 Buscando alocações do professor (usuário): ${usuario_id}`, 'alocacao');

      const alocacoes = await connection('turma_disciplina_professor as tdp')
        .select(
          'tdp.turma_disciplina_professor_id',
          'tdp.turma_id',
          'tdp.disciplina_id',
          'tdp.professor_id', // Retornar como professor_id (que agora é usuario_id)
          'tdp.created_at',
          'd.nome_disciplina',
          't.nome_turma',
          't.turno',
          't.sala',
          's.nome_serie',
          'al.ano as ano_letivo',
          'al.ano_letivo_id',
          'al.ativo as ano_ativo'
        )
        .join('turma as t', 'tdp.turma_id', 't.turma_id')
        .join('disciplina as d', 'tdp.disciplina_id', 'd.disciplina_id')
        .join('ano_letivo as al', 't.ano_letivo_id', 'al.ano_letivo_id')
        .join('serie as s', 't.serie_id', 's.serie_id')
        .where('tdp.professor_id', usuario_id)
        .orderBy('al.ano', 'desc')
        .orderBy('d.nome_disciplina', 'asc');

      logSuccess(`✅ ${alocacoes.length} alocações encontradas para o professor`, 'alocacao');
      return alocacoes;
    } catch (error) {
      logError('❌ Erro ao listar alocações do professor', 'alocacao', error);
      throw error;
    }
  }

  /**
   * Cria múltiplas alocações de um professor em várias disciplinas/turmas
   * Agora usando usuario_id diretamente (sem tabela professor)
   */
  static async criarAlocacoes(alocacoes: Array<{
    turma_id: string;
    disciplina_id: string;
    professor_id: string; // Na verdade é o usuario_id
  }>): Promise<{ criadas: any[]; duplicadas: number; total: number }> {
    try {
      logInfo(`📝 Criando ${alocacoes.length} alocações`, 'alocacao');

      // Validações
      if (!alocacoes || alocacoes.length === 0) {
        throw new Error('Nenhuma alocação fornecida');
      }

      // Verificar duplicatas antes de inserir
      const novasAlocacoes = [];
      const duplicadas = [];

      for (const alocacao of alocacoes) {
        // Verificar se o usuário existe e é do tipo professor
        const usuario = await connection('usuario as u')
          .join('usuario_tipo as ut', 'u.tipo_usuario_id', 'ut.tipo_usuario_id')
          .select('u.usuario_id', 'ut.nome_tipo')
          .where('u.usuario_id', alocacao.professor_id)
          .first();

        if (!usuario) {
          throw new Error(`Usuário ${alocacao.professor_id} não encontrado`);
        }

        if (usuario.nome_tipo !== 'professor') {
          throw new Error(`Usuário ${alocacao.professor_id} não é do tipo professor`);
        }

        // Verificar se já existe
        const existente = await connection('turma_disciplina_professor')
          .where({
            turma_id: alocacao.turma_id,
            disciplina_id: alocacao.disciplina_id,
            professor_id: alocacao.professor_id // Usando usuario_id diretamente
          })
          .first();

        if (existente) {
          duplicadas.push(alocacao);
        } else {
          novasAlocacoes.push({
            turma_id: alocacao.turma_id,
            disciplina_id: alocacao.disciplina_id,
            professor_id: alocacao.professor_id, // Salvando usuario_id na coluna professor_id
            created_at: new Date(),
            updated_at: new Date()
          });
        }
      }

      // Inserir apenas as novas
      let resultado: any[] = [];
      if (novasAlocacoes.length > 0) {
        resultado = await connection('turma_disciplina_professor')
          .insert(novasAlocacoes)
          .returning('*');
      }

      logSuccess(`✅ ${resultado.length} alocações criadas (${duplicadas.length} duplicadas ignoradas)`, 'alocacao');
      
      return {
        criadas: resultado,
        duplicadas: duplicadas.length,
        total: alocacoes.length
      };
    } catch (error) {
      logError('❌ Erro ao criar alocações', 'alocacao', error);
      throw error;
    }
  }

  /**
   * Remove uma alocação específica
   */
  static async removerAlocacao(turma_disciplina_professor_id: string): Promise<boolean> {
    try {
      logInfo(`🗑️ Removendo alocação: ${turma_disciplina_professor_id}`, 'alocacao');

      // Verificar se existem aulas registradas
      const aulasVinculadas = await connection('aula')
        .where({ turma_disciplina_professor_id })
        .first();

      if (aulasVinculadas) {
        throw new Error('Não é possível remover alocação com aulas já registradas');
      }

      const deletados = await connection('turma_disciplina_professor')
        .where({ turma_disciplina_professor_id })
        .del();

      const sucesso = deletados > 0;

      if (sucesso) {
        logSuccess('✅ Alocação removida com sucesso', 'alocacao');
      } else {
        logError('⚠️ Alocação não encontrada', 'alocacao');
      }

      return sucesso;
    } catch (error) {
      logError('❌ Erro ao remover alocação', 'alocacao', error);
      throw error;
    }
  }

  /**
   * Remove todas as alocações de um professor em um ano letivo específico
   * professor_id aqui é na verdade usuario_id
   */
  static async removerAlocacoesProfessorAno(usuario_id: string, ano_letivo_id: string): Promise<number> {
    try {
      logInfo(`🗑️ Removendo alocações do professor (usuário) ${usuario_id} no ano ${ano_letivo_id}`, 'alocacao');

      // Buscar IDs das alocações deste professor neste ano
      const alocacoes = await connection('turma_disciplina_professor as tdp')
        .select('tdp.turma_disciplina_professor_id')
        .join('turma as t', 'tdp.turma_id', 't.turma_id')
        .where('tdp.professor_id', usuario_id) // professor_id na tabela contém usuario_id
        .where('t.ano_letivo_id', ano_letivo_id);

      if (alocacoes.length === 0) {
        return 0;
      }

      const ids = alocacoes.map(a => a.turma_disciplina_professor_id);

      // Verificar se há aulas registradas
      const aulasVinculadas = await connection('aula')
        .whereIn('turma_disciplina_professor_id', ids)
        .first();

      if (aulasVinculadas) {
        throw new Error('Não é possível remover alocações com aulas já registradas');
      }

      // Deletar alocações
      const deletados = await connection('turma_disciplina_professor')
        .whereIn('turma_disciplina_professor_id', ids)
        .del();

      logSuccess(`✅ ${deletados} alocações removidas`, 'alocacao');
      return deletados;
    } catch (error) {
      logError('❌ Erro ao remover alocações do professor', 'alocacao', error);
      throw error;
    }
  }

  /**
   * Busca turmas disponíveis para um ano letivo
   */
  static async buscarTurmasDisponiveis(ano_letivo_id: string): Promise<any[]> {
    try {
      logInfo(`🔍 Buscando turmas do ano letivo: ${ano_letivo_id}`, 'alocacao');

      const turmas = await connection('turma as t')
        .select(
          't.turma_id',
          't.nome_turma',
          't.turno',
          't.sala',
          's.nome_serie',
          's.serie_id'
        )
        .join('serie as s', 't.serie_id', 's.serie_id')
        .where('t.ano_letivo_id', ano_letivo_id)
        .orderBy('s.nome_serie', 'asc')
        .orderBy('t.nome_turma', 'asc');

      logSuccess(`✅ ${turmas.length} turmas encontradas`, 'alocacao');
      return turmas;
    } catch (error) {
      logError('❌ Erro ao buscar turmas disponíveis', 'alocacao', error);
      throw error;
    }
  }

  /**
   * Busca professores disponíveis (usuários com tipo professor)
   * Não usa mais a tabela professor
   */
  static async buscarProfessoresDisponiveis(): Promise<any[]> {
    try {
      logInfo('🔍 Buscando professores disponíveis', 'alocacao');

      // Buscar todos os usuários do tipo professor
      const professores = await connection('usuario as u')
        .select(
          'u.usuario_id',
          'u.nome_usuario',
          'u.email_usuario',
          'ut.nome_tipo'
        )
        .join('usuario_tipo as ut', 'u.tipo_usuario_id', 'ut.tipo_usuario_id')
        .where('ut.nome_tipo', 'professor')
        .orderBy('u.nome_usuario', 'asc');

      logSuccess(`✅ ${professores.length} professores encontrados`, 'alocacao');
      return professores;
    } catch (error) {
      logError('❌ Erro ao buscar professores disponíveis', 'alocacao', error);
      throw error;
    }
  }

  /**
   * Busca disciplinas disponíveis
   */
  static async buscarDisciplinasDisponiveis(): Promise<any[]> {
    try {
      logInfo('🔍 Buscando disciplinas disponíveis', 'alocacao');

      const disciplinas = await connection('disciplina')
        .select('disciplina_id', 'nome_disciplina')
        .orderBy('nome_disciplina', 'asc');

      logSuccess(`✅ ${disciplinas.length} disciplinas encontradas`, 'alocacao');
      return disciplinas;
    } catch (error) {
      logError('❌ Erro ao buscar disciplinas disponíveis', 'alocacao', error);
      throw error;
    }
  }

  /**
   * Obter estatísticas de alocação por ano letivo
   */
  static async obterEstatisticasAnoLetivo(ano_letivo_id: string): Promise<any> {
    try {
      logInfo(`📊 Calculando estatísticas do ano letivo: ${ano_letivo_id}`, 'alocacao');

      // Total de alocações
      const totalAlocacoes = await connection('turma_disciplina_professor as tdp')
        .join('turma as t', 'tdp.turma_id', 't.turma_id')
        .where('t.ano_letivo_id', ano_letivo_id)
        .count('* as total');

      // Total de professores alocados
      const totalProfessores = await connection('turma_disciplina_professor as tdp')
        .join('turma as t', 'tdp.turma_id', 't.turma_id')
        .where('t.ano_letivo_id', ano_letivo_id)
        .countDistinct('tdp.professor_id as total');

      // Total de disciplinas alocadas
      const totalDisciplinas = await connection('turma_disciplina_professor as tdp')
        .join('turma as t', 'tdp.turma_id', 't.turma_id')
        .where('t.ano_letivo_id', ano_letivo_id)
        .countDistinct('tdp.disciplina_id as total');

      // Total de turmas com alocações
      const totalTurmas = await connection('turma_disciplina_professor as tdp')
        .join('turma as t', 'tdp.turma_id', 't.turma_id')
        .where('t.ano_letivo_id', ano_letivo_id)
        .countDistinct('tdp.turma_id as total');

      const estatisticas = {
        total_alocacoes: parseInt(totalAlocacoes[0].total as string),
        total_professores: parseInt(totalProfessores[0].total as string),
        total_disciplinas: parseInt(totalDisciplinas[0].total as string),
        total_turmas: parseInt(totalTurmas[0].total as string)
      };

      logSuccess('✅ Estatísticas calculadas', 'alocacao', estatisticas);
      return estatisticas;
    } catch (error) {
      logError('❌ Erro ao obter estatísticas', 'alocacao', error);
      throw error;
    }
  }
}

export default AlocacaoProfessorService;

