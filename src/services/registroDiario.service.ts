import * as RegistroDiarioModel from '../model/registroDiario.model';
import { RegistroDiario, StatusRegistroDiario, AnexoRegistro } from '../types/models';
import logger from '../utils/logger';

interface DadosUpsert {
  turma_disciplina_professor_id?: string;
  data_aula?: string;
  resumo?: string;
  conteudo_programatico?: string;
  metodologia?: string;
  recursos?: string[];
  observacoes?: string;
  fotos?: string[];
  anexos?: AnexoRegistro[];
  status?: StatusRegistroDiario;
}

// Converte string YYYY-MM-DD para Date no timezone local
const parseData = (data?: string): Date | undefined => {
  if (!data) return undefined;
  if (typeof data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data)) {
    const [ano, mes, dia] = data.split('-').map(Number);
    return new Date(ano, mes - 1, dia, 0, 0, 0, 0);
  }
  return new Date(data);
};

const validarStatus = (status?: string): StatusRegistroDiario => {
  return status === 'concluido' ? 'concluido' : 'rascunho';
};

class RegistroDiarioService {
  static async buscarPorId(registro_diario_id: string): Promise<RegistroDiario> {
    if (!registro_diario_id?.trim()) {
      throw new Error('ID do registro é obrigatório');
    }

    const registro = await RegistroDiarioModel.buscarPorId(registro_diario_id);

    if (!registro) {
      throw new Error('Registro diário não encontrado');
    }

    return registro;
  }

  static async buscarPorDataEVinculacao(
    turma_disciplina_professor_id: string,
    data_aula: string
  ): Promise<RegistroDiario | null> {
    if (!turma_disciplina_professor_id?.trim()) {
      throw new Error('ID da vinculação é obrigatório');
    }
    if (!data_aula?.trim()) {
      throw new Error('Data da aula é obrigatória');
    }

    logger.info(
      `🔍 Buscando registro diário da vinculação ${turma_disciplina_professor_id} na data ${data_aula}`,
      'registro-diario'
    );

    const registro = await RegistroDiarioModel.buscarPorDataEVinculacao(turma_disciplina_professor_id, data_aula);
    return registro ?? null;
  }

  static async listarPorVinculacao(turma_disciplina_professor_id: string): Promise<RegistroDiario[]> {
    if (!turma_disciplina_professor_id?.trim()) {
      throw new Error('ID da vinculação é obrigatório');
    }
    return await RegistroDiarioModel.listarPorVinculacao(turma_disciplina_professor_id);
  }

  static async listarPorProfessor(professor_id: string): Promise<any[]> {
    if (!professor_id?.trim()) {
      throw new Error('ID do professor é obrigatório');
    }
    return await RegistroDiarioModel.listarPorProfessorComDetalhes(professor_id);
  }

  // Cria ou atualiza o registro do dia (upsert por vinculação + data)
  static async salvar(dados: DadosUpsert): Promise<RegistroDiario> {
    if (!dados.turma_disciplina_professor_id?.trim()) {
      throw new Error('Vinculação (turma_disciplina_professor_id) é obrigatória');
    }
    if (!dados.data_aula) {
      throw new Error('Data da aula é obrigatória');
    }
    if (!dados.resumo?.trim()) {
      throw new Error('O resumo da aula é obrigatório');
    }

    const dataDate = parseData(dados.data_aula)!;

    // Verifica se já existe registro para essa vinculação + data
    const existente = await RegistroDiarioModel.buscarPorDataEVinculacao(
      dados.turma_disciplina_professor_id,
      dados.data_aula
    );

    const payload = {
      resumo: dados.resumo.trim(),
      conteudo_programatico: dados.conteudo_programatico,
      metodologia: dados.metodologia,
      recursos: dados.recursos ?? [],
      observacoes: dados.observacoes,
      fotos: dados.fotos ?? [],
      anexos: dados.anexos ?? [],
      status: validarStatus(dados.status),
    };

    if (existente) {
      logger.info(`📝 Atualizando registro diário existente: ${existente.registro_diario_id}`, 'registro-diario');
      const atualizado = await RegistroDiarioModel.atualizar(existente.registro_diario_id, payload);
      if (!atualizado) {
        throw new Error('Falha ao atualizar registro diário');
      }
      return atualizado;
    }

    logger.info('📝 Criando novo registro diário', 'registro-diario');
    return await RegistroDiarioModel.criar({
      turma_disciplina_professor_id: dados.turma_disciplina_professor_id,
      data_aula: dataDate,
      ...payload,
    });
  }

  static async atualizar(registro_diario_id: string, dados: DadosUpsert): Promise<RegistroDiario> {
    await this.buscarPorId(registro_diario_id);

    const payload: Record<string, any> = {};
    if (dados.resumo !== undefined) {
      if (!dados.resumo.trim()) throw new Error('O resumo da aula é obrigatório');
      payload.resumo = dados.resumo.trim();
    }
    if (dados.conteudo_programatico !== undefined) payload.conteudo_programatico = dados.conteudo_programatico;
    if (dados.metodologia !== undefined) payload.metodologia = dados.metodologia;
    if (dados.recursos !== undefined) payload.recursos = dados.recursos;
    if (dados.observacoes !== undefined) payload.observacoes = dados.observacoes;
    if (dados.fotos !== undefined) payload.fotos = dados.fotos;
    if (dados.anexos !== undefined) payload.anexos = dados.anexos;
    if (dados.status !== undefined) payload.status = validarStatus(dados.status);

    const atualizado = await RegistroDiarioModel.atualizar(registro_diario_id, payload);
    if (!atualizado) {
      throw new Error('Falha ao atualizar registro diário');
    }
    return atualizado;
  }

  static async deletar(registro_diario_id: string): Promise<void> {
    await this.buscarPorId(registro_diario_id);
    const sucesso = await RegistroDiarioModel.deletar(registro_diario_id);
    if (!sucesso) {
      throw new Error('Falha ao deletar registro diário');
    }
  }

  static async verificarAcessoProfessor(registro_diario_id: string, professor_id: string): Promise<boolean> {
    if (!registro_diario_id?.trim() || !professor_id?.trim()) return false;
    return await RegistroDiarioModel.verificarAcessoProfessor(registro_diario_id, professor_id);
  }

  static async professorEhDonoDaVinculacao(
    turma_disciplina_professor_id: string,
    professor_id: string
  ): Promise<boolean> {
    if (!turma_disciplina_professor_id?.trim() || !professor_id?.trim()) return false;
    return await RegistroDiarioModel.professorEhDonoDaVinculacao(turma_disciplina_professor_id, professor_id);
  }
}

export default RegistroDiarioService;
