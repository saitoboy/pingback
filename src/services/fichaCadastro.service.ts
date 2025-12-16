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

      // 1. Criar certidão de nascimento primeiro
      logger.info('📄 Criando certidão de nascimento...', 'ficha-cadastro');
      const certidao = await CertidaoModel.criar(fichaCadastro.certidao);
      logger.success(`✅ Certidão criada: ${certidao.certidao_id}`, 'ficha-cadastro');

      // 2. Criar aluno vinculando à certidão
      logger.info('👤 Criando aluno...', 'ficha-cadastro');
      const dadosAluno = {
        ...fichaCadastro.aluno,
        certidao_id: certidao.certidao_id
      };
      const aluno = await AlunoModel.criar(dadosAluno);
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
        certidao,
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

      // 3. Buscar certidão do aluno
      const certidao = await CertidaoModel.buscarPorId(aluno.certidao_id);
      if (!certidao) {
        logger.error(`❌ Certidão não encontrada para aluno: ${aluno.aluno_id}`, 'ficha-cadastro');
        throw new Error('Dados inconsistentes: certidão não encontrada');
      }

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
        certidao,
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

    // Validar certidão
    if (!fichaCadastro.certidao?.livro_certidao?.trim()) {
      erros.push('Livro da certidão é obrigatório');
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
