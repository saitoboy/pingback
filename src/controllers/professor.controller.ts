import { Request, Response } from 'express';
import ProfessorService from '../services/professor.service';
import { logError, logSuccess } from '../utils/logger';

export class ProfessorController {
  
  static async criar(req: Request, res: Response) {
    try {
      const camposEsperados = ['usuario_id'];
      const camposFaltando = camposEsperados.filter(campo => !(campo in req.body));
      
      if (camposFaltando.length > 0) {
        logError(`Erro ao criar professor: campos ausentes: ${camposFaltando.join(', ')}`, 'controller', req.body);
        return res.status(400).json({ 
          mensagem: `Campos obrigatórios ausentes: ${camposFaltando.join(', ')}` 
        });
      }

      const { usuario_id } = req.body;
      
      if (!usuario_id) {
        logError('Erro ao criar professor: usuario_id sem valor', 'controller', req.body);
        return res.status(400).json({ 
          mensagem: 'Campo usuario_id é obrigatório e não pode estar vazio.' 
        });
      }

      const novoProfessor = await ProfessorService.criarProfessor(usuario_id);
      
      if (!novoProfessor) {
        logError(`Erro ao criar professor: falha na criação para usuario_id ${usuario_id}`, 'controller', { usuario_id });
        return res.status(400).json({ 
          mensagem: 'Não foi possível criar o professor. Verifique se o usuário existe, é do tipo PROFESSOR e não possui cadastro de professor.' 
        });
      }

      logSuccess(`Professor criado com sucesso: ${novoProfessor.professor_id}`, 'controller', { 
        professor_id: novoProfessor.professor_id,
        usuario_id 
      });
      
      return res.status(201).json({ 
        mensagem: 'Professor criado com sucesso.',
        professor: novoProfessor 
      });
      
    } catch (error: any) {
      if (error.code === '23503') {
        logError('Erro ao criar professor: usuário não existe (FK constraint)', 'controller', error);
        return res.status(400).json({ 
          mensagem: 'Usuário não encontrado. Verifique se o usuario_id é válido.' 
        });
      }
      
      if (error.code === '23505') {
        logError('Erro ao criar professor: já existe professor para este usuário', 'controller', error);
        return res.status(409).json({ 
          mensagem: 'Já existe um professor cadastrado para este usuário.' 
        });
      }
      
      logError('Erro inesperado ao criar professor', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async buscarPorId(req: Request, res: Response) {
    try {
      const { professor_id } = req.params;
      
      if (!professor_id) {
        logError('Erro ao buscar professor: professor_id não fornecido', 'controller', req.params);
        return res.status(400).json({ 
          mensagem: 'ID do professor é obrigatório.' 
        });
      }

      const professor = await ProfessorService.buscarPorId(professor_id);
      
      if (!professor) {
        logError(`Professor não encontrado: ${professor_id}`, 'controller', { professor_id });
        return res.status(404).json({ 
          mensagem: 'Professor não encontrado.' 
        });
      }

      logSuccess(`Professor encontrado: ${professor_id}`, 'controller', { professor_id });
      return res.status(200).json({ professor });
      
    } catch (error: any) {
      logError('Erro inesperado ao buscar professor', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async listar(req: Request, res: Response) {
    try {
      const professores = await ProfessorService.listarTodos();
      
      logSuccess('Lista de professores obtida com sucesso', 'controller', { 
        total: professores.length 
      });
      
      return res.status(200).json({ 
        professores,
        total: professores.length 
      });
      
    } catch (error: any) {
      logError('Erro inesperado ao listar professores', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async buscarMeuPerfil(req: Request, res: Response) {
    try {
      if (!req.usuario) {
        logError('Usuário não autenticado ao buscar perfil de professor', 'controller');
        return res.status(401).json({ 
          mensagem: 'Usuário não autenticado.' 
        });
      }

      const professor = await ProfessorService.buscarPorUsuarioId(req.usuario.usuario_id);
      
      if (!professor) {
        logError(`Perfil de professor não encontrado para usuário: ${req.usuario.usuario_id}`, 'controller', { 
          usuario_id: req.usuario.usuario_id 
        });
        return res.status(404).json({ 
          mensagem: 'Perfil de professor não encontrado para este usuário.' 
        });
      }

      logSuccess(`Perfil de professor encontrado: ${professor.professor_id}`, 'controller', { 
        professor_id: professor.professor_id,
        usuario_id: req.usuario.usuario_id 
      });
      
      return res.status(200).json({ professor });
      
    } catch (error: any) {
      logError('Erro inesperado ao buscar perfil de professor', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async deletar(req: Request, res: Response) {
    try {
      const { professor_id } = req.params;
      
      if (!professor_id) {
        logError('Erro ao deletar professor: professor_id não fornecido', 'controller', req.params);
        return res.status(400).json({ 
          mensagem: 'ID do professor é obrigatório.' 
        });
      }

      const deletado = await ProfessorService.deletarProfessor(professor_id);
      
      if (!deletado) {
        logError(`Professor não encontrado para deletar: ${professor_id}`, 'controller', { professor_id });
        return res.status(404).json({ 
          mensagem: 'Professor não encontrado.' 
        });
      }

      logSuccess(`Professor deletado com sucesso: ${professor_id}`, 'controller', { professor_id });
      return res.status(200).json({ 
        mensagem: 'Professor deletado com sucesso.' 
      });
      
    } catch (error: any) {
      logError('Erro inesperado ao deletar professor', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async listarComTurmas(req: Request, res: Response) {
    try {
      const professores = await ProfessorService.listarProfessoresComTurmas();
      
      logSuccess('Lista de usuários do tipo professor com turmas obtida com sucesso', 'controller', { 
        total: professores.length 
      });
      
      return res.status(200).json({ 
        professores,
        total: professores.length 
      });
      
    } catch (error: any) {
      logError('Erro inesperado ao listar usuários do tipo professor com turmas', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async listarTurmasProfessor(req: Request, res: Response) {
    try {
      const { professorId } = req.params;
      
      if (!professorId) {
        logError('Erro ao buscar turmas do professor: professorId não fornecido', 'controller', req.params);
        return res.status(400).json({ 
          mensagem: 'ID do professor é obrigatório.' 
        });
      }

      const turmas = await ProfessorService.listarTurmasProfessor(professorId);
      
      logSuccess('Lista de turmas do professor obtida com sucesso', 'controller', { 
        professorId,
        total: turmas.length 
      });
      
      return res.status(200).json({ 
        turmas,
        total: turmas.length 
      });
      
    } catch (error: any) {
      logError('Erro inesperado ao listar turmas do professor', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }
}

export default ProfessorController;
