import { Request, Response } from 'express';
import MatriculaAlunoService from '../services/matriculaAluno.service';
import logger from '../utils/logger';

class MatriculaAlunoController {

  // Listar todas as matrículas
  static async listarMatriculas(req: Request, res: Response): Promise<void> {
    try {
      logger.info('📋 Iniciando listagem de matrículas', 'matricula');
      
      const matriculas = await MatriculaAlunoService.listarMatriculas();
      
      logger.success(`📋 ${matriculas.length} matrículas encontradas`, 'matricula');
      res.status(200).json({
        sucesso: true,
        dados: matriculas,
        total: matriculas.length
      });
    } catch (error) {
      logger.error('❌ Erro ao listar matrículas', 'matricula', error);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor ao listar matrículas'
      });
    }
  }

  // Buscar matrícula por ID
  static async buscarMatriculaPorId(req: Request, res: Response): Promise<void> {
    try {
      const { matricula_aluno_id } = req.params;
      
      logger.info(`🔍 Buscando matrícula por ID: ${matricula_aluno_id}`, 'matricula');
      
      const matricula = await MatriculaAlunoService.buscarMatriculaPorId(matricula_aluno_id);
      
      if (!matricula) {
        logger.warning(`⚠️ Matrícula não encontrada: ${matricula_aluno_id}`, 'matricula');
        res.status(404).json({
          sucesso: false,
          mensagem: 'Matrícula não encontrada'
        });
        return;
      }
      
      logger.success(`✅ Matrícula encontrada: ${matricula_aluno_id}`, 'matricula');
      res.status(200).json({
        sucesso: true,
        dados: matricula
      });
    } catch (error) {
      logger.error('❌ Erro ao buscar matrícula por ID', 'matricula', error);
      res.status(500).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Buscar matrículas por aluno
  static async buscarMatriculasPorAluno(req: Request, res: Response): Promise<void> {
    try {
      const { aluno_id } = req.params;
      
      logger.info(`🔍 Buscando matrículas do aluno: ${aluno_id}`, 'matricula');
      
      const matriculas = await MatriculaAlunoService.buscarMatriculasPorAluno(aluno_id);
      
      logger.success(`✅ ${matriculas.length} matrículas encontradas para o aluno: ${aluno_id}`, 'matricula');
      res.status(200).json({
        sucesso: true,
        dados: matriculas,
        total: matriculas.length
      });
    } catch (error) {
      logger.error('❌ Erro ao buscar matrículas por aluno', 'matricula', error);
      res.status(500).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Buscar matrículas por turma
  static async buscarMatriculasPorTurma(req: Request, res: Response): Promise<void> {
    try {
      const { turma_id } = req.params;
      
      logger.info(`🔍 Buscando matrículas da turma: ${turma_id}`, 'matricula');
      
      const matriculas = await MatriculaAlunoService.buscarMatriculasPorTurma(turma_id);
      
      logger.success(`✅ ${matriculas.length} matrículas encontradas para a turma: ${turma_id}`, 'matricula');
      res.status(200).json({
        sucesso: true,
        dados: matriculas,
        total: matriculas.length
      });
    } catch (error) {
      logger.error('❌ Erro ao buscar matrículas por turma', 'matricula', error);
      res.status(500).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Buscar matrículas por ano letivo
  static async buscarMatriculasPorAnoLetivo(req: Request, res: Response): Promise<void> {
    try {
      const { ano_letivo_id } = req.params;
      
      logger.info(`🔍 Buscando matrículas do ano letivo: ${ano_letivo_id}`, 'matricula');
      
      const matriculas = await MatriculaAlunoService.buscarMatriculasPorAnoLetivo(ano_letivo_id);
      
      logger.success(`✅ ${matriculas.length} matrículas encontradas para o ano letivo: ${ano_letivo_id}`, 'matricula');
      res.status(200).json({
        sucesso: true,
        dados: matriculas,
        total: matriculas.length
      });
    } catch (error) {
      logger.error('❌ Erro ao buscar matrículas por ano letivo', 'matricula', error);
      res.status(500).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Buscar matrículas por status
  static async buscarMatriculasPorStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.params;
      
      logger.info(`🔍 Buscando matrículas com status: ${status}`, 'matricula');
      
      const matriculas = await MatriculaAlunoService.buscarMatriculasPorStatus(status);
      
      logger.success(`✅ ${matriculas.length} matrículas encontradas com status: ${status}`, 'matricula');
      res.status(200).json({
        sucesso: true,
        dados: matriculas,
        total: matriculas.length
      });
    } catch (error) {
      logger.error('❌ Erro ao buscar matrículas por status', 'matricula', error);
      res.status(500).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Buscar matrícula ativa do aluno
  static async buscarMatriculaAtivaAluno(req: Request, res: Response): Promise<void> {
    try {
      const { aluno_id, ano_letivo_id } = req.params;
      
      logger.info(`🔍 Buscando matrícula ativa do aluno: ${aluno_id} no ano: ${ano_letivo_id}`, 'matricula');
      
      const matricula = await MatriculaAlunoService.buscarMatriculaAtivaAluno(aluno_id, ano_letivo_id);
      
      if (!matricula) {
        logger.warning(`⚠️ Nenhuma matrícula ativa encontrada para aluno: ${aluno_id} no ano: ${ano_letivo_id}`, 'matricula');
        res.status(404).json({
          sucesso: false,
          mensagem: 'Nenhuma matrícula ativa encontrada para este aluno no ano letivo especificado'
        });
        return;
      }
      
      logger.success(`✅ Matrícula ativa encontrada para aluno: ${aluno_id}`, 'matricula');
      res.status(200).json({
        sucesso: true,
        dados: matricula
      });
    } catch (error) {
      logger.error('❌ Erro ao buscar matrícula ativa do aluno', 'matricula', error);
      res.status(500).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Criar matrícula
  static async criarMatricula(req: Request, res: Response): Promise<void> {
    try {
      const dadosMatricula = req.body;
      
      logger.info(`➕ Criando nova matrícula para aluno: ${dadosMatricula.aluno_id}`, 'matricula');
      
      const novaMatricula = await MatriculaAlunoService.criarMatricula(dadosMatricula);
      
      logger.success(`✅ Matrícula criada com sucesso: ${novaMatricula.matricula_aluno_id}`, 'matricula');
      res.status(201).json({
        sucesso: true,
        mensagem: 'Matrícula criada com sucesso',
        dados: novaMatricula
      });
    } catch (error) {
      logger.error('❌ Erro ao criar matrícula', 'matricula', error);
      res.status(400).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Atualizar matrícula
  static async atualizarMatricula(req: Request, res: Response): Promise<void> {
    try {
      const { matricula_aluno_id } = req.params;
      const dadosAtualizacao = req.body;
      
      logger.info(`✏️ Atualizando matrícula: ${matricula_aluno_id}`, 'matricula');
      
      const matriculaAtualizada = await MatriculaAlunoService.atualizarMatricula(matricula_aluno_id, dadosAtualizacao);
      
      if (!matriculaAtualizada) {
        logger.warning(`⚠️ Matrícula não encontrada para atualização: ${matricula_aluno_id}`, 'matricula');
        res.status(404).json({
          sucesso: false,
          mensagem: 'Matrícula não encontrada'
        });
        return;
      }
      
      logger.success(`✅ Matrícula atualizada com sucesso: ${matricula_aluno_id}`, 'matricula');
      res.status(200).json({
        sucesso: true,
        mensagem: 'Matrícula atualizada com sucesso',
        dados: matriculaAtualizada
      });
    } catch (error) {
      logger.error('❌ Erro ao atualizar matrícula', 'matricula', error);
      res.status(400).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Deletar matrícula
  static async deletarMatricula(req: Request, res: Response): Promise<void> {
    try {
      const { matricula_aluno_id } = req.params;
      
      logger.info(`🗑️ Deletando matrícula: ${matricula_aluno_id}`, 'matricula');
      
      const sucesso = await MatriculaAlunoService.deletarMatricula(matricula_aluno_id);
      
      if (!sucesso) {
        logger.warning(`⚠️ Matrícula não encontrada para deleção: ${matricula_aluno_id}`, 'matricula');
        res.status(404).json({
          sucesso: false,
          mensagem: 'Matrícula não encontrada'
        });
        return;
      }
      
      logger.success(`✅ Matrícula deletada com sucesso: ${matricula_aluno_id}`, 'matricula');
      res.status(200).json({
        sucesso: true,
        mensagem: 'Matrícula deletada com sucesso'
      });
    } catch (error) {
      logger.error('❌ Erro ao deletar matrícula', 'matricula', error);
      res.status(400).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Transferir aluno de turma
  static async transferirAluno(req: Request, res: Response): Promise<void> {
    try {
      const { matricula_aluno_id } = req.params;
      const { nova_turma_id, motivo } = req.body;
      
      logger.info(`🔄 Transferindo aluno da matrícula: ${matricula_aluno_id} para turma: ${nova_turma_id}`, 'matricula');
      
      const matriculaAtualizada = await MatriculaAlunoService.transferirAluno(matricula_aluno_id, nova_turma_id, motivo);
      
      if (!matriculaAtualizada) {
        logger.warning(`⚠️ Matrícula não encontrada para transferência: ${matricula_aluno_id}`, 'matricula');
        res.status(404).json({
          sucesso: false,
          mensagem: 'Matrícula não encontrada'
        });
        return;
      }
      
      logger.success(`✅ Aluno transferido com sucesso: ${matricula_aluno_id}`, 'matricula');
      res.status(200).json({
        sucesso: true,
        mensagem: 'Aluno transferido com sucesso',
        dados: matriculaAtualizada
      });
    } catch (error) {
      logger.error('❌ Erro ao transferir aluno', 'matricula', error);
      res.status(400).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Finalizar matrícula (concluir ou cancelar)
  static async finalizarMatricula(req: Request, res: Response): Promise<void> {
    try {
      const { matricula_aluno_id } = req.params;
      const { status, motivo } = req.body;
      
      // Validar status
      if (!['concluido', 'cancelado'].includes(status)) {
        logger.warning(`⚠️ Status inválido para finalização: ${status}`, 'matricula');
        res.status(400).json({
          sucesso: false,
          mensagem: 'Status deve ser "concluido" ou "cancelado"'
        });
        return;
      }
      
      if (!motivo?.trim()) {
        logger.warning(`⚠️ Motivo é obrigatório para finalização da matrícula: ${matricula_aluno_id}`, 'matricula');
        res.status(400).json({
          sucesso: false,
          mensagem: 'Motivo é obrigatório para finalizar a matrícula'
        });
        return;
      }
      
      logger.info(`🏁 Finalizando matrícula: ${matricula_aluno_id} com status: ${status}`, 'matricula');
      
      const matriculaFinalizada = await MatriculaAlunoService.finalizarMatricula(matricula_aluno_id, status, motivo);
      
      if (!matriculaFinalizada) {
        logger.warning(`⚠️ Matrícula não encontrada para finalização: ${matricula_aluno_id}`, 'matricula');
        res.status(404).json({
          sucesso: false,
          mensagem: 'Matrícula não encontrada'
        });
        return;
      }
      
      logger.success(`✅ Matrícula finalizada com sucesso: ${matricula_aluno_id} - Status: ${status}`, 'matricula');
      res.status(200).json({
        sucesso: true,
        mensagem: `Matrícula ${status} com sucesso`,
        dados: matriculaFinalizada
      });
    } catch (error) {
      logger.error('❌ Erro ao finalizar matrícula', 'matricula', error);
      res.status(400).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }
}

export default MatriculaAlunoController;
