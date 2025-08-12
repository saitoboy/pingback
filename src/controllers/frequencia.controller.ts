import { Request, Response } from 'express';
import { FrequenciaService } from '../services/frequencia.service';
import logger from '../utils/logger';

export class FrequenciaController {

  static async listarTodas(req: Request, res: Response): Promise<void> {
    try {
      logger.info('Controller: Listando todas as frequências');
      const frequencias = await FrequenciaService.listarTodas();
      
      res.status(200).json({
        success: true,
        data: frequencias,
        message: 'Frequências listadas com sucesso'
      });
    } catch (error) {
      logger.error('Erro no controller ao listar frequências:', 'FrequenciaController', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const { frequencia_id } = req.params;
      logger.info(`Controller: Buscando frequência por ID: ${frequencia_id}`);
      
      const frequencia = await FrequenciaService.buscarPorId(frequencia_id);
      
      if (!frequencia) {
        res.status(404).json({
          success: false,
          message: 'Frequência não encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: frequencia,
        message: 'Frequência encontrada com sucesso'
      });
    } catch (error) {
      logger.error(`Erro no controller ao buscar frequência por ID:`, 'FrequenciaController', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async buscarComDetalhes(req: Request, res: Response): Promise<void> {
    try {
      const { frequencia_id } = req.params;
      
      if (frequencia_id) {
        logger.info(`Controller: Buscando frequência com detalhes por ID: ${frequencia_id}`);
      } else {
        logger.info('Controller: Listando todas as frequências com detalhes');
      }
      
      const resultado = await FrequenciaService.buscarComDetalhes(frequencia_id);
      
      if (frequencia_id && !resultado) {
        res.status(404).json({
          success: false,
          message: 'Frequência não encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: resultado,
        message: frequencia_id ? 'Frequência com detalhes encontrada com sucesso' : 'Frequências com detalhes listadas com sucesso'
      });
    } catch (error) {
      logger.error('Erro no controller ao buscar frequências com detalhes:', 'FrequenciaController', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async buscarPorMatricula(req: Request, res: Response): Promise<void> {
    try {
      const { matricula_aluno_id } = req.params;
      logger.info(`Controller: Buscando frequências por matrícula: ${matricula_aluno_id}`);
      
      const frequencias = await FrequenciaService.buscarPorMatricula(matricula_aluno_id);
      
      res.status(200).json({
        success: true,
        data: frequencias,
        message: `Frequências da matrícula ${matricula_aluno_id} listadas com sucesso`
      });
    } catch (error) {
      logger.error('Erro no controller ao buscar frequências por matrícula:', 'FrequenciaController', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async buscarPorAluno(req: Request, res: Response): Promise<void> {
    try {
      const { aluno_id } = req.params;
      logger.info(`Controller: Buscando frequências por aluno: ${aluno_id}`);
      
      const frequencias = await FrequenciaService.buscarPorAluno(aluno_id);
      
      res.status(200).json({
        success: true,
        data: frequencias,
        message: `Frequências do aluno ${aluno_id} listadas com sucesso`
      });
    } catch (error) {
      logger.error('Erro no controller ao buscar frequências por aluno:', 'FrequenciaController', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async buscarPorAula(req: Request, res: Response): Promise<void> {
    try {
      const { aula_id } = req.params;
      logger.info(`Controller: Buscando frequências por aula: ${aula_id}`);
      
      const frequencias = await FrequenciaService.buscarPorAula(aula_id);
      
      res.status(200).json({
        success: true,
        data: frequencias,
        message: `Frequências da aula ${aula_id} listadas com sucesso`
      });
    } catch (error) {
      logger.error('Erro no controller ao buscar frequências por aula:', 'FrequenciaController', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async buscarPorTurmaEData(req: Request, res: Response): Promise<void> {
    try {
      const { turma_id, data_aula } = req.params;
      const { disciplina_id } = req.query;
      
      logger.info(`Controller: Buscando frequências por turma ${turma_id} e data ${data_aula}`);
      
      const frequencias = await FrequenciaService.buscarPorTurmaEData(
        turma_id, 
        data_aula, 
        disciplina_id as string
      );
      
      res.status(200).json({
        success: true,
        data: frequencias,
        message: 'Frequências por turma e data listadas com sucesso'
      });
    } catch (error) {
      logger.error('Erro no controller ao buscar frequências por turma e data:', 'FrequenciaController', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async criar(req: Request, res: Response): Promise<void> {
    try {
      const { aula_id, matricula_aluno_id, presenca } = req.body;
      
      // Validações básicas
      if (!aula_id || !matricula_aluno_id || presenca === undefined) {
        res.status(400).json({
          success: false,
          message: 'Campos obrigatórios: aula_id, matricula_aluno_id, presenca'
        });
        return;
      }

      if (typeof presenca !== 'boolean') {
        res.status(400).json({
          success: false,
          message: 'O campo presenca deve ser um valor booleano (true/false)'
        });
        return;
      }

      logger.info('Controller: Criando nova frequência');
      
      const novaFrequencia = await FrequenciaService.criar({
        aula_id,
        matricula_aluno_id,
        presenca
      });
      
      res.status(201).json({
        success: true,
        data: novaFrequencia,
        message: 'Frequência criada com sucesso'
      });
    } catch (error) {
      logger.error('Erro no controller ao criar frequência:', 'FrequenciaController', error);
      
      if (error instanceof Error) {
        if (error.message.includes('não encontrada') || error.message.includes('não encontrado')) {
          res.status(404).json({
            success: false,
            message: error.message
          });
          return;
        }
        
        if (error.message.includes('Já existe')) {
          res.status(409).json({
            success: false,
            message: error.message
          });
          return;
        }
      }
      
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { frequencia_id } = req.params;
      const dadosAtualizacao = req.body;
      
      // Validar se presenca é booleano quando fornecido
      if (dadosAtualizacao.presenca !== undefined && typeof dadosAtualizacao.presenca !== 'boolean') {
        res.status(400).json({
          success: false,
          message: 'O campo presenca deve ser um valor booleano (true/false)'
        });
        return;
      }

      logger.info(`Controller: Atualizando frequência ${frequencia_id}`);
      
      const frequenciaAtualizada = await FrequenciaService.atualizar(frequencia_id, dadosAtualizacao);
      
      if (!frequenciaAtualizada) {
        res.status(404).json({
          success: false,
          message: 'Frequência não encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: frequenciaAtualizada,
        message: 'Frequência atualizada com sucesso'
      });
    } catch (error) {
      logger.error('Erro no controller ao atualizar frequência:', 'FrequenciaController', error);
      
      if (error instanceof Error) {
        if (error.message.includes('não encontrada') || error.message.includes('não encontrado')) {
          res.status(404).json({
            success: false,
            message: error.message
          });
          return;
        }
        
        if (error.message.includes('Já existe')) {
          res.status(409).json({
            success: false,
            message: error.message
          });
          return;
        }
      }
      
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async deletar(req: Request, res: Response): Promise<void> {
    try {
      const { frequencia_id } = req.params;
      logger.info(`Controller: Deletando frequência ${frequencia_id}`);
      
      const deletado = await FrequenciaService.deletar(frequencia_id);
      
      if (!deletado) {
        res.status(404).json({
          success: false,
          message: 'Frequência não encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Frequência deletada com sucesso'
      });
    } catch (error) {
      logger.error('Erro no controller ao deletar frequência:', 'FrequenciaController', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async obterEstatisticasPorAluno(req: Request, res: Response): Promise<void> {
    try {
      const { aluno_id } = req.params;
      logger.info(`Controller: Obtendo estatísticas de frequência para aluno: ${aluno_id}`);
      
      const estatisticas = await FrequenciaService.obterEstatisticasPorAluno(aluno_id);
      
      res.status(200).json({
        success: true,
        data: estatisticas,
        message: 'Estatísticas de frequência por aluno obtidas com sucesso'
      });
    } catch (error) {
      logger.error('Erro no controller ao obter estatísticas por aluno:', 'FrequenciaController', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async obterEstatisticasPorTurmaDisciplina(req: Request, res: Response): Promise<void> {
    try {
      const { turma_id, disciplina_id } = req.params;
      const { data_inicio, data_fim } = req.query;
      
      logger.info(`Controller: Obtendo estatísticas de frequência para turma ${turma_id} e disciplina ${disciplina_id}`);
      
      const estatisticas = await FrequenciaService.obterEstatisticasPorTurmaDisciplina(
        turma_id, 
        disciplina_id, 
        data_inicio as string,
        data_fim as string
      );
      
      res.status(200).json({
        success: true,
        data: estatisticas,
        message: 'Estatísticas de frequência por turma e disciplina obtidas com sucesso'
      });
    } catch (error) {
      logger.error('Erro no controller ao obter estatísticas por turma e disciplina:', 'FrequenciaController', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async registrarFrequenciaLote(req: Request, res: Response): Promise<void> {
    try {
      const { aula_id, frequencias } = req.body;
      
      // Validações básicas
      if (!aula_id || !frequencias || !Array.isArray(frequencias)) {
        res.status(400).json({
          success: false,
          message: 'Campos obrigatórios: aula_id e frequencias (array)'
        });
        return;
      }

      if (frequencias.length === 0) {
        res.status(400).json({
          success: false,
          message: 'O array de frequências não pode estar vazio'
        });
        return;
      }

      // Validar estrutura de cada frequência
      for (const freq of frequencias) {
        if (!freq.matricula_aluno_id || freq.presenca === undefined) {
          res.status(400).json({
            success: false,
            message: 'Cada item do array deve conter matricula_aluno_id e presenca'
          });
          return;
        }
        
        if (typeof freq.presenca !== 'boolean') {
          res.status(400).json({
            success: false,
            message: 'O campo presenca deve ser um valor booleano (true/false)'
          });
          return;
        }
      }

      logger.info(`Controller: Registrando frequência em lote para aula ${aula_id}`);
      
      const frequenciasRegistradas = await FrequenciaService.registrarFrequenciaLote(aula_id, frequencias);
      
      res.status(201).json({
        success: true,
        data: frequenciasRegistradas,
        message: `Frequência em lote registrada com sucesso. Total: ${frequenciasRegistradas.length} registros`
      });
    } catch (error) {
      logger.error('Erro no controller ao registrar frequência em lote:', 'FrequenciaController', error);
      
      if (error instanceof Error) {
        if (error.message.includes('não encontrada') || error.message.includes('não encontrado')) {
          res.status(404).json({
            success: false,
            message: error.message
          });
          return;
        }
        
        if (error.message.includes('Já existe')) {
          res.status(409).json({
            success: false,
            message: error.message
          });
          return;
        }
      }
      
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
}
