import connection from '../connection';
import logger from '../utils/logger';
import { FichaCadastroCompleta, FichaCadastroResposta } from '../types/models';
import * as AlunoModel from '../model/aluno.model';
import * as CertidaoModel from '../model/certidao.model';
import * as ResponsavelModel from '../model/responsavel.model';
import * as DadosSaudeModel from '../model/dadosSaude.model';
import * as DiagnosticoModel from '../model/diagnostico.model';
import MatriculaAlunoModel from '../model/matriculaAluno.model';

class FichaCadastroService {

  /**
   * Processa uma ficha de cadastro completa
   * Cria aluno, certidão, responsáveis, dados de saúde, diagnóstico e matrícula
   * Tudo em uma única transação
   */
  static async processarFichaCadastro(fichaCadastro: FichaCadastroCompleta): Promise<FichaCadastroResposta> {
    const trx = await connection.transaction();
    
    try {
      logger.info('🚀 Iniciando processamento de ficha cadastro completa', 'ficha-cadastro');

      // 1. Criar certidão de nascimento (opcional)
      let certidao: import('../types/models').CertidaoNascimento | undefined;
      const temCertidao = fichaCadastro.certidao?.livro_certidao?.trim();
      if (temCertidao) {
        logger.info('📄 Criando certidão de nascimento...', 'ficha-cadastro');
        certidao = await CertidaoModel.criar(fichaCadastro.certidao!);
        logger.success(`✅ Certidão criada: ${certidao.certidao_id}`, 'ficha-cadastro');
      } else {
        logger.info('📄 Certidão não informada — campo opcional ignorado', 'ficha-cadastro');
      }

      // 2. Criar aluno (vincula certidão apenas se existir)
      logger.info('👤 Criando aluno...', 'ficha-cadastro');
      const nullIfEmpty = (v?: string) => (v && v.trim() !== '' ? v.trim() : null);
      const dadosAluno = {
        nome_aluno: fichaCadastro.aluno.nome_aluno,
        sobrenome_aluno: fichaCadastro.aluno.sobrenome_aluno,
        data_nascimento_aluno: fichaCadastro.aluno.data_nascimento_aluno,
        cpf_aluno: fichaCadastro.aluno.cpf_aluno,
        rg_aluno: nullIfEmpty(fichaCadastro.aluno.rg_aluno) ?? '',
        naturalidade_aluno: nullIfEmpty(fichaCadastro.aluno.naturalidade_aluno) ?? '',
        endereco_aluno: nullIfEmpty(fichaCadastro.aluno.endereco_aluno) ?? '',
        bairro_aluno: nullIfEmpty(fichaCadastro.aluno.bairro_aluno) ?? '',
        cep_aluno: nullIfEmpty(fichaCadastro.aluno.cep_aluno) ?? '',
        religiao_id: nullIfEmpty(fichaCadastro.aluno.religiao_id) ?? undefined,
        foto_aluno: nullIfEmpty(fichaCadastro.aluno.foto_aluno) ?? undefined,
        ...(certidao ? { certidao_id: certidao.certidao_id } : {})
      };
      const aluno = await AlunoModel.criar(dadosAluno as any);
      logger.success(`✅ Aluno criado: ${aluno.aluno_id}`, 'ficha-cadastro');

      // 3. Criar responsáveis vinculados ao aluno
      logger.info('👥 Criando responsáveis...', 'ficha-cadastro');
      const responsaveis = [];
      for (const responsavelData of fichaCadastro.responsaveis) {
        const dadosResponsavel = {
          ...responsavelData,
          aluno_id: aluno.aluno_id
        };
        const responsavel = await ResponsavelModel.criar(dadosResponsavel);
        responsaveis.push(responsavel);
        logger.success(`✅ Responsável criado: ${responsavel.responsavel_id}`, 'ficha-cadastro');
      }

      // 4. Criar dados de saúde vinculados ao aluno
      logger.info('🏥 Criando dados de saúde...', 'ficha-cadastro');
      const dadosSaudeData = {
        aluno_id: aluno.aluno_id,
        necessidades_especiais: fichaCadastro.dados_saude.necessidades_especiais || '',
        vacinas_em_dia: fichaCadastro.dados_saude.vacinas_em_dia,
        dorme_bem: fichaCadastro.dados_saude.dorme_bem,
        alimenta_se_bem: fichaCadastro.dados_saude.alimenta_se_bem,
        uso_sanitario_sozinho: fichaCadastro.dados_saude.uso_sanitario_sozinho,
        restricao_alimentar: fichaCadastro.dados_saude.restricao_alimentar || '',
        problema_saude: fichaCadastro.dados_saude.problema_saude || '',
        alergia_medicamento: fichaCadastro.dados_saude.alergia_medicamento || '',
        uso_continuo_medicamento: fichaCadastro.dados_saude.uso_continuo_medicamento || '',
        alergias: fichaCadastro.dados_saude.alergias || '',
        medicacao_febre: fichaCadastro.dados_saude.medicacao_febre || '',
        medicacao_dor_cabeca: fichaCadastro.dados_saude.medicacao_dor_cabeca || '',
        medicacao_dor_barriga: fichaCadastro.dados_saude.medicacao_dor_barriga || '',
        historico_convulsao: fichaCadastro.dados_saude.historico_convulsao,
        perda_esfincter_emocional: fichaCadastro.dados_saude.perda_esfincter_emocional,
        frequentou_outra_escola: fichaCadastro.dados_saude.frequentou_outra_escola,
        tipo_parto: fichaCadastro.dados_saude.tipo_parto || '',
        gravidez_tranquila: fichaCadastro.dados_saude.gravidez_tranquila,
        medicacao_gravidez: fichaCadastro.dados_saude.medicacao_gravidez || '',
        tem_irmaos: fichaCadastro.dados_saude.tem_irmaos,
        fonoaudiologico: fichaCadastro.dados_saude.fonoaudiologico,
        psicopedagogico: fichaCadastro.dados_saude.psicopedagogico,
        neurologico: fichaCadastro.dados_saude.neurologico,
        outro_tratamento: fichaCadastro.dados_saude.outro_tratamento || '',
        motivo_tratamento: fichaCadastro.dados_saude.motivo_tratamento || '',
        observacoes: fichaCadastro.dados_saude.observacoes || ''
      };
      const dadosSaude = await DadosSaudeModel.criar(dadosSaudeData);
      logger.success(`✅ Dados de saúde criados: ${dadosSaude.dados_saude_id}`, 'ficha-cadastro');

      // 5. Criar diagnóstico vinculado ao aluno
      logger.info('🔬 Criando diagnóstico...', 'ficha-cadastro');
      const diagnosticoData = {
        aluno_id: aluno.aluno_id,
        cegueira: fichaCadastro.diagnostico.cegueira,
        baixa_visao: fichaCadastro.diagnostico.baixa_visao,
        surdez: fichaCadastro.diagnostico.surdez,
        deficiencia_auditiva: fichaCadastro.diagnostico.deficiencia_auditiva,
        surdocegueira: fichaCadastro.diagnostico.surdocegueira,
        deficiencia_fisica: fichaCadastro.diagnostico.deficiencia_fisica,
        deficiencia_multipla: fichaCadastro.diagnostico.deficiencia_multipla,
        deficiencia_intelectual: fichaCadastro.diagnostico.deficiencia_intelectual,
        sindrome_down: fichaCadastro.diagnostico.sindrome_down,
        altas_habilidades: fichaCadastro.diagnostico.altas_habilidades,
        tea: fichaCadastro.diagnostico.tea,
        alteracoes_processamento_auditivo: fichaCadastro.diagnostico.alteracoes_processamento_auditivo,
        tdah: fichaCadastro.diagnostico.tdah,
        outros_diagnosticos: fichaCadastro.diagnostico.outros_diagnosticos || ''
      };
      const diagnostico = await DiagnosticoModel.criar(diagnosticoData);
      logger.success(`✅ Diagnóstico criado: ${diagnostico.diagnostico_id}`, 'ficha-cadastro');

      // 6. Criar matrícula (que vai gerar o RA automaticamente)
      logger.info('📋 Criando matrícula e gerando RA...', 'ficha-cadastro');
      const matriculaData = {
        ...fichaCadastro.matricula,
        aluno_id: aluno.aluno_id,
        status: 'ativo' as const
      };
      const matricula = await MatriculaAlunoModel.criarMatricula(matriculaData);
      logger.success(`✅ Matrícula criada: ${matricula.matricula_aluno_id} | RA: ${matricula.ra}`, 'ficha-cadastro');

      // Commit da transação
      await trx.commit();

      const resposta: FichaCadastroResposta = {
        aluno,
        ...(certidao ? { certidao } : {}),
        responsaveis,
        dados_saude: dadosSaude,
        diagnostico,
        matricula,
        ra_gerado: matricula.ra
      };

      logger.success(`🎉 Ficha cadastro processada com sucesso! RA gerado: ${matricula.ra}`, 'ficha-cadastro');
      return resposta;

    } catch (error) {
      // Rollback em caso de erro
      await trx.rollback();
      logger.error('❌ Erro ao processar ficha cadastro - rollback realizado', 'ficha-cadastro', error);
      
      if (error instanceof Error) {
        throw new Error(`Erro ao processar ficha cadastro: ${error.message}`);
      }
      throw new Error('Erro interno ao processar ficha cadastro');
    }
  }

  /**
   * Processa várias fichas de cadastro em lote.
   * Cada ficha roda em sua própria transação (sucesso parcial):
   * uma falha não derruba as demais.
   */
  static async processarFichasEmLote(fichas: FichaCadastroCompleta[]): Promise<{
    criados: { indice: number; nome: string; aluno_id: string; ra: string }[];
    falhas: { indice: number; nome: string; motivo: string }[];
  }> {
    const criados: { indice: number; nome: string; aluno_id: string; ra: string }[] = [];
    const falhas: { indice: number; nome: string; motivo: string }[] = [];

    for (let i = 0; i < fichas.length; i++) {
      const ficha = fichas[i];
      const nome = `${ficha.aluno?.nome_aluno ?? ''} ${ficha.aluno?.sobrenome_aluno ?? ''}`.trim();

      // Validação por item antes de tocar o banco
      const erros = this.validarFichaCadastro(ficha);
      if (erros.length > 0) {
        falhas.push({ indice: i, nome, motivo: erros.join('; ') });
        continue;
      }

      try {
        const resultado = await this.processarFichaCadastro(ficha);
        criados.push({ indice: i, nome, aluno_id: resultado.aluno.aluno_id, ra: resultado.ra_gerado });
      } catch (error) {
        const motivo = error instanceof Error ? error.message : 'Erro desconhecido';
        falhas.push({ indice: i, nome, motivo });
        logger.warning(`⚠️ Falha na ficha índice ${i} (${nome}): ${motivo}`, 'ficha-cadastro');
      }
    }

    logger.success(`📦 Lote de fichas processado: ${criados.length} criada(s), ${falhas.length} falha(s)`, 'ficha-cadastro');
    return { criados, falhas };
  }

  /**
   * Processa alunos em lote com turma e ano letivo pré-definidos.
   * Cria: aluno, dados_saude (defaults), diagnostico (defaults) e matrícula.
   * Sem responsáveis/certidão — podem ser completados depois.
   * Cada aluno roda em transação própria (falha parcial não cancela os demais).
   */
  static async processarFichasSimplificadasEmLote(
    turma_id: string,
    ano_letivo_id: string,
    alunos: Array<{
      nome_aluno: string;
      sobrenome_aluno: string;
      data_nascimento_aluno: Date;
      cpf_aluno: string;
      rg_aluno: string;
      naturalidade_aluno: string;
      endereco_aluno: string;
      bairro_aluno: string;
      cep_aluno: string;
    }>
  ): Promise<{
    criados: { indice: number; nome: string; aluno_id: string; ra: string }[];
    falhas: { indice: number; nome: string; motivo: string }[];
  }> {
    const criados: { indice: number; nome: string; aluno_id: string; ra: string }[] = [];
    const falhas: { indice: number; nome: string; motivo: string }[] = [];

    for (let i = 0; i < alunos.length; i++) {
      const dadosAluno = alunos[i];
      const nome = `${dadosAluno.nome_aluno} ${dadosAluno.sobrenome_aluno}`.trim();
      const trx = await connection.transaction();

      try {
        // 1. Criar aluno
        const aluno = await AlunoModel.criar(dadosAluno as any);

        // 2. Dados de saúde com defaults
        await DadosSaudeModel.criar({
          aluno_id: aluno.aluno_id,
          necessidades_especiais: '',
          vacinas_em_dia: false,
          dorme_bem: false,
          alimenta_se_bem: false,
          uso_sanitario_sozinho: false,
          restricao_alimentar: '',
          problema_saude: '',
          alergia_medicamento: '',
          uso_continuo_medicamento: '',
          alergias: '',
          medicacao_febre: '',
          medicacao_dor_cabeca: '',
          medicacao_dor_barriga: '',
          historico_convulsao: false,
          perda_esfincter_emocional: false,
          frequentou_outra_escola: false,
          tipo_parto: '',
          gravidez_tranquila: false,
          medicacao_gravidez: '',
          tem_irmaos: false,
          fonoaudiologico: false,
          psicopedagogico: false,
          neurologico: false,
          outro_tratamento: '',
          motivo_tratamento: '',
          observacoes: ''
        });

        // 3. Diagnóstico com defaults
        await DiagnosticoModel.criar({
          aluno_id: aluno.aluno_id,
          cegueira: false,
          baixa_visao: false,
          surdez: false,
          deficiencia_auditiva: false,
          surdocegueira: false,
          deficiencia_fisica: false,
          deficiencia_multipla: false,
          deficiencia_intelectual: false,
          sindrome_down: false,
          altas_habilidades: false,
          tea: false,
          alteracoes_processamento_auditivo: false,
          tdah: false,
          outros_diagnosticos: ''
        });

        // 4. Matrícula
        const matricula = await MatriculaAlunoModel.criarMatricula({
          aluno_id: aluno.aluno_id,
          turma_id,
          ano_letivo_id,
          data_matricula: new Date()
        });

        await trx.commit();
        criados.push({ indice: i, nome, aluno_id: aluno.aluno_id, ra: matricula.ra });
        logger.success(`✅ [${i}] ${nome} — RA: ${matricula.ra}`, 'ficha-cadastro-lote');

      } catch (error) {
        await trx.rollback();
        const motivo = error instanceof Error ? error.message : 'Erro desconhecido';
        falhas.push({ indice: i, nome, motivo });
        logger.warning(`⚠️ [${i}] ${nome}: ${motivo}`, 'ficha-cadastro-lote');
      }
    }

    logger.success(`📦 Lote simplificado: ${criados.length} criado(s), ${falhas.length} falha(s)`, 'ficha-cadastro-lote');
    return { criados, falhas };
  }

  /**
   * Busca uma ficha cadastro completa por RA
   * Retorna todos os dados relacionados: aluno, certidão, responsáveis, saúde, diagnóstico e matrícula
   */
  static async buscarFichaPorRA(ra: string): Promise<FichaCadastroResposta | null> {
    try {
      logger.info(`🔍 Buscando ficha cadastro por RA: ${ra}`, 'ficha-cadastro');

      // 1. Buscar matrícula pelo RA
      const matricula = await MatriculaAlunoModel.buscarMatriculaPorRA(ra);
      if (!matricula) {
        logger.warning(`⚠️ Matrícula não encontrada para RA: ${ra}`, 'ficha-cadastro');
        return null;
      }

      // 2. Buscar aluno pela matrícula
      const aluno = await AlunoModel.buscarPorId(matricula.aluno_id);
      if (!aluno) {
        logger.error(`❌ Aluno não encontrado para matrícula: ${matricula.matricula_aluno_id}`, 'ficha-cadastro');
        throw new Error('Dados inconsistentes: aluno não encontrado');
      }

      // 3. Buscar certidão do aluno (opcional)
      const certidao = aluno.certidao_id
        ? await CertidaoModel.buscarPorId(aluno.certidao_id)
        : undefined;

      // 4. Buscar responsáveis do aluno
      const responsaveis = await ResponsavelModel.listarPorAluno(aluno.aluno_id);

      // 5. Buscar dados de saúde do aluno
      const dadosSaude = await DadosSaudeModel.buscarPorAlunoId(aluno.aluno_id);
      if (!dadosSaude) {
        logger.error(`❌ Dados de saúde não encontrados para aluno: ${aluno.aluno_id}`, 'ficha-cadastro');
        throw new Error('Dados inconsistentes: dados de saúde não encontrados');
      }

      // 6. Buscar diagnóstico do aluno
      const diagnostico = await DiagnosticoModel.buscarPorAlunoId(aluno.aluno_id);
      if (!diagnostico) {
        logger.error(`❌ Diagnóstico não encontrado para aluno: ${aluno.aluno_id}`, 'ficha-cadastro');
        throw new Error('Dados inconsistentes: diagnóstico não encontrado');
      }

      const fichaCadastro: FichaCadastroResposta = {
        aluno,
        ...(certidao ? { certidao } : {}),
        responsaveis,
        dados_saude: dadosSaude,
        diagnostico,
        matricula,
        ra_gerado: matricula.ra
      };

      logger.success(`✅ Ficha cadastro encontrada para RA: ${ra}`, 'ficha-cadastro');
      return fichaCadastro;

    } catch (error) {
      logger.error(`❌ Erro ao buscar ficha cadastro por RA: ${ra}`, 'ficha-cadastro', error);
      
      if (error instanceof Error) {
        throw new Error(`Erro ao buscar ficha cadastro: ${error.message}`);
      }
      throw new Error('Erro interno ao buscar ficha cadastro');
    }
  }

  /**
   * Lista todas as fichas de cadastro
   * Retorna uma lista resumida com informações principais de cada ficha
   */
  static async listarTodasFichas(): Promise<FichaCadastroResposta[]> {
    try {
      logger.info('🔍 Listando todas as fichas de cadastro', 'ficha-cadastro');

      // Buscar todas as matrículas
      const matriculas = await MatriculaAlunoModel.listarMatriculas();
      
      if (matriculas.length === 0) {
        logger.info('⚠️ Nenhuma matrícula encontrada', 'ficha-cadastro');
        return [];
      }

      logger.info(`📋 Encontradas ${matriculas.length} matrículas, buscando fichas completas...`, 'ficha-cadastro');

      // Para cada matrícula, buscar a ficha completa
      const fichas: FichaCadastroResposta[] = [];
      
      for (const matricula of matriculas) {
        try {
          // Usar o método existente para buscar por RA
          const ficha = await this.buscarFichaPorRA(matricula.ra);
          if (ficha) {
            fichas.push(ficha);
          }
        } catch (error) {
          // Se houver erro ao buscar uma ficha específica, logar mas continuar
          logger.warning(`⚠️ Erro ao buscar ficha para RA ${matricula.ra}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, 'ficha-cadastro');
        }
      }

      logger.success(`✅ ${fichas.length} fichas de cadastro listadas com sucesso`, 'ficha-cadastro');
      return fichas;

    } catch (error) {
      logger.error('❌ Erro ao listar fichas de cadastro', 'ficha-cadastro', error);
      
      if (error instanceof Error) {
        throw new Error(`Erro ao listar fichas de cadastro: ${error.message}`);
      }
      throw new Error('Erro interno ao listar fichas de cadastro');
    }
  }

  /**
   * Validações básicas da ficha antes do processamento
   */
  static validarFichaCadastro(fichaCadastro: FichaCadastroCompleta): string[] {
    const erros: string[] = [];

    // Validar aluno
    if (!fichaCadastro.aluno?.nome_aluno?.trim()) {
      erros.push('Nome do aluno é obrigatório');
    }
    if (!fichaCadastro.aluno?.sobrenome_aluno?.trim()) {
      erros.push('Sobrenome do aluno é obrigatório');
    }
    if (!fichaCadastro.aluno?.cpf_aluno?.trim()) {
      erros.push('CPF do aluno é obrigatório');
    }

    // Validar responsáveis
    if (!fichaCadastro.responsaveis || fichaCadastro.responsaveis.length === 0) {
      erros.push('Pelo menos um responsável é obrigatório');
    }

    // Validar matrícula
    if (!fichaCadastro.matricula?.turma_id?.trim()) {
      erros.push('Turma é obrigatória');
    }
    if (!fichaCadastro.matricula?.ano_letivo_id?.trim()) {
      erros.push('Ano letivo é obrigatório');
    }

    return erros;
  }
}

export default FichaCadastroService;
