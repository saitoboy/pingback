import * as ProfessorModel from '../model/professor.model';
import * as UsuarioModel from '../model/usuario.model';
import { Professor, TipoUsuario } from '../types/models';
import { logError, logSuccess } from '../utils/logger';

export class ProfessorService {
  
  static async criarProfessor(usuario_id: string): Promise<Professor | null> {
    try {
      // Verifica se o usuário existe e busca o tipo
      const usuario = await UsuarioModel.buscarPorIdComTipo(usuario_id);
      if (!usuario) {
        logError('Usuário não encontrado para criar professor', 'service', { usuario_id });
        return null;
      }

      // Verifica se o usuário é do tipo PROFESSOR
      if (usuario.nome_tipo !== TipoUsuario.PROFESSOR) {
        logError('Usuário não é do tipo PROFESSOR', 'service', { usuario_id, tipo: usuario.nome_tipo });
        return null;
      }

      // Verifica se já existe um professor para este usuário
      const professorExistente = await ProfessorModel.buscarPorUsuarioId(usuario_id);
      if (professorExistente) {
        logError('Já existe um professor para este usuário', 'service', { usuario_id });
        return null;
      }

      // Cria o professor
      const novoProfessor = await ProfessorModel.criar({ usuario_id });
      
      logSuccess('Professor criado com sucesso', 'service', { 
        professor_id: novoProfessor.professor_id, 
        usuario_id 
      });
      
      return novoProfessor;
    } catch (error) {
      logError('Erro ao criar professor', 'service', error);
      throw error;
    }
  }

  static async buscarPorId(professor_id: string): Promise<any | null> {
    try {
      const professor = await ProfessorModel.buscarComUsuario(professor_id);
      if (!professor) {
        logError('Professor não encontrado', 'service', { professor_id });
        return null;
      }

      logSuccess('Professor encontrado', 'service', { professor_id });
      return professor;
    } catch (error) {
      logError('Erro ao buscar professor', 'service', error);
      throw error;
    }
  }

  static async buscarPorUsuarioId(usuario_id: string): Promise<any | null> {
    try {
      const professor = await ProfessorModel.buscarPorUsuarioId(usuario_id);
      if (!professor) {
        logError('Professor não encontrado para este usuário', 'service', { usuario_id });
        return null;
      }

      // Busca dados completos do professor
      const professorCompleto = await ProfessorModel.buscarComUsuario(professor.professor_id);
      
      logSuccess('Professor encontrado por usuario_id', 'service', { 
        professor_id: professor.professor_id, 
        usuario_id 
      });
      
      return professorCompleto;
    } catch (error) {
      logError('Erro ao buscar professor por usuario_id', 'service', error);
      throw error;
    }
  }

  static async listarTodos(): Promise<any[]> {
    try {
      const professores = await ProfessorModel.listarComUsuarios();
      
      logSuccess('Lista de professores obtida', 'service', { 
        total: professores.length 
      });
      
      return professores;
    } catch (error) {
      logError('Erro ao listar professores', 'service', error);
      throw error;
    }
  }

  static async deletarProfessor(professor_id: string): Promise<boolean> {
    try {
      // Verifica se o professor existe
      const professor = await ProfessorModel.buscarPorId(professor_id);
      if (!professor) {
        logError('Professor não encontrado para deletar', 'service', { professor_id });
        return false;
      }

      // Deleta o professor
      const deletado = await ProfessorModel.deletar(professor_id);
      
      if (deletado) {
        logSuccess('Professor deletado com sucesso', 'service', { professor_id });
      } else {
        logError('Falha ao deletar professor', 'service', { professor_id });
      }
      
      return deletado;
    } catch (error) {
      logError('Erro ao deletar professor', 'service', error);
      throw error;
    }
  }

  static async listarProfessoresComTurmas(): Promise<any[]> {
    try {
      const professores = await ProfessorModel.listarProfessoresComTurmas();
      
      logSuccess('Lista de usuários do tipo professor com turmas obtida', 'service', { 
        total: professores.length 
      });
      
      return professores;
    } catch (error) {
      logError('Erro ao listar usuários do tipo professor com turmas', 'service', error);
      throw error;
    }
  }

  static async listarTurmasProfessor(professorId: string): Promise<any[]> {
    try {
      const turmas = await ProfessorModel.listarTurmasProfessor(professorId);
      
      logSuccess('Lista de turmas do professor obtida', 'service', { 
        professorId,
        total: turmas.length 
      });
      
      return turmas;
    } catch (error) {
      logError('Erro ao listar turmas do professor', 'service', error);
      throw error;
    }
  }
}

export default ProfessorService;
