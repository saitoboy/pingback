import { Request, Response } from 'express';
import FichaCadastroService from '../services/fichaCadastro.service';
import logger from '../utils/logger';

class FichaCadastroController {

  /**
   * Processa uma ficha de cadastro completa
   * Recebe todos os dados e cria: aluno, certidão, responsáveis, dados de saúde, diagnóstico e matrícula
   */
  static async processarFichaCadastro(req: Request, res: Response): Promise<void> {
    try {
      const fichaCadastro = req.body;
      
      logger.info('📝 Iniciando processamento de ficha cadastro completa', 'ficha-cadastro');

      // Validações básicas
      const errosValidacao = FichaCadastroService.validarFichaCadastro(fichaCadastro);
      if (errosValidacao.length > 0) {
        logger.warning('⚠️ Erros de validação na ficha cadastro', 'ficha-cadastro', errosValidacao);
        res.status(400).json({
          sucesso: false,
          mensagem: 'Dados inválidos na ficha cadastro',
          erros: errosValidacao
        });
        return;
      }

      // Processar ficha cadastro
      const resultado = await FichaCadastroService.processarFichaCadastro(fichaCadastro);

      logger.success(`🎉 Ficha cadastro processada com sucesso! RA: ${resultado.ra_gerado}`, 'ficha-cadastro');
      
      res.status(201).json({
        sucesso: true,
        mensagem: `Ficha cadastro processada com sucesso! RA gerado: ${resultado.ra_gerado}`,
        dados: resultado
      });
    } catch (error) {
      logger.error('❌ Erro ao processar ficha cadastro', 'ficha-cadastro', error);
      res.status(400).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor ao processar ficha cadastro'
      });
    }
  }

  /**
   * Processa várias fichas de cadastro em lote.
   * Body esperado: { fichas: FichaCadastroCompleta[] }
   * Retorna 201 (todas ok), 207 (parcial) ou 400 (nenhuma criada).
   */
  static async processarFichasEmLote(req: Request, res: Response): Promise<void> {
    try {
      const { fichas } = req.body;

      if (!Array.isArray(fichas) || fichas.length === 0) {
        res.status(400).json({
          sucesso: false,
          mensagem: 'Campo "fichas" deve ser um array não vazio.'
        });
        return;
      }

      if (fichas.length > 100) {
        res.status(400).json({
          sucesso: false,
          mensagem: 'Máximo de 100 fichas por lote.'
        });
        return;
      }

      logger.info(`📦 Iniciando processamento de lote: ${fichas.length} ficha(s)`, 'ficha-cadastro');

      const resultado = await FichaCadastroService.processarFichasEmLote(fichas);

      const status = resultado.falhas.length === 0 ? 201 : resultado.criados.length === 0 ? 400 : 207;

      res.status(status).json({
        sucesso: resultado.criados.length > 0,
        mensagem: `${resultado.criados.length} ficha(s) processada(s), ${resultado.falhas.length} falha(s).`,
        criados: resultado.criados,
        falhas: resultado.falhas
      });
    } catch (error) {
      logger.error('❌ Erro ao processar lote de fichas', 'ficha-cadastro', error);
      res.status(500).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor ao processar lote de fichas'
      });
    }
  }

  /**
   * Busca uma ficha cadastro completa por RA
   * Retorna todos os dados relacionados a uma matrícula
   */
  static async buscarFichaPorRA(req: Request, res: Response): Promise<void> {
    try {
      const { ra } = req.params;
      
      if (!ra || !ra.trim()) {
        res.status(400).json({
          sucesso: false,
          mensagem: 'RA é obrigatório'
        });
        return;
      }
      
      logger.info(`🔍 Buscando ficha cadastro por RA: ${ra}`, 'ficha-cadastro');
      
      const fichaCadastro = await FichaCadastroService.buscarFichaPorRA(ra);
      
      if (!fichaCadastro) {
        logger.warning(`⚠️ Nenhuma ficha encontrada para RA: ${ra}`, 'ficha-cadastro');
        res.status(404).json({
          sucesso: false,
          mensagem: `Nenhuma ficha cadastro encontrada para o RA: ${ra}`
        });
        return;
      }

      logger.success(`✅ Ficha cadastro encontrada para RA: ${ra}`, 'ficha-cadastro');
      res.status(200).json({
        sucesso: true,
        mensagem: `Ficha cadastro encontrada para RA: ${ra}`,
        dados: fichaCadastro
      });
    } catch (error) {
      logger.error('❌ Erro ao buscar ficha por RA', 'ficha-cadastro', error);
      res.status(500).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  /**
   * Lista todas as fichas de cadastro
   * Retorna uma lista com todas as fichas cadastradas
   */
  static async listarTodasFichas(req: Request, res: Response): Promise<void> {
    try {
      logger.info('📋 Listando todas as fichas de cadastro', 'ficha-cadastro');
      
      const fichas = await FichaCadastroService.listarTodasFichas();
      
      logger.success(`✅ ${fichas.length} fichas de cadastro encontradas`, 'ficha-cadastro');
      
      res.status(200).json({
        sucesso: true,
        mensagem: `${fichas.length} fichas de cadastro encontradas`,
        dados: fichas,
        total: fichas.length
      });
    } catch (error) {
      logger.error('❌ Erro ao listar fichas de cadastro', 'ficha-cadastro', error);
      res.status(500).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  /**
   * Importa alunos em lote com turma e ano letivo definidos.
   * Body: { turma_id, ano_letivo_id, alunos: [...] }
   * Cria aluno + dados_saude + diagnostico + matrícula por item.
   * Falhas parciais não cancelam os demais. Máx 100 alunos.
   */
  static async processarFichasCadastroLote(req: Request, res: Response): Promise<void> {
    try {
      const { turma_id, ano_letivo_id, alunos } = req.body;

      if (!turma_id?.trim()) {
        res.status(400).json({ sucesso: false, mensagem: 'turma_id é obrigatório' });
        return;
      }
      if (!ano_letivo_id?.trim()) {
        res.status(400).json({ sucesso: false, mensagem: 'ano_letivo_id é obrigatório' });
        return;
      }
      if (!Array.isArray(alunos) || alunos.length === 0) {
        res.status(400).json({ sucesso: false, mensagem: 'Campo "alunos" deve ser array não vazio' });
        return;
      }
      if (alunos.length > 100) {
        res.status(400).json({ sucesso: false, mensagem: 'Máximo 100 alunos por lote' });
        return;
      }

      const camposObrigatorios = [
        'nome_aluno', 'sobrenome_aluno', 'data_nascimento_aluno',
        'cpf_aluno', 'rg_aluno', 'naturalidade_aluno',
        'endereco_aluno', 'bairro_aluno', 'cep_aluno'
      ];

      const errosValidacao: { indice: number; campos: string[] }[] = [];
      const alunosProcessados = alunos.map((aluno: any, i: number) => {
        const faltando = camposObrigatorios.filter(c => !aluno[c]);
        if (faltando.length > 0) {
          errosValidacao.push({ indice: i, campos: faltando });
          return null;
        }

        const cpfLimpo = String(aluno.cpf_aluno).replace(/\D/g, '');
        const cepLimpo = String(aluno.cep_aluno).replace(/\D/g, '');
        const dataNascimento = new Date(aluno.data_nascimento_aluno);

        if (cpfLimpo.length !== 11) { errosValidacao.push({ indice: i, campos: ['cpf_aluno (11 dígitos)'] }); return null; }
        if (cepLimpo.length !== 8) { errosValidacao.push({ indice: i, campos: ['cep_aluno (8 dígitos)'] }); return null; }
        if (isNaN(dataNascimento.getTime())) { errosValidacao.push({ indice: i, campos: ['data_nascimento_aluno (YYYY-MM-DD)'] }); return null; }

        return {
          nome_aluno: String(aluno.nome_aluno).trim(),
          sobrenome_aluno: String(aluno.sobrenome_aluno).trim(),
          data_nascimento_aluno: dataNascimento,
          cpf_aluno: cpfLimpo,
          rg_aluno: String(aluno.rg_aluno).trim(),
          naturalidade_aluno: String(aluno.naturalidade_aluno).trim(),
          endereco_aluno: String(aluno.endereco_aluno).trim(),
          bairro_aluno: String(aluno.bairro_aluno).trim(),
          cep_aluno: cepLimpo
        };
      });

      if (errosValidacao.length > 0) {
        res.status(400).json({ sucesso: false, mensagem: 'Erros de validação no lote', erros: errosValidacao });
        return;
      }

      logger.info(`📦 Processando lote de ${alunosProcessados.length} aluno(s) → turma ${turma_id}`, 'ficha-cadastro');

      const resultado = await FichaCadastroService.processarFichasSimplificadasEmLote(
        turma_id,
        ano_letivo_id,
        alunosProcessados as any
      );

      const status = resultado.falhas.length === 0 ? 201 : resultado.criados.length === 0 ? 400 : 207;
      res.status(status).json({
        sucesso: resultado.criados.length > 0,
        mensagem: `${resultado.criados.length} aluno(s) importado(s), ${resultado.falhas.length} falha(s)`,
        criados: resultado.criados,
        falhas: resultado.falhas
      });

    } catch (error) {
      logger.error('❌ Erro ao processar lote de fichas', 'ficha-cadastro', error);
      res.status(500).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  /**
   * Lista modelos/templates para auxiliar no preenchimento da ficha
   */
  static async obterModeloFicha(req: Request, res: Response): Promise<void> {
    try {
      logger.info('📋 Gerando modelo de ficha cadastro', 'ficha-cadastro');
      
      const modeloFicha = {
        aluno: {
          nome_aluno: "string (obrigatório)",
          sobrenome_aluno: "string (obrigatório)",
          data_nascimento_aluno: "date (obrigatório) - formato: YYYY-MM-DD",
          cpf_aluno: "string (obrigatório) - apenas números",
          rg_aluno: "string (obrigatório)",
          naturalidade_aluno: "string (obrigatório)",
          endereco_aluno: "string (obrigatório)",
          bairro_aluno: "string (obrigatório)",
          cep_aluno: "string (obrigatório) - formato: 12345-678",
          religiao_id: "uuid (obrigatório) - ID da religião"
        },
        certidao: {
          livro_certidao: "string (obrigatório)",
          matricula_certidao: "string (obrigatório)",
          termo_certidao: "string (obrigatório)",
          folha_certidao: "string (obrigatório)",
          data_expedicao_certidao: "date (obrigatório) - formato: YYYY-MM-DD",
          nome_cartorio_certidao: "string (obrigatório)"
        },
        responsaveis: [
          {
            nome_responsavel: "string (obrigatório)",
            sobrenome_responsavel: "string (obrigatório)",
            telefone_responsavel: "string (obrigatório)",
            rg_responsavel: "string (obrigatório)",
            cpf_responsavel: "string (obrigatório)",
            grau_instrucao_responsavel: "string (obrigatório)",
            email_responsavel: "string (obrigatório)",
            parentesco_id: "uuid (obrigatório) - ID do parentesco"
          }
        ],
        dados_saude: {
          necessidades_especiais: "string (opcional)",
          vacinas_em_dia: "boolean (obrigatório)",
          dorme_bem: "boolean (obrigatório)",
          alimenta_se_bem: "boolean (obrigatório)",
          uso_sanitario_sozinho: "boolean (obrigatório)",
          restricao_alimentar: "string (opcional)",
          problema_saude: "string (opcional)",
          alergia_medicamento: "string (opcional)",
          uso_continuo_medicamento: "string (opcional)",
          alergias: "string (opcional)",
          medicacao_febre: "string (opcional)",
          medicacao_dor_cabeca: "string (opcional)",
          medicacao_dor_barriga: "string (opcional)",
          historico_convulsao: "boolean (obrigatório)",
          perda_esfincter_emocional: "boolean (obrigatório)",
          frequentou_outra_escola: "boolean (obrigatório)",
          tipo_parto: "string (opcional)",
          gravidez_tranquila: "boolean (obrigatório)",
          medicacao_gravidez: "string (opcional)",
          tem_irmaos: "boolean (obrigatório)",
          fonoaudiologico: "boolean (obrigatório)",
          psicopedagogico: "boolean (obrigatório)",
          neurologico: "boolean (obrigatório)",
          outro_tratamento: "string (opcional)",
          motivo_tratamento: "string (opcional)",
          observacoes: "string (opcional)"
        },
        diagnostico: {
          cegueira: "boolean (obrigatório)",
          baixa_visao: "boolean (obrigatório)",
          surdez: "boolean (obrigatório)",
          deficiencia_auditiva: "boolean (obrigatório)",
          surdocegueira: "boolean (obrigatório)",
          deficiencia_fisica: "boolean (obrigatório)",
          deficiencia_multipla: "boolean (obrigatório)",
          deficiencia_intelectual: "boolean (obrigatório)",
          sindrome_down: "boolean (obrigatório)",
          altas_habilidades: "boolean (obrigatório)",
          tea: "boolean (obrigatório)",
          alteracoes_processamento_auditivo: "boolean (obrigatório)",
          tdah: "boolean (obrigatório)",
          outros_diagnosticos: "string (opcional)"
        },
        matricula: {
          turma_id: "uuid (obrigatório) - ID da turma",
          ano_letivo_id: "uuid (obrigatório) - ID do ano letivo",
          data_matricula: "date (obrigatório) - formato: YYYY-MM-DD"
        }
      };

      res.status(200).json({
        sucesso: true,
        mensagem: "Modelo de ficha cadastro",
        dados: modeloFicha
      });
    } catch (error) {
      logger.error('❌ Erro ao gerar modelo de ficha', 'ficha-cadastro', error);
      res.status(500).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }
}

export default FichaCadastroController;
