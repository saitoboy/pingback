import { Turma } from '../types/models';
import TurmaModel from '../model/turma.model';

class TurmaService {

  // Lista de turnos válidos
  private static readonly TURNOS_VALIDOS = ['manhã', 'tarde', 'noite', 'integral'];

  // Validar dados da turma
  private static validarDados(dados: any): string[] {
    const erros: string[] = [];

    if (!dados.nome_turma || typeof dados.nome_turma !== 'string' || dados.nome_turma.trim() === '') {
      erros.push("Campo 'nome_turma' é obrigatório e deve ser um texto válido");
    }

    if (dados.nome_turma && dados.nome_turma.length > 50) {
      erros.push("Campo 'nome_turma' deve ter no máximo 50 caracteres");
    }

    if (!dados.serie_id || typeof dados.serie_id !== 'string' || dados.serie_id.trim() === '') {
      erros.push("Campo 'serie_id' é obrigatório e deve ser um UUID válido");
    }

    if (!dados.ano_letivo_id || typeof dados.ano_letivo_id !== 'string' || dados.ano_letivo_id.trim() === '') {
      erros.push("Campo 'ano_letivo_id' é obrigatório e deve ser um UUID válido");
    }

    if (!dados.turno || typeof dados.turno !== 'string' || dados.turno.trim() === '') {
      erros.push("Campo 'turno' é obrigatório");
    }

    if (dados.turno && !this.TURNOS_VALIDOS.includes(dados.turno.toLowerCase())) {
      erros.push(`Campo 'turno' deve ser um dos valores: ${this.TURNOS_VALIDOS.join(', ')}`);
    }

    if (dados.sala && typeof dados.sala !== 'string') {
      erros.push("Campo 'sala' deve ser um texto válido");
    }

    if (dados.sala && dados.sala.length > 20) {
      erros.push("Campo 'sala' deve ter no máximo 20 caracteres");
    }

    return erros;
  }

  // Listar todas as turmas
  static async listarTurmas(): Promise<Turma[]> {
    try {
      return await TurmaModel.listarTurmas();
    } catch (error) {
      throw new Error(`Erro no service ao listar turmas: ${error}`);
    }
  }

  // Buscar turma por ID
  static async buscarTurmaPorId(turma_id: string): Promise<Turma | null> {
    try {
      if (!turma_id || turma_id.trim() === '') {
        throw new Error('ID da turma é obrigatório');
      }

      return await TurmaModel.buscarTurmaPorId(turma_id);
    } catch (error) {
      throw new Error(`Erro no service ao buscar turma por ID: ${error}`);
    }
  }

  // Buscar turmas por série
  static async buscarTurmasPorSerie(serie_id: string): Promise<Turma[]> {
    try {
      if (!serie_id || serie_id.trim() === '') {
        throw new Error('ID da série é obrigatório');
      }

      // Verificar se a série existe
      const serieExiste = await TurmaModel.verificarSerieExiste(serie_id);
      if (!serieExiste) {
        throw new Error('Série não encontrada');
      }

      return await TurmaModel.buscarTurmasPorSerie(serie_id);
    } catch (error) {
      throw new Error(`Erro no service ao buscar turmas por série: ${error}`);
    }
  }

  // Buscar turmas por ano letivo
  static async buscarTurmasPorAnoLetivo(ano_letivo_id: string): Promise<Turma[]> {
    try {
      if (!ano_letivo_id || ano_letivo_id.trim() === '') {
        throw new Error('ID do ano letivo é obrigatório');
      }

      // Verificar se o ano letivo existe
      const anoExiste = await TurmaModel.verificarAnoLetivoExiste(ano_letivo_id);
      if (!anoExiste) {
        throw new Error('Ano letivo não encontrado');
      }

      return await TurmaModel.buscarTurmasPorAnoLetivo(ano_letivo_id);
    } catch (error) {
      throw new Error(`Erro no service ao buscar turmas por ano letivo: ${error}`);
    }
  }

  // Buscar turmas por série e ano letivo
  static async buscarTurmasPorSerieEAno(serie_id: string, ano_letivo_id: string): Promise<Turma[]> {
    try {
      if (!serie_id || serie_id.trim() === '') {
        throw new Error('ID da série é obrigatório');
      }

      if (!ano_letivo_id || ano_letivo_id.trim() === '') {
        throw new Error('ID do ano letivo é obrigatório');
      }

      // Verificar se série e ano letivo existem
      const serieExiste = await TurmaModel.verificarSerieExiste(serie_id);
      if (!serieExiste) {
        throw new Error('Série não encontrada');
      }

      const anoExiste = await TurmaModel.verificarAnoLetivoExiste(ano_letivo_id);
      if (!anoExiste) {
        throw new Error('Ano letivo não encontrado');
      }

      return await TurmaModel.buscarTurmasPorSerieEAno(serie_id, ano_letivo_id);
    } catch (error) {
      throw new Error(`Erro no service ao buscar turmas por série e ano: ${error}`);
    }
  }

  // Buscar turmas por turno
  static async buscarTurmasPorTurno(turno: string): Promise<Turma[]> {
    try {
      if (!turno || turno.trim() === '') {
        throw new Error('Turno é obrigatório');
      }

      if (!this.TURNOS_VALIDOS.includes(turno.toLowerCase())) {
        throw new Error(`Turno deve ser um dos valores: ${this.TURNOS_VALIDOS.join(', ')}`);
      }

      return await TurmaModel.buscarTurmasPorTurno(turno.toLowerCase());
    } catch (error) {
      throw new Error(`Erro no service ao buscar turmas por turno: ${error}`);
    }
  }

  // Criar turma
  static async criarTurma(dados: any): Promise<Turma> {
    try {
      // Validar dados
      const erros = this.validarDados(dados);
      if (erros.length > 0) {
        throw new Error(`Dados inválidos: ${erros.join(', ')}`);
      }

      // Verificar se série e ano letivo existem
      const serieExiste = await TurmaModel.verificarSerieExiste(dados.serie_id);
      if (!serieExiste) {
        throw new Error('Série não encontrada');
      }

      const anoExiste = await TurmaModel.verificarAnoLetivoExiste(dados.ano_letivo_id);
      if (!anoExiste) {
        throw new Error('Ano letivo não encontrado');
      }

      // Verificar se o nome da turma já existe para a mesma série e ano letivo
      const nomeExiste = await TurmaModel.verificarNomeTurmaExiste(
        dados.nome_turma.trim(),
        dados.serie_id,
        dados.ano_letivo_id
      );
      if (nomeExiste) {
        throw new Error(`Já existe uma turma "${dados.nome_turma.trim()}" para esta série e ano letivo`);
      }

      // Preparar dados
      const dadosLimpos = {
        nome_turma: dados.nome_turma.trim(),
        serie_id: dados.serie_id.trim(),
        ano_letivo_id: dados.ano_letivo_id.trim(),
        turno: dados.turno.toLowerCase(),
        sala: dados.sala ? dados.sala.trim() : ''
      };

      return await TurmaModel.criarTurma(dadosLimpos);
    } catch (error) {
      throw new Error(`Erro no service ao criar turma: ${error}`);
    }
  }

  // Atualizar turma
  static async atualizarTurma(turma_id: string, dados: any): Promise<Turma | null> {
    try {
      if (!turma_id || turma_id.trim() === '') {
        throw new Error('ID da turma é obrigatório');
      }

      // Verificar se a turma existe
      const turmaExistente = await TurmaModel.buscarTurmaPorId(turma_id);
      if (!turmaExistente) {
        throw new Error('Turma não encontrada');
      }

      // Validar apenas os campos fornecidos
      const dadosParaValidar = { ...turmaExistente, ...dados };
      const erros = this.validarDados(dadosParaValidar);
      if (erros.length > 0) {
        throw new Error(`Dados inválidos: ${erros.join(', ')}`);
      }

      // Verificar se nova série existe (se foi alterada)
      if (dados.serie_id && dados.serie_id !== turmaExistente.serie_id) {
        const serieExiste = await TurmaModel.verificarSerieExiste(dados.serie_id);
        if (!serieExiste) {
          throw new Error('Nova série não encontrada');
        }
      }

      // Verificar se novo ano letivo existe (se foi alterado)
      if (dados.ano_letivo_id && dados.ano_letivo_id !== turmaExistente.ano_letivo_id) {
        const anoExiste = await TurmaModel.verificarAnoLetivoExiste(dados.ano_letivo_id);
        if (!anoExiste) {
          throw new Error('Novo ano letivo não encontrado');
        }
      }

      // Verificar se o novo nome da turma já existe (se nome, série ou ano foram alterados)
      const novoNome = dados.nome_turma ? dados.nome_turma.trim() : turmaExistente.nome_turma;
      const novaSerie = dados.serie_id || turmaExistente.serie_id;
      const novoAno = dados.ano_letivo_id || turmaExistente.ano_letivo_id;

      if (novoNome !== turmaExistente.nome_turma || 
          novaSerie !== turmaExistente.serie_id || 
          novoAno !== turmaExistente.ano_letivo_id) {
        
        const nomeExiste = await TurmaModel.verificarNomeTurmaExiste(novoNome, novaSerie, novoAno, turma_id);
        if (nomeExiste) {
          throw new Error(`Já existe uma turma "${novoNome}" para esta série e ano letivo`);
        }
      }

      // Preparar dados para atualização
      const dadosLimpos: any = {};
      if (dados.nome_turma) dadosLimpos.nome_turma = dados.nome_turma.trim();
      if (dados.serie_id) dadosLimpos.serie_id = dados.serie_id.trim();
      if (dados.ano_letivo_id) dadosLimpos.ano_letivo_id = dados.ano_letivo_id.trim();
      if (dados.turno) dadosLimpos.turno = dados.turno.toLowerCase();
      if (dados.sala !== undefined) dadosLimpos.sala = dados.sala ? dados.sala.trim() : '';

      return await TurmaModel.atualizarTurma(turma_id, dadosLimpos);
    } catch (error) {
      throw new Error(`Erro no service ao atualizar turma: ${error}`);
    }
  }

  // Deletar turma
  static async deletarTurma(turma_id: string): Promise<boolean> {
    try {
      if (!turma_id || turma_id.trim() === '') {
        throw new Error('ID da turma é obrigatório');
      }

      // Verificar se a turma existe
      const turmaExistente = await TurmaModel.buscarTurmaPorId(turma_id);
      if (!turmaExistente) {
        throw new Error('Turma não encontrada');
      }

      // Verificar se a turma tem alunos matriculados
      const temAlunos = await TurmaModel.verificarTurmaTemAlunos(turma_id);
      if (temAlunos) {
        throw new Error('Não é possível deletar a turma pois ela possui alunos matriculados');
      }

      return await TurmaModel.deletarTurma(turma_id);
    } catch (error) {
      throw new Error(`Erro no service ao deletar turma: ${error}`);
    }
  }
}

export default TurmaService;
