import knex from '../connection';
import { HistoricoEscolar, HistoricoEscolarDisciplina } from '../types/models';
import logger from '../utils/logger';

export class HistoricoEscolarModel {

  // ================ CRUD BÁSICO ================

  static async criar(dadosHistorico: Omit<HistoricoEscolar, 'historico_escolar_id' | 'created_at' | 'updated_at'>): Promise<HistoricoEscolar> {
    try {
      logger.info('Model: Criando histórico escolar', 'HistoricoEscolarModel', { 
        matricula_aluno_id: dadosHistorico.matricula_aluno_id,
        ano_letivo_id: dadosHistorico.ano_letivo_id,
        situacao_final: dadosHistorico.situacao_final 
      });

      const [historico] = await knex('historico_escolar')
        .insert(dadosHistorico)
        .returning('*');

      logger.info('Histórico escolar criado com sucesso', 'HistoricoEscolarModel', { 
        historico_escolar_id: historico.historico_escolar_id 
      });

      return historico;
    } catch (error) {
      logger.error('Erro ao criar histórico escolar:', 'HistoricoEscolarModel', error);
      throw error;
    }
  }

  static async buscarPorId(historico_escolar_id: string): Promise<HistoricoEscolar | null> {
    try {
      logger.info(`Model: Buscando histórico escolar por ID: ${historico_escolar_id}`, 'HistoricoEscolarModel');

      const historico = await knex('historico_escolar')
        .select(
          'he.*',
          'ma.ra',
          'a.nome_aluno',
          'a.sobrenome_aluno',
          'al.ano',
          's.nome_serie',
          't.nome_turma'
        )
        .from('historico_escolar as he')
        .leftJoin('matricula_aluno as ma', 'he.matricula_aluno_id', 'ma.matricula_aluno_id')
        .leftJoin('aluno as a', 'ma.aluno_id', 'a.aluno_id')
        .leftJoin('ano_letivo as al', 'he.ano_letivo_id', 'al.ano_letivo_id')
        .leftJoin('turma as t', 'ma.turma_id', 't.turma_id')
        .leftJoin('serie as s', 't.serie_id', 's.serie_id')
        .where('he.historico_escolar_id', historico_escolar_id)
        .first();

      if (historico) {
        logger.info('Histórico escolar encontrado', 'HistoricoEscolarModel', { 
          historico_escolar_id,
          situacao_final: historico.situacao_final 
        });
      } else {
        logger.warning(`Histórico escolar não encontrado: ${historico_escolar_id}`, 'HistoricoEscolarModel');
      }

      return historico || null;
    } catch (error) {
      logger.error(`Erro ao buscar histórico escolar por ID ${historico_escolar_id}:`, 'HistoricoEscolarModel', error);
      throw error;
    }
  }

  static async listarTodos(): Promise<HistoricoEscolar[]> {
    try {
      logger.info('Model: Listando todos os históricos escolares', 'HistoricoEscolarModel');

      const historicos = await knex('historico_escolar')
        .select(
          'he.*',
          'ma.ra',
          'a.nome_aluno',
          'a.sobrenome_aluno',
          'al.ano',
          's.nome_serie',
          't.nome_turma'
        )
        .from('historico_escolar as he')
        .leftJoin('matricula_aluno as ma', 'he.matricula_aluno_id', 'ma.matricula_aluno_id')
        .leftJoin('aluno as a', 'ma.aluno_id', 'a.aluno_id')
        .leftJoin('ano_letivo as al', 'he.ano_letivo_id', 'al.ano_letivo_id')
        .leftJoin('turma as t', 'ma.turma_id', 't.turma_id')
        .leftJoin('serie as s', 't.serie_id', 's.serie_id')
        .orderBy('al.ano', 'desc')
        .orderBy('a.nome_aluno', 'asc');

      logger.info(`Históricos escolares listados: ${historicos.length}`, 'HistoricoEscolarModel');
      return historicos;
    } catch (error) {
      logger.error('Erro ao listar históricos escolares:', 'HistoricoEscolarModel', error);
      throw error;
    }
  }

  static async atualizar(
    historico_escolar_id: string, 
    dadosAtualizacao: Partial<Omit<HistoricoEscolar, 'historico_escolar_id' | 'created_at' | 'updated_at'>>
  ): Promise<HistoricoEscolar | null> {
    try {
      logger.info(`Model: Atualizando histórico escolar: ${historico_escolar_id}`, 'HistoricoEscolarModel', dadosAtualizacao);

      const [historico] = await knex('historico_escolar')
        .where('historico_escolar_id', historico_escolar_id)
        .update({
          ...dadosAtualizacao,
          updated_at: knex.fn.now()
        })
        .returning('*');

      if (historico) {
        logger.info('Histórico escolar atualizado com sucesso', 'HistoricoEscolarModel', { 
          historico_escolar_id,
          situacao_final: historico.situacao_final 
        });
      } else {
        logger.warning(`Histórico escolar não encontrado para atualização: ${historico_escolar_id}`, 'HistoricoEscolarModel');
      }

      return historico || null;
    } catch (error) {
      logger.error(`Erro ao atualizar histórico escolar ${historico_escolar_id}:`, 'HistoricoEscolarModel', error);
      throw error;
    }
  }

  static async excluir(historico_escolar_id: string): Promise<boolean> {
    try {
      logger.info(`Model: Excluindo histórico escolar: ${historico_escolar_id}`, 'HistoricoEscolarModel');

      const linhasAfetadas = await knex('historico_escolar')
        .where('historico_escolar_id', historico_escolar_id)
        .del();

      const sucesso = linhasAfetadas > 0;

      if (sucesso) {
        logger.info('Histórico escolar excluído com sucesso', 'HistoricoEscolarModel', { historico_escolar_id });
      } else {
        logger.warning(`Histórico escolar não encontrado para exclusão: ${historico_escolar_id}`, 'HistoricoEscolarModel');
      }

      return sucesso;
    } catch (error) {
      logger.error(`Erro ao excluir histórico escolar ${historico_escolar_id}:`, 'HistoricoEscolarModel', error);
      throw error;
    }
  }

  // ================ MÉTODOS ESPECÍFICOS ================

  static async buscarPorMatricula(matricula_aluno_id: string): Promise<HistoricoEscolar[]> {
    try {
      logger.info(`Model: Buscando históricos por matrícula: ${matricula_aluno_id}`, 'HistoricoEscolarModel');

      const historicos = await knex('historico_escolar')
        .select(
          'he.*',
          'ma.ra',
          'a.nome_aluno',
          'a.sobrenome_aluno',
          'al.ano',
          's.nome_serie',
          't.nome_turma'
        )
        .from('historico_escolar as he')
        .leftJoin('matricula_aluno as ma', 'he.matricula_aluno_id', 'ma.matricula_aluno_id')
        .leftJoin('aluno as a', 'ma.aluno_id', 'a.aluno_id')
        .leftJoin('ano_letivo as al', 'he.ano_letivo_id', 'al.ano_letivo_id')
        .leftJoin('turma as t', 'ma.turma_id', 't.turma_id')
        .leftJoin('serie as s', 't.serie_id', 's.serie_id')
        .where('he.matricula_aluno_id', matricula_aluno_id)
        .orderBy('al.ano', 'desc');

      logger.info(`Históricos encontrados para matrícula: ${historicos.length}`, 'HistoricoEscolarModel');
      return historicos;
    } catch (error) {
      logger.error(`Erro ao buscar históricos por matrícula ${matricula_aluno_id}:`, 'HistoricoEscolarModel', error);
      throw error;
    }
  }

  static async buscarPorAnoLetivo(ano_letivo_id: string): Promise<HistoricoEscolar[]> {
    try {
      logger.info(`Model: Buscando históricos por ano letivo: ${ano_letivo_id}`, 'HistoricoEscolarModel');

      const historicos = await knex('historico_escolar')
        .select(
          'he.*',
          'ma.ra',
          'a.nome_aluno',
          'a.sobrenome_aluno',
          'al.ano',
          's.nome_serie',
          't.nome_turma'
        )
        .from('historico_escolar as he')
        .leftJoin('matricula_aluno as ma', 'he.matricula_aluno_id', 'ma.matricula_aluno_id')
        .leftJoin('aluno as a', 'ma.aluno_id', 'a.aluno_id')
        .leftJoin('ano_letivo as al', 'he.ano_letivo_id', 'al.ano_letivo_id')
        .leftJoin('turma as t', 'ma.turma_id', 't.turma_id')
        .leftJoin('serie as s', 't.serie_id', 's.serie_id')
        .where('he.ano_letivo_id', ano_letivo_id)
        .orderBy('a.nome_aluno', 'asc');

      logger.info(`Históricos encontrados para ano letivo: ${historicos.length}`, 'HistoricoEscolarModel');
      return historicos;
    } catch (error) {
      logger.error(`Erro ao buscar históricos por ano letivo ${ano_letivo_id}:`, 'HistoricoEscolarModel', error);
      throw error;
    }
  }

  static async buscarPorMatriculaEAno(matricula_aluno_id: string, ano_letivo_id: string): Promise<HistoricoEscolar | null> {
    try {
      logger.info(`Model: Buscando histórico por matrícula e ano: ${matricula_aluno_id}, ${ano_letivo_id}`, 'HistoricoEscolarModel');

      const historico = await knex('historico_escolar')
        .select(
          'he.*',
          'ma.ra',
          'a.nome_aluno',
          'a.sobrenome_aluno',
          'al.ano',
          's.nome_serie',
          't.nome_turma'
        )
        .from('historico_escolar as he')
        .leftJoin('matricula_aluno as ma', 'he.matricula_aluno_id', 'ma.matricula_aluno_id')
        .leftJoin('aluno as a', 'ma.aluno_id', 'a.aluno_id')
        .leftJoin('ano_letivo as al', 'he.ano_letivo_id', 'al.ano_letivo_id')
        .leftJoin('turma as t', 'ma.turma_id', 't.turma_id')
        .leftJoin('serie as s', 't.serie_id', 's.serie_id')
        .where('he.matricula_aluno_id', matricula_aluno_id)
        .where('he.ano_letivo_id', ano_letivo_id)
        .first();

      if (historico) {
        logger.info('Histórico encontrado por matrícula e ano', 'HistoricoEscolarModel', { 
          historico_escolar_id: historico.historico_escolar_id,
          situacao_final: historico.situacao_final 
        });
      } else {
        logger.info(`Histórico não encontrado para matrícula ${matricula_aluno_id} e ano ${ano_letivo_id}`, 'HistoricoEscolarModel');
      }

      return historico || null;
    } catch (error) {
      logger.error(`Erro ao buscar histórico por matrícula e ano:`, 'HistoricoEscolarModel', error);
      throw error;
    }
  }

  static async buscarCompleto(historico_escolar_id: string): Promise<any | null> {
    try {
      logger.info(`Model: Buscando histórico completo: ${historico_escolar_id}`, 'HistoricoEscolarModel');

      // Buscar dados básicos do histórico
      const historico = await knex('historico_escolar')
        .select(
          'he.*',
          'ma.ra',
          'ma.status as status_matricula',
          'a.nome_aluno',
          'a.sobrenome_aluno',
          'al.ano',
          'al.data_inicio',
          'al.data_fim',
          's.nome_serie',
          't.nome_turma',
          't.turno'
        )
        .from('historico_escolar as he')
        .leftJoin('matricula_aluno as ma', 'he.matricula_aluno_id', 'ma.matricula_aluno_id')
        .leftJoin('aluno as a', 'ma.aluno_id', 'a.aluno_id')
        .leftJoin('ano_letivo as al', 'he.ano_letivo_id', 'al.ano_letivo_id')
        .leftJoin('turma as t', 'ma.turma_id', 't.turma_id')
        .leftJoin('serie as s', 't.serie_id', 's.serie_id')
        .where('he.historico_escolar_id', historico_escolar_id)
        .first();

      if (!historico) {
        return null;
      }

      // Buscar todos os boletins do ano letivo
      const boletins = await knex('boletim')
        .select(
          'b.*',
          'pl.bimestre',
          knex.raw('COUNT(bd.boletim_disciplina_id) as total_disciplinas'),
          knex.raw('AVG(bd.media_bimestre) as media_bimestre_geral'),
          knex.raw('SUM(bd.faltas_bimestre) as total_faltas_bimestre')
        )
        .from('boletim as b')
        .leftJoin('periodo_letivo as pl', 'b.periodo_letivo_id', 'pl.periodo_letivo_id')
        .leftJoin('boletim_disciplina as bd', 'b.boletim_id', 'bd.boletim_id')
        .where('b.matricula_aluno_id', historico.matricula_aluno_id)
        .where('pl.ano_letivo_id', historico.ano_letivo_id)
        .groupBy('b.boletim_id', 'pl.bimestre')
        .orderBy('pl.bimestre', 'asc');

      const resultado = {
        historico_escolar: historico,
        boletins_bimestrais: boletins,
        resumo: {
          total_bimestres: boletins.length,
          media_geral_anual: historico.media_final_anual,
          total_faltas_anual: historico.total_faltas_anual,
          situacao_final: historico.situacao_final
        }
      };

      logger.info('Histórico completo recuperado', 'HistoricoEscolarModel', { 
        historico_escolar_id,
        total_bimestres: boletins.length 
      });

      return resultado;
    } catch (error) {
      logger.error(`Erro ao buscar histórico completo ${historico_escolar_id}:`, 'HistoricoEscolarModel', error);
      throw error;
    }
  }

  // ================ GERAÇÃO AUTOMÁTICA ================

  static async gerarAutomatico(matricula_aluno_id: string, ano_letivo_id: string): Promise<HistoricoEscolar> {
    try {
      logger.info('Model: Gerando histórico escolar automático', 'HistoricoEscolarModel', { 
        matricula_aluno_id, 
        ano_letivo_id 
      });

      // Verificar se já existe um histórico para esta matrícula/ano
      const historicoExistente = await knex('historico_escolar')
        .where('matricula_aluno_id', matricula_aluno_id)
        .where('ano_letivo_id', ano_letivo_id)
        .first();

      if (historicoExistente) {
        throw new Error('Já existe um histórico escolar para esta matrícula e ano letivo');
      }

      // Calcular médias e faltas baseadas nos boletins
      const estatisticas = await knex('boletim')
        .select(
          knex.raw('AVG(bd.media_bimestre) as media_final'),
          knex.raw('SUM(bd.faltas_bimestre) as total_faltas')
        )
        .from('boletim as b')
        .leftJoin('periodo_letivo as pl', 'b.periodo_letivo_id', 'pl.periodo_letivo_id')
        .leftJoin('boletim_disciplina as bd', 'b.boletim_id', 'bd.boletim_id')
        .where('b.matricula_aluno_id', matricula_aluno_id)
        .where('pl.ano_letivo_id', ano_letivo_id)
        .first();

      const mediaFinal = parseFloat((estatisticas as any)?.media_final) || 0;
      const totalFaltas = parseInt((estatisticas as any)?.total_faltas) || 0;

      // Determinar situação final baseada na média
      let situacaoFinal: 'aprovado' | 'reprovado' | 'em_andamento' = 'em_andamento';
      
      if (mediaFinal >= 7.0) {
        situacaoFinal = 'aprovado';
      } else if (mediaFinal > 0 && mediaFinal < 7.0) {
        situacaoFinal = 'reprovado';
      }

      const dadosHistorico = {
        matricula_aluno_id,
        ano_letivo_id,
        situacao_final: situacaoFinal,
        observacoes_finais: 'Histórico gerado automaticamente baseado nos boletins bimestrais',
        data_conclusao: situacaoFinal !== 'em_andamento' ? new Date() : undefined,
        media_geral_anual: mediaFinal,
        total_disciplinas_cursadas: 0, // Será atualizado pelo service
        disciplinas_aprovadas: 0, // Será atualizado pelo service  
        disciplinas_reprovadas: 0 // Será atualizado pelo service
      };

      const historico = await this.criar(dadosHistorico);

      logger.info('Histórico escolar gerado automaticamente', 'HistoricoEscolarModel', { 
        historico_escolar_id: historico.historico_escolar_id,
        media_final: mediaFinal,
        situacao_final: situacaoFinal 
      });

      return historico;
    } catch (error) {
      logger.error('Erro ao gerar histórico escolar automático:', 'HistoricoEscolarModel', error);
      throw error;
    }
  }

  // ================ VALIDAÇÕES ================

  static async validarUnicidade(matricula_aluno_id: string, ano_letivo_id: string, historico_escolar_id?: string): Promise<boolean> {
    try {
      let query = knex('historico_escolar')
        .where('matricula_aluno_id', matricula_aluno_id)
        .where('ano_letivo_id', ano_letivo_id);

      if (historico_escolar_id) {
        query = query.whereNot('historico_escolar_id', historico_escolar_id);
      }

      const existente = await query.first();
      return !existente;
    } catch (error) {
      logger.error('Erro ao validar unicidade do histórico escolar:', 'HistoricoEscolarModel', error);
      throw error;
    }
  }

  // ================ MÉTODOS PARA DISCIPLINAS DO HISTÓRICO ================

  static async criarDisciplina(dadosDisciplina: Omit<HistoricoEscolarDisciplina, 'historico_disciplina_id' | 'created_at' | 'updated_at'>): Promise<HistoricoEscolarDisciplina> {
    try {
      logger.info('Model: Criando disciplina do histórico escolar', 'HistoricoEscolarModel', { 
        historico_escolar_id: dadosDisciplina.historico_escolar_id,
        turma_disciplina_professor_id: dadosDisciplina.turma_disciplina_professor_id,
        situacao_disciplina: dadosDisciplina.situacao_disciplina 
      });

      const [disciplina] = await knex('historico_escolar_disciplina')
        .insert(dadosDisciplina)
        .returning('*');

      logger.info('Disciplina do histórico criada com sucesso', 'HistoricoEscolarModel', { 
        historico_disciplina_id: disciplina.historico_disciplina_id 
      });

      return disciplina;
    } catch (error) {
      logger.error('Erro ao criar disciplina do histórico:', 'HistoricoEscolarModel', error);
      throw error;
    }
  }

  static async buscarDisciplinasHistorico(historico_escolar_id: string): Promise<HistoricoEscolarDisciplina[]> {
    try {
      logger.info(`Model: Buscando disciplinas do histórico: ${historico_escolar_id}`, 'HistoricoEscolarModel');

      const disciplinas = await knex('historico_escolar_disciplina')
        .select(
          'hed.*',
          'd.nome_disciplina',
          'd.codigo_disciplina',
          'p.nome_professor',
          'p.sobrenome_professor'
        )
        .from('historico_escolar_disciplina as hed')
        .leftJoin('turma_disciplina_professor as tdp', 'hed.turma_disciplina_professor_id', 'tdp.turma_disciplina_professor_id')
        .leftJoin('disciplina as d', 'tdp.disciplina_id', 'd.disciplina_id')
        .leftJoin('professor as p', 'tdp.professor_id', 'p.professor_id')
        .where('hed.historico_escolar_id', historico_escolar_id)
        .orderBy('d.nome_disciplina', 'asc');

      logger.info(`Disciplinas do histórico encontradas: ${disciplinas.length}`, 'HistoricoEscolarModel');
      return disciplinas;
    } catch (error) {
      logger.error(`Erro ao buscar disciplinas do histórico ${historico_escolar_id}:`, 'HistoricoEscolarModel', error);
      throw error;
    }
  }

  static async atualizarEstatisticas(historico_escolar_id: string, estatisticas: { total_disciplinas_cursadas: number, disciplinas_aprovadas: number, disciplinas_reprovadas: number, media_geral_anual?: number }): Promise<HistoricoEscolar | null> {
    try {
      logger.info(`Model: Atualizando estatísticas do histórico: ${historico_escolar_id}`, 'HistoricoEscolarModel', estatisticas);

      const [historico] = await knex('historico_escolar')
        .where('historico_escolar_id', historico_escolar_id)
        .update({
          total_disciplinas_cursadas: estatisticas.total_disciplinas_cursadas,
          disciplinas_aprovadas: estatisticas.disciplinas_aprovadas,
          disciplinas_reprovadas: estatisticas.disciplinas_reprovadas,
          media_geral_anual: estatisticas.media_geral_anual,
          updated_at: knex.fn.now()
        })
        .returning('*');

      if (historico) {
        logger.info('Estatísticas do histórico atualizadas com sucesso', 'HistoricoEscolarModel', { 
          historico_escolar_id,
          total_disciplinas: estatisticas.total_disciplinas_cursadas 
        });
      } else {
        logger.warning(`Histórico não encontrado para atualização de estatísticas: ${historico_escolar_id}`, 'HistoricoEscolarModel');
      }

      return historico || null;
    } catch (error) {
      logger.error(`Erro ao atualizar estatísticas do histórico ${historico_escolar_id}:`, 'HistoricoEscolarModel', error);
      throw error;
    }
  }
}
