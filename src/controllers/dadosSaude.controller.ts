import { Request, Response } from 'express';
import { DadosSaudeService } from '../services/dadosSaude.service';
import { DadosSaude } from '../types/models';
import { logError, logInfo, logSuccess } from '../utils/logger';

export class DadosSaudeController {

  static async criarDadosSaude(req: Request, res: Response): Promise<Response> {
    logInfo('Iniciando criação de dados de saúde', 'controller', req.body);
    
    try {
      const dadosSaude: Omit<DadosSaude, 'dados_saude_id' | 'created_at' | 'updated_at'> = req.body;
      
      // Validação básica dos dados obrigatórios
      const camposObrigatorios = [
        'aluno_id', 'vacinas_em_dia', 'dorme_bem', 'alimenta_se_bem',
        'uso_sanitario_sozinho', 'historico_convulsao', 'perda_esfincter_emocional',
        'frequentou_outra_escola', 'gravidez_tranquila', 'tem_irmaos',
        'fonoaudiologico', 'psicopedagogico', 'neurologico'
      ];
      
      const camposFaltando = camposObrigatorios.filter(campo => 
        req.body[campo] === undefined || req.body[campo] === null
      );
      
      if (camposFaltando.length > 0) {
        logError('Campos obrigatórios ausentes', 'controller', { camposFaltando });
        return res.status(400).json({
          error: '❌ Dados incompletos',
          message: `Os seguintes campos são obrigatórios: ${camposFaltando.join(', ')}`,
          codigo_erro: 'CAMPOS_OBRIGATORIOS',
          dados_faltando: camposFaltando
        });
      }

      const novosDadosSaude = await DadosSaudeService.criarDadosSaude(dadosSaude);

      logSuccess('Dados de saúde criados com sucesso', 'controller', { 
        dados_saude_id: novosDadosSaude.dados_saude_id,
        aluno_id: novosDadosSaude.aluno_id
      });

      return res.status(201).json({
        success: '✅ Dados de saúde criados com sucesso',
        data: novosDadosSaude
      });
      
    } catch (error: any) {
      logError('Erro ao criar dados de saúde', 'controller', error);
      
      // Tratar erros específicos do service
      if (error.codigo) {
        switch (error.codigo) {
          case 'CAMPO_OBRIGATORIO':
            return res.status(400).json({
              error: '❌ Campo obrigatório ausente',
              message: `O campo '${error.campo}' é obrigatório`,
              codigo_erro: 'CAMPO_OBRIGATORIO',
              campo_faltando: error.campo
            });

          case 'ALUNO_NAO_ENCONTRADO':
            return res.status(404).json({
              error: '❌ Aluno não encontrado',
              message: `Não foi encontrado nenhum aluno com o ID: ${error.aluno_id}`,
              codigo_erro: 'ALUNO_NAO_ENCONTRADO',
              aluno_id_fornecido: error.aluno_id,
              dica: 'Verifique se o aluno_id está correto ou se o aluno existe no sistema'
            });

          case 'DADOS_SAUDE_DUPLICADOS':
            return res.status(409).json({
              error: '❌ Dados de saúde já cadastrados',
              message: `Já existem dados de saúde cadastrados para este aluno`,
              codigo_erro: 'DADOS_SAUDE_DUPLICADOS',
              aluno_id: error.aluno_id,
              dados_saude_existente_id: error.dados_saude_existente_id,
              dica: 'Use PUT para atualizar os dados existentes ou DELETE para remover e criar novos'
            });

          case 'CAMPO_MUITO_LONGO':
            return res.status(400).json({
              error: '❌ Campo muito longo',
              message: `Campo '${error.campo}' deve ter no máximo ${error.tamanho_maximo} caracteres`,
              codigo_erro: 'CAMPO_MUITO_LONGO',
              campo_problematico: error.campo,
              tamanho_atual: error.tamanho_atual,
              tamanho_maximo: error.tamanho_maximo,
              dica: 'Reduza o texto ou use observações para informações extras'
            });

          case 'TIPO_PARTO_INVALIDO':
            return res.status(400).json({
              error: '❌ Tipo de parto inválido',
              message: `Tipo de parto deve ser um dos valores: ${error.tipos_validos.join(', ')}`,
              codigo_erro: 'TIPO_PARTO_INVALIDO',
              tipo_parto_recebido: error.tipo_parto_recebido,
              tipos_validos: error.tipos_validos,
              dica: 'Use um dos tipos listados ou deixe em branco'
            });

          default:
            return res.status(400).json({
              error: '❌ Erro de validação',
              message: error.message || 'Erro desconhecido na validação dos dados',
              codigo_erro: error.codigo
            });
        }
      }

      // Erro genérico
      return res.status(500).json({
        error: '❌ Erro interno do servidor',
        message: 'Ocorreu um erro inesperado ao criar os dados de saúde',
        codigo_erro: 'ERRO_INTERNO'
      });
    }
  }

  static async buscarDadosSaudePorId(req: Request, res: Response): Promise<Response> {
    logInfo('Buscando dados de saúde por ID', 'controller', { dados_saude_id: req.params.id });
    
    try {
      const { id } = req.params;
      
      if (!id || id.trim() === '') {
        logError('ID dos dados de saúde não fornecido', 'controller', { id });
        return res.status(400).json({
          error: '❌ ID inválido',
          message: 'ID dos dados de saúde é obrigatório',
          codigo_erro: 'ID_OBRIGATORIO'
        });
      }

      const dadosSaude = await DadosSaudeService.buscarPorId(id);
      
      if (!dadosSaude) {
        return res.status(404).json({
          error: '❌ Dados de saúde não encontrados',
          message: 'Nenhum registro de dados de saúde foi encontrado com este ID',
          codigo_erro: 'DADOS_SAUDE_NAO_ENCONTRADOS',
          dados_saude_id_fornecido: id
        });
      }

      logSuccess('Dados de saúde encontrados', 'controller', { 
        dados_saude_id: id,
        aluno: `${dadosSaude.nome_aluno} ${dadosSaude.sobrenome_aluno}`
      });

      return res.status(200).json({
        success: '✅ Dados de saúde encontrados',
        data: dadosSaude
      });
      
    } catch (error) {
      logError('Erro interno ao buscar dados de saúde', 'controller', error);
      return res.status(500).json({
        error: '❌ Erro interno do servidor',
        message: 'Ocorreu um erro inesperado ao buscar os dados de saúde',
        codigo_erro: 'ERRO_INTERNO'
      });
    }
  }

  static async buscarDadosSaudePorAlunoId(req: Request, res: Response): Promise<Response> {
    logInfo('Buscando dados de saúde por aluno ID', 'controller', { aluno_id: req.params.aluno_id });
    
    try {
      const { aluno_id } = req.params;
      
      if (!aluno_id || aluno_id.trim() === '') {
        logError('ID do aluno não fornecido', 'controller', { aluno_id });
        return res.status(400).json({
          error: '❌ ID inválido',
          message: 'ID do aluno é obrigatório',
          codigo_erro: 'ID_ALUNO_OBRIGATORIO'
        });
      }

      const dadosSaude = await DadosSaudeService.buscarPorAlunoId(aluno_id);
      
      if (!dadosSaude) {
        return res.status(404).json({
          error: '❌ Dados de saúde não encontrados',
          message: 'Nenhum registro de dados de saúde foi encontrado para este aluno',
          codigo_erro: 'DADOS_SAUDE_NAO_ENCONTRADOS_ALUNO',
          aluno_id_fornecido: aluno_id
        });
      }

      logSuccess('Dados de saúde encontrados para o aluno', 'controller', { 
        aluno_id,
        dados_saude_id: dadosSaude.dados_saude_id
      });

      return res.status(200).json({
        success: '✅ Dados de saúde do aluno encontrados',
        data: dadosSaude
      });
      
    } catch (error: any) {
      logError('Erro ao buscar dados de saúde por aluno', 'controller', error);
      
      if (error.codigo === 'ALUNO_NAO_ENCONTRADO') {
        return res.status(404).json({
          error: '❌ Aluno não encontrado',
          message: `Não foi encontrado nenhum aluno com o ID: ${error.aluno_id}`,
          codigo_erro: 'ALUNO_NAO_ENCONTRADO',
          aluno_id_fornecido: error.aluno_id
        });
      }
      
      return res.status(500).json({
        error: '❌ Erro interno do servidor',
        message: 'Ocorreu um erro inesperado ao buscar os dados de saúde do aluno',
        codigo_erro: 'ERRO_INTERNO'
      });
    }
  }

  static async listarDadosSaude(req: Request, res: Response): Promise<Response> {
    logInfo('Listando todos os dados de saúde', 'controller');
    
    try {
      const dadosSaude = await DadosSaudeService.listarTodos();

      logSuccess('Lista de dados de saúde obtida', 'controller', { total: dadosSaude.length });

      return res.status(200).json({
        success: '✅ Lista de dados de saúde obtida com sucesso',
        total: dadosSaude.length,
        data: dadosSaude
      });
      
    } catch (error) {
      logError('Erro interno ao listar dados de saúde', 'controller', error);
      return res.status(500).json({
        error: '❌ Erro interno do servidor',
        message: 'Ocorreu um erro inesperado ao listar os dados de saúde',
        codigo_erro: 'ERRO_INTERNO'
      });
    }
  }

  static async atualizarDadosSaude(req: Request, res: Response): Promise<Response> {
    logInfo('Atualizando dados de saúde', 'controller', { 
      dados_saude_id: req.params.id,
      dados: req.body 
    });
    
    try {
      const { id } = req.params;
      
      if (!id || id.trim() === '') {
        logError('ID dos dados de saúde não fornecido', 'controller', { id });
        return res.status(400).json({
          error: '❌ ID inválido',
          message: 'ID dos dados de saúde é obrigatório',
          codigo_erro: 'ID_OBRIGATORIO'
        });
      }

      const dadosAtualizacao: Partial<Omit<DadosSaude, 'dados_saude_id' | 'created_at' | 'updated_at'>> = req.body;
      
      if (Object.keys(dadosAtualizacao).length === 0) {
        logError('Nenhum dado fornecido para atualização', 'controller', dadosAtualizacao);
        return res.status(400).json({
          error: '❌ Dados incompletos',
          message: 'Pelo menos um campo deve ser fornecido para atualização',
          codigo_erro: 'NENHUM_CAMPO_PARA_ATUALIZAR'
        });
      }

      const dadosSaudeAtualizado = await DadosSaudeService.atualizarDadosSaude(id, dadosAtualizacao);

      logSuccess('Dados de saúde atualizados com sucesso', 'controller', { 
        dados_saude_id: id,
        aluno_id: dadosSaudeAtualizado.aluno_id
      });

      return res.status(200).json({
        success: '✅ Dados de saúde atualizados com sucesso',
        data: dadosSaudeAtualizado
      });
      
    } catch (error: any) {
      logError('Erro ao atualizar dados de saúde', 'controller', error);
      
      // Tratar erros específicos do service
      if (error.codigo) {
        switch (error.codigo) {
          case 'DADOS_SAUDE_NAO_ENCONTRADOS':
            return res.status(404).json({
              error: '❌ Dados de saúde não encontrados',
              message: 'Não foi possível encontrar os dados de saúde para atualizar',
              codigo_erro: 'DADOS_SAUDE_NAO_ENCONTRADOS',
              dados_saude_id_fornecido: error.dados_saude_id
            });

          case 'CAMPO_MUITO_LONGO':
            return res.status(400).json({
              error: '❌ Campo muito longo',
              message: `Campo '${error.campo}' deve ter no máximo ${error.tamanho_maximo} caracteres`,
              codigo_erro: 'CAMPO_MUITO_LONGO',
              campo_problematico: error.campo,
              tamanho_atual: error.tamanho_atual,
              tamanho_maximo: error.tamanho_maximo,
              dica: 'Reduza o texto ou use observações para informações extras'
            });

          case 'TIPO_PARTO_INVALIDO':
            return res.status(400).json({
              error: '❌ Tipo de parto inválido',
              message: `Tipo de parto deve ser um dos valores: ${error.tipos_validos.join(', ')}`,
              codigo_erro: 'TIPO_PARTO_INVALIDO',
              tipo_parto_recebido: error.tipo_parto_recebido,
              tipos_validos: error.tipos_validos,
              dica: 'Use um dos tipos listados ou deixe em branco'
            });

          default:
            return res.status(400).json({
              error: '❌ Erro de validação',
              message: error.message || 'Erro desconhecido na validação dos dados',
              codigo_erro: error.codigo
            });
        }
      }

      return res.status(500).json({
        error: '❌ Erro interno do servidor',
        message: 'Ocorreu um erro inesperado ao atualizar os dados de saúde',
        codigo_erro: 'ERRO_INTERNO'
      });
    }
  }

  static async deletarDadosSaude(req: Request, res: Response): Promise<Response> {
    logInfo('Deletando dados de saúde', 'controller', { dados_saude_id: req.params.id });
    
    try {
      const { id } = req.params;
      
      if (!id || id.trim() === '') {
        logError('ID dos dados de saúde não fornecido', 'controller', { id });
        return res.status(400).json({
          error: '❌ ID inválido',
          message: 'ID dos dados de saúde é obrigatório',
          codigo_erro: 'ID_OBRIGATORIO'
        });
      }

      const deletado = await DadosSaudeService.deletarDadosSaude(id);
      
      if (!deletado) {
        return res.status(404).json({
          error: '❌ Dados de saúde não encontrados',
          message: 'Nenhum registro de dados de saúde foi encontrado com este ID para deletar',
          codigo_erro: 'DADOS_SAUDE_NAO_ENCONTRADOS',
          dados_saude_id_fornecido: id
        });
      }

      logSuccess('Dados de saúde deletados com sucesso', 'controller', { dados_saude_id: id });

      return res.status(200).json({
        success: '✅ Dados de saúde deletados com sucesso',
        message: 'Os dados de saúde foram removidos do sistema',
        dados_saude_id_deletado: id
      });
      
    } catch (error) {
      logError('Erro interno ao deletar dados de saúde', 'controller', error);
      return res.status(500).json({
        error: '❌ Erro interno do servidor',
        message: 'Ocorreu um erro inesperado ao deletar os dados de saúde',
        codigo_erro: 'ERRO_INTERNO'
      });
    }
  }
}

export default DadosSaudeController;
