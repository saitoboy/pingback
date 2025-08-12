import { Request, Response } from 'express';
import { BoletimService } from '../services/boletim.service';
import logger from '../utils/logger';

export class BoletimController {

  // ================ CRUD BÁSICO BOLETIM ================

  static async listarTodos(req: Request, res: Response): Promise<void> {
    try {
      logger.info('Controller: Listando todos os boletins');
      const boletins = await BoletimService.listarTodos();
      
      res.status(200).json({
        success: true,
        data: boletins,
        message: 'Boletins listados com sucesso'
      });
    } catch (error) {
      logger.error('Erro no controller ao listar boletins:', 'BoletimController', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const { boletim_id } = req.params;
      logger.info(`Controller: Buscando boletim por ID: ${boletim_id}`);
      
      const boletim = await BoletimService.buscarPorId(boletim_id);
      
      if (!boletim) {
        res.status(404).json({
          success: false,
          message: 'Boletim não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: boletim,
        message: 'Boletim encontrado com sucesso'
      });
    } catch (error) {
      logger.error(`Erro no controller ao buscar boletim por ID:`, 'BoletimController', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async criar(req: Request, res: Response): Promise<void> {
    try {
      const dadosBoletim = req.body;
      logger.info('Controller: Criando novo boletim');
      
      // Validações básicas
      if (!dadosBoletim.matricula_aluno_id) {
        res.status(400).json({
          success: false,
          message: 'ID da matrícula do aluno é obrigatório'
        });
        return;
      }

      if (!dadosBoletim.periodo_letivo_id) {
        res.status(400).json({
          success: false,
          message: 'ID do período letivo é obrigatório'
        });
        return;
      }

      const novoBoletim = await BoletimService.criar(dadosBoletim);
      
      res.status(201).json({
        success: true,
        data: novoBoletim,
        message: 'Boletim criado com sucesso'
      });
    } catch (error) {
      logger.error('Erro no controller ao criar boletim:', 'BoletimController', error);
      
      if (error instanceof Error && error.message.includes('Já existe')) {
        res.status(409).json({
          success: false,
          message: error.message
        });
      } else if (error instanceof Error && error.message.includes('não encontrad')) {
        res.status(404).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor',
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }
  }

  static async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { boletim_id } = req.params;
      const dadosAtualizacao = req.body;
      logger.info(`Controller: Atualizando boletim ID: ${boletim_id}`);
      
      const boletimAtualizado = await BoletimService.atualizar(boletim_id, dadosAtualizacao);
      
      if (!boletimAtualizado) {
        res.status(404).json({
          success: false,
          message: 'Boletim não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: boletimAtualizado,
        message: 'Boletim atualizado com sucesso'
      });
    } catch (error) {
      logger.error(`Erro no controller ao atualizar boletim:`, 'BoletimController', error);
      
      if (error instanceof Error && error.message.includes('Já existe')) {
        res.status(409).json({
          success: false,
          message: error.message
        });
      } else if (error instanceof Error && error.message.includes('não encontrad')) {
        res.status(404).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor',
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }
  }

  static async excluir(req: Request, res: Response): Promise<void> {
    try {
      const { boletim_id } = req.params;
      logger.info(`Controller: Excluindo boletim ID: ${boletim_id}`);
      
      const sucesso = await BoletimService.excluir(boletim_id);
      
      if (!sucesso) {
        res.status(404).json({
          success: false,
          message: 'Boletim não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Boletim excluído com sucesso'
      });
    } catch (error) {
      logger.error(`Erro no controller ao excluir boletim:`, 'BoletimController', error);
      
      if (error instanceof Error && error.message.includes('possui disciplinas')) {
        res.status(409).json({
          success: false,
          message: error.message
        });
      } else if (error instanceof Error && error.message.includes('não encontrad')) {
        res.status(404).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor',
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }
  }

  // ================ CONSULTAS COM RELACIONAMENTOS ================

  static async buscarComDetalhes(req: Request, res: Response): Promise<void> {
    try {
      const { boletim_id } = req.params;
      logger.info(`Controller: Buscando boletim com detalhes ID: ${boletim_id}`);
      
      const boletimDetalhes = await BoletimService.buscarComDetalhes(boletim_id);
      
      if (!boletimDetalhes) {
        res.status(404).json({
          success: false,
          message: 'Boletim não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: boletimDetalhes,
        message: 'Boletim com detalhes encontrado com sucesso'
      });
    } catch (error) {
      logger.error(`Erro no controller ao buscar boletim com detalhes:`, 'BoletimController', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async listarComDetalhes(req: Request, res: Response): Promise<void> {
    try {
      logger.info('Controller: Listando todos os boletins com detalhes');
      const boletinsDetalhes = await BoletimService.buscarComDetalhes();
      
      res.status(200).json({
        success: true,
        data: boletinsDetalhes,
        message: 'Boletins com detalhes listados com sucesso'
      });
    } catch (error) {
      logger.error('Erro no controller ao listar boletins com detalhes:', 'BoletimController', error);
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
      logger.info(`Controller: Buscando boletins por matrícula: ${matricula_aluno_id}`);
      
      const boletins = await BoletimService.buscarPorMatricula(matricula_aluno_id);
      
      res.status(200).json({
        success: true,
        data: boletins,
        message: 'Boletins encontrados com sucesso'
      });
    } catch (error) {
      logger.error(`Erro no controller ao buscar boletins por matrícula:`, 'BoletimController', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async buscarPorPeriodo(req: Request, res: Response): Promise<void> {
    try {
      const { periodo_letivo_id } = req.params;
      logger.info(`Controller: Buscando boletins por período: ${periodo_letivo_id}`);
      
      const boletins = await BoletimService.buscarPorPeriodo(periodo_letivo_id);
      
      res.status(200).json({
        success: true,
        data: boletins,
        message: 'Boletins encontrados com sucesso'
      });
    } catch (error) {
      logger.error(`Erro no controller ao buscar boletins por período:`, 'BoletimController', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // ================ CRUD BOLETIM DISCIPLINA ================

  static async listarDisciplinasBoletim(req: Request, res: Response): Promise<void> {
    try {
      const { boletim_id } = req.params;
      logger.info(`Controller: Listando disciplinas do boletim ID: ${boletim_id}`);
      
      const disciplinas = await BoletimService.listarDisciplinasBoletim(boletim_id);
      
      res.status(200).json({
        success: true,
        data: disciplinas,
        message: 'Disciplinas do boletim listadas com sucesso'
      });
    } catch (error) {
      logger.error(`Erro no controller ao listar disciplinas do boletim:`, 'BoletimController', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async buscarDisciplinaPorId(req: Request, res: Response): Promise<void> {
    try {
      const { boletim_disciplina_id } = req.params;
      logger.info(`Controller: Buscando disciplina do boletim por ID: ${boletim_disciplina_id}`);
      
      const disciplina = await BoletimService.buscarDisciplinaPorId(boletim_disciplina_id);
      
      if (!disciplina) {
        res.status(404).json({
          success: false,
          message: 'Disciplina do boletim não encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: disciplina,
        message: 'Disciplina do boletim encontrada com sucesso'
      });
    } catch (error) {
      logger.error(`Erro no controller ao buscar disciplina do boletim:`, 'BoletimController', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async criarDisciplinaBoletim(req: Request, res: Response): Promise<void> {
    try {
      const dadosDisciplina = req.body;
      logger.info('Controller: Criando disciplina do boletim');
      
      // Validações básicas
      if (!dadosDisciplina.boletim_id) {
        res.status(400).json({
          success: false,
          message: 'ID do boletim é obrigatório'
        });
        return;
      }

      if (!dadosDisciplina.disciplina_id) {
        res.status(400).json({
          success: false,
          message: 'ID da disciplina é obrigatório'
        });
        return;
      }

      if (dadosDisciplina.media_bimestre === undefined || dadosDisciplina.media_bimestre === null) {
        res.status(400).json({
          success: false,
          message: 'Média do bimestre é obrigatória'
        });
        return;
      }

      if (dadosDisciplina.faltas_bimestre === undefined || dadosDisciplina.faltas_bimestre === null) {
        res.status(400).json({
          success: false,
          message: 'Faltas do bimestre é obrigatório'
        });
        return;
      }

      const novaDisciplina = await BoletimService.criarDisciplinaBoletim(dadosDisciplina);
      
      res.status(201).json({
        success: true,
        data: novaDisciplina,
        message: 'Disciplina do boletim criada com sucesso'
      });
    } catch (error) {
      logger.error('Erro no controller ao criar disciplina do boletim:', 'BoletimController', error);
      
      if (error instanceof Error && error.message.includes('já está vinculada')) {
        res.status(409).json({
          success: false,
          message: error.message
        });
      } else if (error instanceof Error && error.message.includes('não encontrad')) {
        res.status(404).json({
          success: false,
          message: error.message
        });
      } else if (error instanceof Error && error.message.includes('deve estar entre')) {
        res.status(400).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor',
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }
  }

  static async atualizarDisciplinaBoletim(req: Request, res: Response): Promise<void> {
    try {
      const { boletim_disciplina_id } = req.params;
      const dadosAtualizacao = req.body;
      logger.info(`Controller: Atualizando disciplina do boletim ID: ${boletim_disciplina_id}`);
      
      const disciplinaAtualizada = await BoletimService.atualizarDisciplinaBoletim(boletim_disciplina_id, dadosAtualizacao);
      
      if (!disciplinaAtualizada) {
        res.status(404).json({
          success: false,
          message: 'Disciplina do boletim não encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: disciplinaAtualizada,
        message: 'Disciplina do boletim atualizada com sucesso'
      });
    } catch (error) {
      logger.error(`Erro no controller ao atualizar disciplina do boletim:`, 'BoletimController', error);
      
      if (error instanceof Error && error.message.includes('já está vinculada')) {
        res.status(409).json({
          success: false,
          message: error.message
        });
      } else if (error instanceof Error && error.message.includes('deve estar entre')) {
        res.status(400).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor',
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }
  }

  static async excluirDisciplinaBoletim(req: Request, res: Response): Promise<void> {
    try {
      const { boletim_disciplina_id } = req.params;
      logger.info(`Controller: Excluindo disciplina do boletim ID: ${boletim_disciplina_id}`);
      
      const sucesso = await BoletimService.excluirDisciplinaBoletim(boletim_disciplina_id);
      
      if (!sucesso) {
        res.status(404).json({
          success: false,
          message: 'Disciplina do boletim não encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Disciplina do boletim excluída com sucesso'
      });
    } catch (error) {
      logger.error(`Erro no controller ao excluir disciplina do boletim:`, 'BoletimController', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // ================ CONSULTAS COMPLEXAS ================

  static async buscarBoletimCompleto(req: Request, res: Response): Promise<void> {
    try {
      const { boletim_id } = req.params;
      logger.info(`Controller: Buscando boletim completo ID: ${boletim_id}`);
      
      const boletimCompleto = await BoletimService.buscarBoletimCompleto(boletim_id);
      
      if (!boletimCompleto) {
        res.status(404).json({
          success: false,
          message: 'Boletim não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: boletimCompleto,
        message: 'Boletim completo encontrado com sucesso'
      });
    } catch (error) {
      logger.error(`Erro no controller ao buscar boletim completo:`, 'BoletimController', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async gerarEstatisticas(req: Request, res: Response): Promise<void> {
    try {
      const { periodo_letivo_id } = req.query;
      logger.info('Controller: Gerando estatísticas de boletins');
      
      const estatisticas = await BoletimService.gerarEstatisticas(periodo_letivo_id as string);
      
      res.status(200).json({
        success: true,
        data: estatisticas,
        message: 'Estatísticas geradas com sucesso'
      });
    } catch (error) {
      logger.error('Erro no controller ao gerar estatísticas:', 'BoletimController', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async gerarBoletimAutomatico(req: Request, res: Response): Promise<void> {
    try {
      const { matricula_aluno_id, periodo_letivo_id } = req.body;
      logger.info('Controller: Gerando boletim automático');
      
      // Validações básicas
      if (!matricula_aluno_id) {
        res.status(400).json({
          success: false,
          message: 'ID da matrícula do aluno é obrigatório'
        });
        return;
      }

      if (!periodo_letivo_id) {
        res.status(400).json({
          success: false,
          message: 'ID do período letivo é obrigatório'
        });
        return;
      }

      const boletimGerado = await BoletimService.gerarBoletimAutomatico(matricula_aluno_id, periodo_letivo_id);
      
      res.status(201).json({
        success: true,
        data: boletimGerado,
        message: 'Boletim automático gerado com sucesso'
      });
    } catch (error) {
      logger.error('Erro no controller ao gerar boletim automático:', 'BoletimController', error);
      
      if (error instanceof Error && error.message.includes('Já existe')) {
        res.status(409).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor',
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }
  }
}
