import * as DisciplinaModel from '../model/disciplina.model';
import { CategoriaDisciplina, Disciplina } from '../types/models';
import logger from '../utils/logger';

const CATEGORIAS_VALIDAS: CategoriaDisciplina[] = ['base', 'especial'];

class DisciplinaService {

  /**
   * Listar todas as disciplinas ordenadas por nome
   */
  static async listarDisciplinas(): Promise<Disciplina[]> {
    try {
      logger.info('📚 Listando todas as disciplinas', 'disciplina');
      const disciplinas = await DisciplinaModel.listarTodas();
      logger.success(`✅ ${disciplinas.length} disciplinas encontradas`, 'disciplina');
      return disciplinas;
    } catch (error) {
      logger.error('❌ Erro ao listar disciplinas', 'disciplina', error);
      throw new Error('Erro interno ao listar disciplinas');
    }
  }

  /**
   * Buscar disciplina por ID
   */
  static async buscarDisciplinaPorId(disciplina_id: string): Promise<Disciplina> {
    try {
      if (!disciplina_id?.trim()) {
        throw new Error('ID da disciplina é obrigatório');
      }

      logger.info(`🔍 Buscando disciplina por ID: ${disciplina_id}`, 'disciplina');
      const disciplina = await DisciplinaModel.buscarPorId(disciplina_id);

      if (!disciplina) {
        logger.warning(`⚠️ Disciplina não encontrada: ${disciplina_id}`, 'disciplina');
        throw new Error('Disciplina não encontrada');
      }

      logger.success(`✅ Disciplina encontrada: ${disciplina.nome_disciplina}`, 'disciplina');
      return disciplina;
    } catch (error) {
      logger.error('❌ Erro ao buscar disciplina por ID', 'disciplina', error);
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno ao buscar disciplina');
    }
  }

  /**
   * Criar nova disciplina
   */
  static async criarDisciplina(dadosDisciplina: { nome_disciplina: string; categoria?: CategoriaDisciplina }): Promise<Disciplina> {
    try {
      // Validações
      if (!dadosDisciplina.nome_disciplina?.trim()) {
        throw new Error('Nome da disciplina é obrigatório');
      }

      if (dadosDisciplina.nome_disciplina.length < 2) {
        throw new Error('Nome da disciplina deve ter pelo menos 2 caracteres');
      }

      if (dadosDisciplina.nome_disciplina.length > 100) {
        throw new Error('Nome da disciplina deve ter no máximo 100 caracteres');
      }

      if (dadosDisciplina.categoria && !CATEGORIAS_VALIDAS.includes(dadosDisciplina.categoria)) {
        throw new Error('Categoria inválida. Use "base" ou "especial"');
      }

      logger.info(`📝 Criando nova disciplina: ${dadosDisciplina.nome_disciplina}`, 'disciplina');

      const novaDisciplina = await DisciplinaModel.criar({
        nome_disciplina: dadosDisciplina.nome_disciplina.trim(),
        categoria: dadosDisciplina.categoria
      });

      logger.success(`🎉 Disciplina criada com sucesso: ${novaDisciplina.nome_disciplina}`, 'disciplina');
      return novaDisciplina;

    } catch (error) {
      logger.error('❌ Erro ao criar disciplina', 'disciplina', error);
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno ao criar disciplina');
    }
  }

  /**
   * Atualizar disciplina existente
   */
  static async atualizarDisciplina(
    disciplina_id: string, 
    dadosAtualizacao: { nome_disciplina?: string }
  ): Promise<Disciplina> {
    try {
      if (!disciplina_id?.trim()) {
        throw new Error('ID da disciplina é obrigatório');
      }

      // Verificar se disciplina existe
      await this.buscarDisciplinaPorId(disciplina_id);

      // Validações dos dados
      if (dadosAtualizacao.nome_disciplina !== undefined) {
        if (!dadosAtualizacao.nome_disciplina.trim()) {
          throw new Error('Nome da disciplina é obrigatório');
        }

        if (dadosAtualizacao.nome_disciplina.length < 2) {
          throw new Error('Nome da disciplina deve ter pelo menos 2 caracteres');
        }

        if (dadosAtualizacao.nome_disciplina.length > 100) {
          throw new Error('Nome da disciplina deve ter no máximo 100 caracteres');
        }

        dadosAtualizacao.nome_disciplina = dadosAtualizacao.nome_disciplina.trim();
      }

      logger.info(`📝 Atualizando disciplina: ${disciplina_id}`, 'disciplina');
      
      const disciplinaAtualizada = await DisciplinaModel.atualizar(disciplina_id, dadosAtualizacao);

      if (!disciplinaAtualizada) {
        throw new Error('Falha ao atualizar disciplina');
      }

      logger.success(`✅ Disciplina atualizada: ${disciplinaAtualizada.nome_disciplina}`, 'disciplina');
      return disciplinaAtualizada;

    } catch (error) {
      logger.error('❌ Erro ao atualizar disciplina', 'disciplina', error);
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno ao atualizar disciplina');
    }
  }

  /**
   * Deletar disciplina
   */
  static async deletarDisciplina(disciplina_id: string): Promise<void> {
    try {
      if (!disciplina_id?.trim()) {
        throw new Error('ID da disciplina é obrigatório');
      }

      // Verificar se disciplina existe
      const disciplina = await this.buscarDisciplinaPorId(disciplina_id);

      logger.info(`🗑️ Deletando disciplina: ${disciplina.nome_disciplina}`, 'disciplina');
      
      const sucesso = await DisciplinaModel.deletar(disciplina_id);

      if (!sucesso) {
        throw new Error('Falha ao deletar disciplina');
      }

      logger.success(`✅ Disciplina deletada: ${disciplina.nome_disciplina}`, 'disciplina');

    } catch (error) {
      logger.error('❌ Erro ao deletar disciplina', 'disciplina', error);
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno ao deletar disciplina');
    }
  }

  /**
   * Buscar disciplinas por nome (busca parcial)
   */
  static async buscarDisciplinasPorNome(nome: string): Promise<Disciplina[]> {
    try {
      if (!nome?.trim()) {
        throw new Error('Nome para busca é obrigatório');
      }

      if (nome.trim().length < 2) {
        throw new Error('Nome para busca deve ter pelo menos 2 caracteres');
      }

      logger.info(`🔍 Buscando disciplinas por nome: ${nome}`, 'disciplina');
      
      // Para busca por nome, vamos filtrar as disciplinas
      const todasDisciplinas = await DisciplinaModel.listarTodas();
      const disciplinasFiltradas = todasDisciplinas.filter(disciplina =>
        disciplina.nome_disciplina.toLowerCase().includes(nome.toLowerCase())
      );

      logger.success(`✅ ${disciplinasFiltradas.length} disciplinas encontradas para "${nome}"`, 'disciplina');
      return disciplinasFiltradas;

    } catch (error) {
      logger.error('❌ Erro ao buscar disciplinas por nome', 'disciplina', error);
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno ao buscar disciplinas');
    }
  }
}

export default DisciplinaService;
