import * as ConteudoAulaModel from '../model/conteudoAula.model';
import { ConteudoAula } from '../types/models';
import logger from '../utils/logger';

class ConteudoAulaService {

  /**
   * Listar todos os conteúdos de aula
   */
  static async listarConteudos(): Promise<any[]> {
    try {
      logger.info('📚 Listando conteúdos de aula', 'conteudo-aula');
      const conteudos = await ConteudoAulaModel.buscarComDetalhes();
      logger.success(`✅ ${Array.isArray(conteudos) ? conteudos.length : 0} conteúdos encontrados`, 'conteudo-aula');
      return Array.isArray(conteudos) ? conteudos : [];
    } catch (error) {
      logger.error('❌ Erro ao listar conteúdos de aula', 'conteudo-aula', error);
      throw new Error('Erro interno ao listar conteúdos de aula');
    }
  }

  /**
   * Buscar conteúdo por ID
   */
  static async buscarConteudoPorId(conteudo_aula_id: string): Promise<any> {
    try {
      if (!conteudo_aula_id?.trim()) {
        throw new Error('ID do conteúdo é obrigatório');
      }

      logger.info(`🔍 Buscando conteúdo de aula: ${conteudo_aula_id}`, 'conteudo-aula');
      const conteudo = await ConteudoAulaModel.buscarComDetalhes(conteudo_aula_id);

      if (!conteudo) {
        logger.warning(`⚠️ Conteúdo não encontrado: ${conteudo_aula_id}`, 'conteudo-aula');
        throw new Error('Conteúdo de aula não encontrado');
      }

      logger.success(`✅ Conteúdo encontrado: ${conteudo?.descricao || 'N/A'}`, 'conteudo-aula');
      return conteudo;
    } catch (error) {
      logger.error('❌ Erro ao buscar conteúdo de aula', 'conteudo-aula', error);
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno ao buscar conteúdo de aula');
    }
  }

  /**
   * Buscar conteúdos por aula
   */
  static async buscarConteudosPorAula(aula_id: string): Promise<ConteudoAula[]> {
    try {
      if (!aula_id?.trim()) {
        throw new Error('ID da aula é obrigatório');
      }

      logger.info(`🔍 Buscando conteúdos da aula: ${aula_id}`, 'conteudo-aula');
      const conteudos = await ConteudoAulaModel.buscarPorAula(aula_id);
      
      logger.success(`✅ ${conteudos.length} conteúdos encontrados para a aula`, 'conteudo-aula');
      return conteudos;
    } catch (error) {
      logger.error('❌ Erro ao buscar conteúdos por aula', 'conteudo-aula', error);
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno ao buscar conteúdos por aula');
    }
  }

  /**
   * Criar novo conteúdo de aula
   */
  static async criarConteudo(dadosConteudo: {
    aula_id?: string;
    turma_disciplina_professor_id?: string;
    data_aula?: string;
    descricao: string;
    conteudo: string;
  }): Promise<ConteudoAula> {
    try {
      logger.info(`📝 Dados recebidos: ${JSON.stringify(dadosConteudo)}`, 'conteudo-aula');
      
      // Validações
      // aula_id agora é opcional, mas precisa ter data_aula + turma_disciplina_professor_id ou aula_id
      if (!dadosConteudo.aula_id?.trim() && (!dadosConteudo.turma_disciplina_professor_id?.trim() || !dadosConteudo.data_aula)) {
        throw new Error('É necessário fornecer aula_id OU (turma_disciplina_professor_id + data_aula)');
      }

      if (!dadosConteudo.descricao?.trim()) {
        throw new Error('Descrição do conteúdo é obrigatória');
      }

      if (dadosConteudo.descricao.length < 3) {
        throw new Error('Descrição deve ter pelo menos 3 caracteres');
      }

      if (dadosConteudo.descricao.length > 255) {
        throw new Error('Descrição deve ter no máximo 255 caracteres');
      }

      if (!dadosConteudo.conteudo?.trim()) {
        throw new Error('Conteúdo da aula é obrigatório');
      }

      if (dadosConteudo.conteudo.length < 5) {
        throw new Error('Conteúdo deve ter pelo menos 5 caracteres');
      }

      logger.info(`📝 Criando conteúdo de aula: ${dadosConteudo.descricao}`, 'conteudo-aula');
      
      // Converter data_aula string (YYYY-MM-DD) para Date no timezone local
      let dataAulaDate: Date | undefined = undefined;
      if (dadosConteudo.data_aula) {
        // Se for string no formato YYYY-MM-DD, criar data no timezone local
        if (typeof dadosConteudo.data_aula === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dadosConteudo.data_aula)) {
          const [ano, mes, dia] = dadosConteudo.data_aula.split('-').map(Number);
          dataAulaDate = new Date(ano, mes - 1, dia, 0, 0, 0, 0);
        } else {
          dataAulaDate = new Date(dadosConteudo.data_aula);
        }
      }
      
      const novoConteudo = await ConteudoAulaModel.criar({
        aula_id: dadosConteudo.aula_id?.trim(),
        turma_disciplina_professor_id: dadosConteudo.turma_disciplina_professor_id?.trim(),
        data_aula: dataAulaDate,
        descricao: dadosConteudo.descricao.trim(),
        conteudo: dadosConteudo.conteudo.trim()
      });

      logger.success(`🎉 Conteúdo criado com sucesso: ${novoConteudo.descricao}`, 'conteudo-aula');
      return novoConteudo;

    } catch (error) {
      logger.error('❌ Erro ao criar conteúdo de aula', 'conteudo-aula', error);
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno ao criar conteúdo de aula');
    }
  }

  // NOVO: Buscar conteúdos por data e vinculação
  static async buscarConteudosPorDataEVinculacao(
    turma_disciplina_professor_id: string,
    data_aula: string
  ): Promise<ConteudoAula[]> {
    try {
      if (!turma_disciplina_professor_id?.trim()) {
        throw new Error('ID da vinculação é obrigatório');
      }

      if (!data_aula?.trim()) {
        throw new Error('Data da aula é obrigatória');
      }

      logger.info(`🔍 Buscando conteúdos da vinculação ${turma_disciplina_professor_id} e data ${data_aula}`, 'conteudo-aula');
      const conteudos = await ConteudoAulaModel.buscarPorDataEVinculacao(turma_disciplina_professor_id, data_aula);
      
      logger.success(`✅ ${conteudos.length} conteúdos encontrados para a data`, 'conteudo-aula');
      return conteudos;
    } catch (error) {
      logger.error('❌ Erro ao buscar conteúdos por data e vinculação', 'conteudo-aula', error);
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno ao buscar conteúdos por data e vinculação');
    }
  }

  /**
   * Atualizar conteúdo existente
   */
  static async atualizarConteudo(
    conteudo_aula_id: string,
    dadosAtualizacao: { descricao?: string; conteudo?: string }
  ): Promise<ConteudoAula> {
    try {
      if (!conteudo_aula_id?.trim()) {
        throw new Error('ID do conteúdo é obrigatório');
      }

      // Verificar se conteúdo existe
      await this.buscarConteudoPorId(conteudo_aula_id);

      // Validações dos dados
      if (dadosAtualizacao.descricao !== undefined) {
        if (!dadosAtualizacao.descricao.trim()) {
          throw new Error('Descrição do conteúdo é obrigatória');
        }

        if (dadosAtualizacao.descricao.length < 5) {
          throw new Error('Descrição deve ter pelo menos 5 caracteres');
        }

        if (dadosAtualizacao.descricao.length > 255) {
          throw new Error('Descrição deve ter no máximo 255 caracteres');
        }

        dadosAtualizacao.descricao = dadosAtualizacao.descricao.trim();
      }

      if (dadosAtualizacao.conteudo !== undefined) {
        if (!dadosAtualizacao.conteudo.trim()) {
          throw new Error('Conteúdo da aula é obrigatório');
        }

        if (dadosAtualizacao.conteudo.length < 10) {
          throw new Error('Conteúdo deve ter pelo menos 10 caracteres');
        }

        dadosAtualizacao.conteudo = dadosAtualizacao.conteudo.trim();
      }

      logger.info(`📝 Atualizando conteúdo de aula: ${conteudo_aula_id}`, 'conteudo-aula');
      
      const conteudoAtualizado = await ConteudoAulaModel.atualizar(conteudo_aula_id, dadosAtualizacao);

      if (!conteudoAtualizado) {
        throw new Error('Falha ao atualizar conteúdo de aula');
      }

      logger.success(`✅ Conteúdo atualizado: ${conteudoAtualizado.descricao}`, 'conteudo-aula');
      return conteudoAtualizado;

    } catch (error) {
      logger.error('❌ Erro ao atualizar conteúdo de aula', 'conteudo-aula', error);
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno ao atualizar conteúdo de aula');
    }
  }

  /**
   * Deletar conteúdo de aula
   */
  static async deletarConteudo(conteudo_aula_id: string): Promise<void> {
    try {
      if (!conteudo_aula_id?.trim()) {
        throw new Error('ID do conteúdo é obrigatório');
      }

      // Verificar se conteúdo existe
      const conteudo = await this.buscarConteudoPorId(conteudo_aula_id);

      logger.info(`🗑️ Deletando conteúdo de aula: ${conteudo.descricao}`, 'conteudo-aula');
      
      const sucesso = await ConteudoAulaModel.deletar(conteudo_aula_id);

      if (!sucesso) {
        throw new Error('Falha ao deletar conteúdo de aula');
      }

      logger.success(`✅ Conteúdo deletado: ${conteudo.descricao}`, 'conteudo-aula');

    } catch (error) {
      logger.error('❌ Erro ao deletar conteúdo de aula', 'conteudo-aula', error);
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno ao deletar conteúdo de aula');
    }
  }

  /**
   * Verificar se professor tem acesso ao conteúdo
   */
  static async verificarAcessoProfessor(conteudo_aula_id: string, professor_id: string): Promise<boolean> {
    try {
      if (!conteudo_aula_id?.trim() || !professor_id?.trim()) {
        return false;
      }

      logger.info(`🔐 Verificando acesso do professor ${professor_id} ao conteúdo ${conteudo_aula_id}`, 'conteudo-aula');
      
      const temAcesso = await ConteudoAulaModel.verificarAcessoProfessor(conteudo_aula_id, professor_id);
      
      logger.info(`${temAcesso ? '✅ Acesso permitido' : '❌ Acesso negado'}`, 'conteudo-aula');
      
      return temAcesso;
    } catch (error) {
      logger.error('❌ Erro ao verificar acesso do professor', 'conteudo-aula', error);
      return false;
    }
  }
}

export default ConteudoAulaService;
