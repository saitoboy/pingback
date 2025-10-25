import { Request, Response } from 'express';
import AulaService from '../services/aula.service';
import { logSuccess, logError } from '../utils/logger';

export class AulaController {
  // Listar todas as aulas
  static async listarTodas(req: Request, res: Response) {
    try {
      const aulas = await AulaService.listarTodas();
      
      logSuccess('Lista de aulas obtida com sucesso', 'controller', { 
        total: aulas.length 
      });
      
      return res.status(200).json({ 
        aulas,
        total: aulas.length 
      });
      
    } catch (error: any) {
      logError('Erro inesperado ao listar aulas', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  // Buscar aula por ID
  static async buscarPorId(req: Request, res: Response) {
    try {
      const { aula_id } = req.params;
      
      if (!aula_id) {
        logError('Erro ao buscar aula: aula_id não fornecido', 'controller', req.params);
        return res.status(400).json({ 
          mensagem: 'ID da aula é obrigatório.' 
        });
      }

      const aula = await AulaService.buscarPorId(aula_id);
      
      if (!aula) {
        logError('Aula não encontrada', 'controller', { aula_id });
        return res.status(404).json({ 
          mensagem: 'Aula não encontrada.' 
        });
      }
      
      logSuccess('Aula encontrada com sucesso', 'controller', { aula_id });
      
      return res.status(200).json({ 
        aula 
      });
      
    } catch (error: any) {
      logError('Erro inesperado ao buscar aula', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  // Buscar aulas por vinculação
  static async buscarPorVinculacao(req: Request, res: Response) {
    try {
      const { turma_disciplina_professor_id } = req.params;
      
      if (!turma_disciplina_professor_id) {
        logError('Erro ao buscar aulas: turma_disciplina_professor_id não fornecido', 'controller', req.params);
        return res.status(400).json({ 
          mensagem: 'ID da vinculação é obrigatório.' 
        });
      }

      const aulas = await AulaService.buscarPorVinculacao(turma_disciplina_professor_id);
      
      logSuccess('Aulas da vinculação obtidas com sucesso', 'controller', { 
        turma_disciplina_professor_id,
        total: aulas.length 
      });
      
      return res.status(200).json({ 
        aulas,
        total: aulas.length 
      });
      
    } catch (error: any) {
      logError('Erro inesperado ao buscar aulas por vinculação', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  // Criar nova aula
  static async criar(req: Request, res: Response) {
    try {
      const { turma_disciplina_professor_id, data_aula, hora_inicio, hora_fim } = req.body;
      
      // Validações básicas
      if (!turma_disciplina_professor_id || !data_aula || !hora_inicio || !hora_fim) {
        logError('Erro ao criar aula: dados obrigatórios não fornecidos', 'controller', req.body);
        return res.status(400).json({ 
          mensagem: 'Todos os campos são obrigatórios: turma_disciplina_professor_id, data_aula, hora_inicio, hora_fim.' 
        });
      }

      // Validar formato da data
      const dataAula = new Date(data_aula);
      if (isNaN(dataAula.getTime())) {
        logError('Erro ao criar aula: data inválida', 'controller', { data_aula });
        return res.status(400).json({ 
          mensagem: 'Formato de data inválido.' 
        });
      }

      // Validar horários
      if (hora_inicio >= hora_fim) {
        logError('Erro ao criar aula: horário de início deve ser menor que horário de fim', 'controller', { hora_inicio, hora_fim });
        return res.status(400).json({ 
          mensagem: 'Horário de início deve ser menor que horário de fim.' 
        });
      }

      const novaAula = await AulaService.criar({
        turma_disciplina_professor_id,
        data_aula: dataAula,
        hora_inicio,
        hora_fim
      });
      
      logSuccess('Aula criada com sucesso', 'controller', { 
        aula_id: novaAula.aula_id,
        turma_disciplina_professor_id: novaAula.turma_disciplina_professor_id,
        data_aula: novaAula.data_aula,
        hora_inicio: novaAula.hora_inicio,
        hora_fim: novaAula.hora_fim
      });
      
      return res.status(201).json({ 
        mensagem: 'Aula criada com sucesso.',
        aula: novaAula 
      });
      
    } catch (error: any) {
      logError('Erro inesperado ao criar aula', 'controller', error);
      
      // Tratar erros específicos
      if (error.message.includes('Vinculação professor-turma-disciplina não encontrada')) {
        return res.status(404).json({ 
          mensagem: 'Vinculação professor-turma-disciplina não encontrada.',
          detalhes: error.message 
        });
      }
      
      if (error.message.includes('Conflito de horário')) {
        return res.status(409).json({ 
          mensagem: 'Conflito de horário detectado.',
          detalhes: error.message 
        });
      }
      
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  // Atualizar aula
  static async atualizar(req: Request, res: Response) {
    try {
      const { aula_id } = req.params;
      const dadosAtualizacao = req.body;
      
      if (!aula_id) {
        logError('Erro ao atualizar aula: aula_id não fornecido', 'controller', req.params);
        return res.status(400).json({ 
          mensagem: 'ID da aula é obrigatório.' 
        });
      }

      // Validar dados de atualização
      if (dadosAtualizacao.data_aula) {
        const dataAula = new Date(dadosAtualizacao.data_aula);
        if (isNaN(dataAula.getTime())) {
          logError('Erro ao atualizar aula: data inválida', 'controller', { data_aula: dadosAtualizacao.data_aula });
          return res.status(400).json({ 
            mensagem: 'Formato de data inválido.' 
          });
        }
        dadosAtualizacao.data_aula = dataAula;
      }

      if (dadosAtualizacao.hora_inicio && dadosAtualizacao.hora_fim) {
        if (dadosAtualizacao.hora_inicio >= dadosAtualizacao.hora_fim) {
          logError('Erro ao atualizar aula: horário de início deve ser menor que horário de fim', 'controller', { 
            hora_inicio: dadosAtualizacao.hora_inicio, 
            hora_fim: dadosAtualizacao.hora_fim 
          });
          return res.status(400).json({ 
            mensagem: 'Horário de início deve ser menor que horário de fim.' 
          });
        }
      }

      const aulaAtualizada = await AulaService.atualizar(aula_id, dadosAtualizacao);
      
      if (!aulaAtualizada) {
        logError('Aula não encontrada para atualização', 'controller', { aula_id });
        return res.status(404).json({ 
          mensagem: 'Aula não encontrada.' 
        });
      }
      
      logSuccess('Aula atualizada com sucesso', 'controller', { 
        aula_id,
        dados_atualizados: Object.keys(dadosAtualizacao)
      });
      
      return res.status(200).json({ 
        mensagem: 'Aula atualizada com sucesso.',
        aula: aulaAtualizada 
      });
      
    } catch (error: any) {
      logError('Erro inesperado ao atualizar aula', 'controller', error);
      
      // Tratar erros específicos
      if (error.message.includes('Conflito de horário')) {
        return res.status(409).json({ 
          mensagem: 'Conflito de horário detectado.',
          detalhes: error.message 
        });
      }
      
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  // Deletar aula
  static async deletar(req: Request, res: Response) {
    try {
      const { aula_id } = req.params;
      
      if (!aula_id) {
        logError('Erro ao deletar aula: aula_id não fornecido', 'controller', req.params);
        return res.status(400).json({ 
          mensagem: 'ID da aula é obrigatório.' 
        });
      }

      const deletada = await AulaService.deletar(aula_id);
      
      if (!deletada) {
        logError('Aula não encontrada para exclusão', 'controller', { aula_id });
        return res.status(404).json({ 
          mensagem: 'Aula não encontrada.' 
        });
      }
      
      logSuccess('Aula deletada com sucesso', 'controller', { aula_id });
      
      return res.status(200).json({ 
        mensagem: 'Aula deletada com sucesso.' 
      });
      
    } catch (error: any) {
      logError('Erro inesperado ao deletar aula', 'controller', error);
      
      // Tratar erros específicos
      if (error.message.includes('Não é possível excluir aula que possui conteúdos registrados')) {
        return res.status(409).json({ 
          mensagem: 'Não é possível excluir aula que possui conteúdos registrados.',
          detalhes: error.message 
        });
      }
      
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  // Buscar aulas com detalhes
  static async buscarComDetalhes(req: Request, res: Response) {
    try {
      const { aula_id } = req.params;
      
      // Usar o método mais robusto para buscar detalhes
      const resultado = await AulaService.buscarDetalhesAula(aula_id);
      
      // Log de debug para verificar o resultado
      console.log('🔍 Resultado da consulta:', resultado);
      console.log('🔍 Tipo do resultado:', typeof resultado);
      console.log('🔍 Dados encontrados:', {
        aula_id: resultado?.aula_id,
        nome_turma: resultado?.nome_turma,
        nome_disciplina: resultado?.nome_disciplina,
        nome_professor: resultado?.nome_professor
      });
      
      logSuccess('Aulas com detalhes obtidas com sucesso', 'controller', { 
        aula_id,
        tem_dados: !!resultado
      });
      
      return res.status(200).json({ 
        sucesso: true,
        dados: resultado,
        total: 1
      });
      
    } catch (error: any) {
      logError('Erro inesperado ao buscar aulas com detalhes', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }
}

export default AulaController;