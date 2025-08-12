import { HistoricoEscolarModel } from '../model/historicoEscolar.model';
import { HistoricoEscolar, HistoricoEscolarDisciplina } from '../types/models';
import { BoletimService } from './boletim.service';
import logger from '../utils/logger';

export class HistoricoEscolarService {

  // ================ CRUD BÁSICO ================

  static async listarTodos(): Promise<HistoricoEscolar[]> {
    try {
      logger.info('Service: Listando todos os históricos escolares', 'HistoricoEscolarService');
      
      const historicos = await HistoricoEscolarModel.listarTodos();
      
      logger.success(`Históricos escolares listados: ${historicos.length}`, 'HistoricoEscolarService');
      return historicos;
    } catch (error) {
      logger.error('Erro no service ao listar históricos escolares:', 'HistoricoEscolarService', error);
      throw error;
    }
  }

  static async buscarPorId(historico_escolar_id: string): Promise<HistoricoEscolar | null> {
    try {
      logger.info(`Service: Buscando histórico escolar por ID: ${historico_escolar_id}`, 'HistoricoEscolarService');
      
      if (!historico_escolar_id) {
        throw new Error('ID do histórico escolar é obrigatório');
      }

      const historico = await HistoricoEscolarModel.buscarPorId(historico_escolar_id);
      
      if (historico) {
        logger.success('Histórico escolar encontrado', 'HistoricoEscolarService', { 
          historico_escolar_id,
          situacao_final: historico.situacao_final 
        });
      } else {
        logger.warning(`Histórico escolar não encontrado: ${historico_escolar_id}`, 'HistoricoEscolarService');
      }

      return historico;
    } catch (error) {
      logger.error(`Erro no service ao buscar histórico escolar por ID:`, 'HistoricoEscolarService', error);
      throw error;
    }
  }

  static async buscarPorMatricula(matricula_aluno_id: string): Promise<HistoricoEscolar[]> {
    try {
      logger.info(`Service: Buscando históricos por matrícula: ${matricula_aluno_id}`, 'HistoricoEscolarService');

      if (!matricula_aluno_id) {
        throw new Error('ID da matrícula é obrigatório');
      }

      const historicos = await HistoricoEscolarModel.buscarPorMatricula(matricula_aluno_id);
      
      logger.success(`Históricos encontrados para matrícula: ${historicos.length}`, 'HistoricoEscolarService');
      return historicos;
    } catch (error) {
      logger.error('Erro no service ao buscar históricos por matrícula:', 'HistoricoEscolarService', error);
      throw error;
    }
  }

  static async buscarPorMatriculaEAno(matricula_aluno_id: string, ano_letivo_id: string): Promise<HistoricoEscolar | null> {
    try {
      logger.info(`Service: Buscando histórico por matrícula e ano: ${matricula_aluno_id}, ${ano_letivo_id}`, 'HistoricoEscolarService');

      if (!matricula_aluno_id || !ano_letivo_id) {
        throw new Error('ID da matrícula e ano letivo são obrigatórios');
      }

      const historico = await HistoricoEscolarModel.buscarPorMatriculaEAno(matricula_aluno_id, ano_letivo_id);
      
      if (historico) {
        logger.success('Histórico encontrado por matrícula e ano', 'HistoricoEscolarService', { 
          historico_escolar_id: historico.historico_escolar_id,
          situacao_final: historico.situacao_final 
        });
      } else {
        logger.info(`Histórico não encontrado para matrícula ${matricula_aluno_id} e ano ${ano_letivo_id}`, 'HistoricoEscolarService');
      }

      return historico;
    } catch (error) {
      logger.error('Erro no service ao buscar histórico por matrícula e ano:', 'HistoricoEscolarService', error);
      throw error;
    }
  }

  static async buscarPorAnoLetivo(ano_letivo_id: string): Promise<HistoricoEscolar[]> {
    try {
      logger.info(`Service: Buscando históricos por ano letivo: ${ano_letivo_id}`, 'HistoricoEscolarService');

      if (!ano_letivo_id) {
        throw new Error('ID do ano letivo é obrigatório');
      }

      const historicos = await HistoricoEscolarModel.buscarPorAnoLetivo(ano_letivo_id);
      
      logger.success(`Históricos encontrados para ano letivo: ${historicos.length}`, 'HistoricoEscolarService');
      return historicos;
    } catch (error) {
      logger.error('Erro no service ao buscar históricos por ano letivo:', 'HistoricoEscolarService', error);
      throw error;
    }
  }

  static async criar(dadosHistorico: Omit<HistoricoEscolar, 'historico_escolar_id' | 'created_at' | 'updated_at'>): Promise<HistoricoEscolar> {
    try {
      logger.info('Service: Criando histórico escolar', 'HistoricoEscolarService', {
        matricula_aluno_id: dadosHistorico.matricula_aluno_id,
        ano_letivo_id: dadosHistorico.ano_letivo_id,
        situacao_final: dadosHistorico.situacao_final
      });

      // Validações básicas
      if (!dadosHistorico.matricula_aluno_id || !dadosHistorico.ano_letivo_id) {
        throw new Error('ID da matrícula e ano letivo são obrigatórios');
      }

      // Verificar se já existe um histórico para esta matrícula/ano
      const unicidade = await HistoricoEscolarModel.validarUnicidade(
        dadosHistorico.matricula_aluno_id, 
        dadosHistorico.ano_letivo_id
      );

      if (!unicidade) {
        throw new Error('Já existe um histórico escolar para esta matrícula e ano letivo');
      }

      const historico = await HistoricoEscolarModel.criar(dadosHistorico);
      
      logger.success('Histórico escolar criado com sucesso', 'HistoricoEscolarService', { 
        historico_escolar_id: historico.historico_escolar_id,
        situacao_final: historico.situacao_final 
      });

      return historico;
    } catch (error) {
      logger.error('Erro no service ao criar histórico escolar:', 'HistoricoEscolarService', error);
      throw error;
    }
  }

  static async atualizar(historico_escolar_id: string, dadosAtualizacao: Partial<Omit<HistoricoEscolar, 'historico_escolar_id' | 'created_at' | 'updated_at'>>): Promise<HistoricoEscolar | null> {
    try {
      logger.info(`Service: Atualizando histórico escolar: ${historico_escolar_id}`, 'HistoricoEscolarService', dadosAtualizacao);

      if (!historico_escolar_id) {
        throw new Error('ID do histórico escolar é obrigatório');
      }

      // Se estiver atualizando matrícula ou ano, verificar unicidade
      if (dadosAtualizacao.matricula_aluno_id || dadosAtualizacao.ano_letivo_id) {
        const historicoAtual = await HistoricoEscolarModel.buscarPorId(historico_escolar_id);
        if (!historicoAtual) {
          throw new Error('Histórico escolar não encontrado');
        }

        const matriculaId = dadosAtualizacao.matricula_aluno_id || historicoAtual.matricula_aluno_id;
        const anoLetivoId = dadosAtualizacao.ano_letivo_id || historicoAtual.ano_letivo_id;

        const unicidade = await HistoricoEscolarModel.validarUnicidade(
          matriculaId, 
          anoLetivoId, 
          historico_escolar_id
        );

        if (!unicidade) {
          throw new Error('Já existe um histórico escolar para esta matrícula e ano letivo');
        }
      }

      const historico = await HistoricoEscolarModel.atualizar(historico_escolar_id, dadosAtualizacao);
      
      if (historico) {
        logger.success('Histórico escolar atualizado com sucesso', 'HistoricoEscolarService', { 
          historico_escolar_id,
          situacao_final: historico.situacao_final 
        });
      } else {
        logger.warning(`Histórico escolar não encontrado para atualização: ${historico_escolar_id}`, 'HistoricoEscolarService');
      }

      return historico;
    } catch (error) {
      logger.error('Erro no service ao atualizar histórico escolar:', 'HistoricoEscolarService', error);
      throw error;
    }
  }

  static async excluir(historico_escolar_id: string): Promise<boolean> {
    try {
      logger.info(`Service: Excluindo histórico escolar: ${historico_escolar_id}`, 'HistoricoEscolarService');

      if (!historico_escolar_id) {
        throw new Error('ID do histórico escolar é obrigatório');
      }

      const sucesso = await HistoricoEscolarModel.excluir(historico_escolar_id);
      
      if (sucesso) {
        logger.success('Histórico escolar excluído com sucesso', 'HistoricoEscolarService', { historico_escolar_id });
      } else {
        logger.warning(`Histórico escolar não encontrado para exclusão: ${historico_escolar_id}`, 'HistoricoEscolarService');
      }

      return sucesso;
    } catch (error) {
      logger.error('Erro no service ao excluir histórico escolar:', 'HistoricoEscolarService', error);
      throw error;
    }
  }

  static async buscarCompleto(historico_escolar_id: string): Promise<any | null> {
    try {
      logger.info(`Service: Buscando histórico completo: ${historico_escolar_id}`, 'HistoricoEscolarService');

      if (!historico_escolar_id) {
        throw new Error('ID do histórico escolar é obrigatório');
      }

      const historicoCompleto = await HistoricoEscolarModel.buscarCompleto(historico_escolar_id);
      
      if (historicoCompleto) {
        // Buscar disciplinas do histórico
        const disciplinas = await HistoricoEscolarModel.buscarDisciplinasHistorico(historico_escolar_id);
        
        // Adicionar disciplinas ao resultado
        historicoCompleto.disciplinas = disciplinas;
        
        logger.success('Histórico completo encontrado', 'HistoricoEscolarService', { 
          historico_escolar_id,
          total_disciplinas: disciplinas.length 
        });
      } else {
        logger.warning(`Histórico completo não encontrado: ${historico_escolar_id}`, 'HistoricoEscolarService');
      }

      return historicoCompleto;
    } catch (error) {
      logger.error('Erro no service ao buscar histórico completo:', 'HistoricoEscolarService', error);
      throw error;
    }
  }

  // ================ GERAÇÃO AUTOMÁTICA USANDO BOLETIMSERVICE ================

  static async gerarAutomatico(matricula_aluno_id: string, ano_letivo_id: string): Promise<any> {
    try {
      logger.info('Service: Gerando histórico escolar automático usando BoletimService', 'HistoricoEscolarService', {
        matricula_aluno_id,
        ano_letivo_id
      });

      if (!matricula_aluno_id || !ano_letivo_id) {
        throw new Error('ID da matrícula e ano letivo são obrigatórios');
      }

      // Verificar se já existe um histórico para esta matrícula/ano
      const historicoExistente = await HistoricoEscolarModel.buscarPorMatriculaEAno(matricula_aluno_id, ano_letivo_id);
      if (historicoExistente) {
        throw new Error('Já existe um histórico escolar para esta matrícula e ano letivo');
      }

      // 1. USAR BoletimService para buscar todos os boletins do aluno
      logger.info('Buscando boletins através do BoletimService', 'HistoricoEscolarService');
      const todosBoletins = await BoletimService.buscarPorMatricula(matricula_aluno_id);
      
      // Filtrar boletins do ano letivo específico
      const boletins = todosBoletins.filter((boletim: any) => boletim.ano_letivo_id === ano_letivo_id);
      
      if (!boletins || boletins.length === 0) {
        throw new Error('Nenhum boletim encontrado para esta matrícula e ano letivo');
      }

      // 2. Consolidar dados de todas as disciplinas dos boletins
      logger.info(`Processando ${boletins.length} boletins`, 'HistoricoEscolarService');
      const disciplinasConsolidadas = await this.consolidarDisciplinasDosBoleins(boletins);

      // 3. Calcular estatísticas gerais
      const estatisticasGerais = this.calcularEstatisticasGerais(disciplinasConsolidadas);

      // 4. Criar o histórico escolar principal
      const dadosHistorico = {
        matricula_aluno_id,
        ano_letivo_id,
        situacao_final: estatisticasGerais.situacao_final,
        media_geral_anual: estatisticasGerais.media_geral,
        total_disciplinas_cursadas: estatisticasGerais.total_disciplinas,
        disciplinas_aprovadas: estatisticasGerais.disciplinas_aprovadas,
        disciplinas_reprovadas: estatisticasGerais.disciplinas_reprovadas,
        observacoes_finais: 'Histórico gerado automaticamente baseado nos boletins bimestrais',
        data_conclusao: estatisticasGerais.situacao_final !== 'em_andamento' ? new Date() : undefined
      };

      const historico = await HistoricoEscolarModel.criar(dadosHistorico);

      // 5. Criar as disciplinas do histórico
      const disciplinasHistorico = await this.criarDisciplinasHistorico(historico.historico_escolar_id, disciplinasConsolidadas);

      // 6. Atualizar estatísticas no histórico principal
      await HistoricoEscolarModel.atualizarEstatisticas(historico.historico_escolar_id, estatisticasGerais);

      const resultado = {
        historico_escolar: historico,
        disciplinas: disciplinasHistorico,
        estatisticas: estatisticasGerais,
        boletins_utilizados: boletins.length
      };

      logger.success('Histórico escolar gerado automaticamente com sucesso', 'HistoricoEscolarService', { 
        historico_escolar_id: historico.historico_escolar_id,
        total_disciplinas: disciplinasConsolidadas.length,
        situacao_final: estatisticasGerais.situacao_final 
      });

      return resultado;
    } catch (error) {
      logger.error('Erro no service ao gerar histórico automático:', 'HistoricoEscolarService', error);
      throw error;
    }
  }

  // ================ MÉTODOS PRIVADOS DE CONSOLIDAÇÃO ================

  private static async consolidarDisciplinasDosBoleins(boletins: any[]): Promise<any[]> {
    try {
      logger.info('Consolidando disciplinas dos boletins', 'HistoricoEscolarService');

      const disciplinasPorTDP = new Map(); // Agrupado por turma_disciplina_professor_id

      // Para cada boletim, buscar suas disciplinas
      for (const boletim of boletins) {
        logger.info(`Processando boletim ${boletim.boletim_id}`, 'HistoricoEscolarService');
        
        // Usar BoletimService para buscar disciplinas do boletim
        const disciplinasDoBoletim = await BoletimService.listarDisciplinasBoletim(boletim.boletim_id);
        
        // Consolidar por turma_disciplina_professor_id
        for (const disciplina of disciplinasDoBoletim) {
          const key = disciplina.turma_disciplina_professor_id;
          
          if (!disciplinasPorTDP.has(key)) {
            disciplinasPorTDP.set(key, {
              turma_disciplina_professor_id: key,
              medias_bimestrais: [],
              faltas_bimestrais: [],
              observacoes: [],
              disciplina_info: {
                turma_disciplina_professor_id: disciplina.turma_disciplina_professor_id
              } // Info básica da disciplina
            });
          }
          
          const disciplinaConsolidada = disciplinasPorTDP.get(key);
          disciplinaConsolidada.medias_bimestrais.push(disciplina.media_bimestre);
          disciplinaConsolidada.faltas_bimestrais.push(disciplina.faltas_bimestre);
          
          if (disciplina.observacoes_disciplina) {
            disciplinaConsolidada.observacoes.push(disciplina.observacoes_disciplina);
          }
        }
      }

      // Calcular médias finais e totais
      const disciplinasConsolidadas = Array.from(disciplinasPorTDP.values()).map(disciplina => {
        const mediaFinal = disciplina.medias_bimestrais.reduce((sum: number, media: number) => sum + media, 0) / disciplina.medias_bimestrais.length;
        const totalFaltas = disciplina.faltas_bimestrais.reduce((sum: number, faltas: number) => sum + faltas, 0);
        
        let situacao: 'aprovado' | 'reprovado' | 'recuperacao' = 'reprovado';
        if (mediaFinal >= 7.0) {
          situacao = 'aprovado';
        } else if (mediaFinal >= 5.0 && mediaFinal < 7.0) {
          situacao = 'recuperacao';
        }

        return {
          turma_disciplina_professor_id: disciplina.turma_disciplina_professor_id,
          media_final_disciplina: Number(mediaFinal.toFixed(2)),
          total_faltas_disciplina: totalFaltas,
          situacao_disciplina: situacao,
          observacoes_disciplina: disciplina.observacoes.join('; '),
          disciplina_info: disciplina.disciplina_info,
          bimestres_cursados: disciplina.medias_bimestrais.length
        };
      });

      logger.info(`Disciplinas consolidadas: ${disciplinasConsolidadas.length}`, 'HistoricoEscolarService');
      return disciplinasConsolidadas;
    } catch (error) {
      logger.error('Erro ao consolidar disciplinas dos boletins:', 'HistoricoEscolarService', error);
      throw error;
    }
  }

  private static calcularEstatisticasGerais(disciplinasConsolidadas: any[]): any {
    const total_disciplinas = disciplinasConsolidadas.length;
    const disciplinas_aprovadas = disciplinasConsolidadas.filter(d => d.situacao_disciplina === 'aprovado').length;
    const disciplinas_reprovadas = disciplinasConsolidadas.filter(d => d.situacao_disciplina === 'reprovado').length;
    const disciplinas_recuperacao = disciplinasConsolidadas.filter(d => d.situacao_disciplina === 'recuperacao').length;
    
    const media_geral = total_disciplinas > 0 ? 
      disciplinasConsolidadas.reduce((sum, d) => sum + d.media_final_disciplina, 0) / total_disciplinas : 0;

    let situacao_final: 'aprovado' | 'reprovado' | 'aprovado_conselho' | 'em_andamento' = 'em_andamento';
    
    if (disciplinas_reprovadas === 0 && disciplinas_recuperacao === 0) {
      situacao_final = 'aprovado';
    } else if (disciplinas_reprovadas > 0 || (disciplinas_reprovadas + disciplinas_recuperacao) > total_disciplinas * 0.25) {
      situacao_final = 'reprovado';
    } else {
      situacao_final = 'aprovado_conselho'; // Aprovado com algumas disciplinas em recuperação
    }

    return {
      total_disciplinas,
      disciplinas_aprovadas,
      disciplinas_reprovadas,
      disciplinas_recuperacao,
      media_geral: Number(media_geral.toFixed(2)),
      situacao_final,
      taxa_aprovacao: Number(((disciplinas_aprovadas / total_disciplinas) * 100).toFixed(2))
    };
  }

  private static async criarDisciplinasHistorico(historico_escolar_id: string, disciplinasConsolidadas: any[]): Promise<HistoricoEscolarDisciplina[]> {
    try {
      logger.info(`Criando disciplinas do histórico: ${disciplinasConsolidadas.length}`, 'HistoricoEscolarService');

      const disciplinasHistorico = [];
      
      for (const disciplina of disciplinasConsolidadas) {
        const dadosDisciplina = {
          historico_escolar_id,
          turma_disciplina_professor_id: disciplina.turma_disciplina_professor_id,
          media_final_disciplina: disciplina.media_final_disciplina,
          total_faltas_disciplina: disciplina.total_faltas_disciplina,
          situacao_disciplina: disciplina.situacao_disciplina,
          observacoes_disciplina: disciplina.observacoes_disciplina || null
        };

        const disciplinaCriada = await HistoricoEscolarModel.criarDisciplina(dadosDisciplina);
        disciplinasHistorico.push(disciplinaCriada);
      }

      logger.success(`Disciplinas do histórico criadas: ${disciplinasHistorico.length}`, 'HistoricoEscolarService');
      return disciplinasHistorico;
    } catch (error) {
      logger.error('Erro ao criar disciplinas do histórico:', 'HistoricoEscolarService', error);
      throw error;
    }
  }
}
