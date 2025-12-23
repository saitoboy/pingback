import { Request, Response } from 'express';
import ConteudoAulaService from '../services/conteudoAula.service';
import { TipoUsuario } from '../types/models';
import '../middleware/auth.middleware'; // Importa para carregar a extensão global
import logger from '../utils/logger';

class ConteudoAulaController {

  /**
   * Listar todos os conteúdos de aula
   * GET /conteudo-aula
   */
  static async listarConteudos(req: Request, res: Response): Promise<void> {
    try {
      logger.info('📚 Requisição para listar conteúdos de aula', 'conteudo-aula');
      
      const conteudos = await ConteudoAulaService.listarConteudos();

      res.status(200).json({
        sucesso: true,
        mensagem: 'Lista de conteúdos de aula obtida com sucesso',
        dados: conteudos,
        total: conteudos.length
      });
    } catch (error) {
      logger.error('❌ Erro no controller ao listar conteúdos', 'conteudo-aula', error);
      res.status(500).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  /**
   * Buscar conteúdo por ID
   * GET /conteudo-aula/:id
   */
  static async buscarConteudoPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id || !id.trim()) {
        res.status(400).json({
          sucesso: false,
          mensagem: 'ID do conteúdo é obrigatório'
        });
        return;
      }

      logger.info(`🔍 Requisição para buscar conteúdo: ${id}`, 'conteudo-aula');
      
      const conteudo = await ConteudoAulaService.buscarConteudoPorId(id);

      res.status(200).json({
        sucesso: true,
        mensagem: 'Conteúdo de aula encontrado com sucesso',
        dados: conteudo
      });
    } catch (error) {
      logger.error('❌ Erro no controller ao buscar conteúdo', 'conteudo-aula', error);
      const statusCode = error instanceof Error && error.message.includes('não encontrado') ? 404 : 500;
      res.status(statusCode).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  /**
   * Buscar conteúdos por aula
   * GET /conteudo-aula/aula/:aula_id
   */
  static async buscarConteudosPorAula(req: Request, res: Response): Promise<void> {
    try {
      const { aula_id } = req.params;
      
      if (!aula_id || !aula_id.trim()) {
        res.status(400).json({
          sucesso: false,
          mensagem: 'ID da aula é obrigatório'
        });
        return;
      }

      logger.info(`🔍 Requisição para buscar conteúdos da aula: ${aula_id}`, 'conteudo-aula');
      
      const conteudos = await ConteudoAulaService.buscarConteudosPorAula(aula_id);

      res.status(200).json({
        sucesso: true,
        mensagem: 'Conteúdos da aula encontrados com sucesso',
        dados: conteudos,
        total: conteudos.length
      });
    } catch (error) {
      logger.error('❌ Erro no controller ao buscar conteúdos por aula', 'conteudo-aula', error);
      res.status(500).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  /**
   * Criar novo conteúdo de aula
   * POST /conteudo-aula
   */
  static async criarConteudo(req: Request, res: Response): Promise<void> {
    try {
      const { aula_id, turma_disciplina_professor_id, data_aula, descricao, conteudo } = req.body;

      // Validação: precisa ter aula_id OU (turma_disciplina_professor_id + data_aula)
      if ((!aula_id && (!turma_disciplina_professor_id || !data_aula)) || !descricao || !conteudo) {
        res.status(400).json({
          sucesso: false,
          mensagem: 'É necessário fornecer: (aula_id) OU (turma_disciplina_professor_id + data_aula), descrição e conteúdo'
        });
        return;
      }

      logger.info(`📝 Requisição para criar conteúdo: ${descricao}`, 'conteudo-aula');

      const novoConteudo = await ConteudoAulaService.criarConteudo({
        aula_id,
        turma_disciplina_professor_id,
        data_aula,
        descricao,
        conteudo
      });

      res.status(201).json({
        sucesso: true,
        mensagem: 'Conteúdo de aula criado com sucesso',
        dados: novoConteudo
      });
    } catch (error) {
      logger.error('❌ Erro no controller ao criar conteúdo', 'conteudo-aula', error);
      const statusCode = error instanceof Error && 
        (error.message.includes('obrigatório') || 
         error.message.includes('caracteres') ||
         error.message.includes('não encontrada')) ? 400 : 500;
      
      res.status(statusCode).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  /**
   * Buscar conteúdos por data e vinculação
   * GET /conteudo-aula/data/:vinculacaoId/:data
   */
  static async buscarConteudosPorDataEVinculacao(req: Request, res: Response): Promise<void> {
    try {
      const { vinculacaoId, data } = req.params;
      
      if (!vinculacaoId || !data) {
        res.status(400).json({
          sucesso: false,
          mensagem: 'ID da vinculação e data são obrigatórios'
        });
        return;
      }

      logger.info(`🔍 Requisição para buscar conteúdos da vinculação ${vinculacaoId} e data ${data}`, 'conteudo-aula');
      
      const conteudos = await ConteudoAulaService.buscarConteudosPorDataEVinculacao(vinculacaoId, data);

      res.status(200).json({
        sucesso: true,
        mensagem: 'Conteúdos da data encontrados com sucesso',
        dados: conteudos,
        total: conteudos.length
      });
    } catch (error) {
      logger.error('❌ Erro no controller ao buscar conteúdos por data e vinculação', 'conteudo-aula', error);
      res.status(500).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  /**
   * Atualizar conteúdo de aula
   * PUT /conteudo-aula/:id
   */
  static async atualizarConteudo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { descricao, conteudo } = req.body;
      const usuario = req.usuario!;

      if (!id || !id.trim()) {
        res.status(400).json({
          sucesso: false,
          mensagem: 'ID do conteúdo é obrigatório'
        });
        return;
      }

      if (!descricao && !conteudo) {
        res.status(400).json({
          sucesso: false,
          mensagem: 'Pelo menos um campo (descrição ou conteúdo) deve ser fornecido'
        });
        return;
      }

      logger.info(`📝 Requisição para atualizar conteúdo: ${id}`, 'conteudo-aula');

      // Se for professor, verificar se tem acesso ao conteúdo
      if (usuario.tipo_usuario_id === TipoUsuario.PROFESSOR) {
        const temAcesso = await ConteudoAulaService.verificarAcessoProfessor(id, usuario.usuario_id);
        
        if (!temAcesso) {
          logger.warning(`⚠️ Professor ${usuario.usuario_id} tentou atualizar conteúdo ${id} sem permissão`, 'conteudo-aula');
          res.status(403).json({
            sucesso: false,
            mensagem: 'Você só pode atualizar conteúdos de suas próprias aulas'
          });
          return;
        }
      }

      const conteudoAtualizado = await ConteudoAulaService.atualizarConteudo(id, {
        descricao,
        conteudo
      });

      res.status(200).json({
        sucesso: true,
        mensagem: 'Conteúdo de aula atualizado com sucesso',
        dados: conteudoAtualizado
      });
    } catch (error) {
      logger.error('❌ Erro no controller ao atualizar conteúdo', 'conteudo-aula', error);
      const statusCode = error instanceof Error && 
        (error.message.includes('não encontrado') || 
         error.message.includes('obrigatório') ||
         error.message.includes('caracteres')) ? 404 : 500;
      
      res.status(statusCode).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  /**
   * Deletar conteúdo de aula
   * DELETE /conteudo-aula/:id
   */
  static async deletarConteudo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const usuario = req.usuario!;

      if (!id || !id.trim()) {
        res.status(400).json({
          sucesso: false,
          mensagem: 'ID do conteúdo é obrigatório'
        });
        return;
      }

      logger.info(`🗑️ Requisição para deletar conteúdo: ${id}`, 'conteudo-aula');

      // Se for professor, verificar se tem acesso ao conteúdo
      if (usuario.tipo_usuario_id === TipoUsuario.PROFESSOR) {
        const temAcesso = await ConteudoAulaService.verificarAcessoProfessor(id, usuario.usuario_id);
        
        if (!temAcesso) {
          logger.warning(`⚠️ Professor ${usuario.usuario_id} tentou deletar conteúdo ${id} sem permissão`, 'conteudo-aula');
          res.status(403).json({
            sucesso: false,
            mensagem: 'Você só pode deletar conteúdos de suas próprias aulas'
          });
          return;
        }
      }

      await ConteudoAulaService.deletarConteudo(id);

      res.status(200).json({
        sucesso: true,
        mensagem: 'Conteúdo de aula deletado com sucesso'
      });
    } catch (error) {
      logger.error('❌ Erro no controller ao deletar conteúdo', 'conteudo-aula', error);
      const statusCode = error instanceof Error && error.message.includes('não encontrado') ? 404 : 500;
      res.status(statusCode).json({
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }
}

export default ConteudoAulaController;
