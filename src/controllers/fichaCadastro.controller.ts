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
