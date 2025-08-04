import * as AlunoModel from '../model/aluno.model';
import { Aluno } from '../types/models';
import { logError, logSuccess } from '../utils/logger';

export class AlunoService {
  
  static async criarAluno(dadosAluno: Omit<Aluno, 'aluno_id' | 'created_at' | 'updated_at'>): Promise<Aluno | null> {
    try {
      // Validações básicas
      if (!dadosAluno.nome_aluno || !dadosAluno.sobrenome_aluno) {
        logError('Nome e sobrenome são obrigatórios', 'service', dadosAluno);
        return null;
      }

      if (!dadosAluno.cpf_aluno || !dadosAluno.rg_aluno) {
        logError('CPF e RG são obrigatórios', 'service', dadosAluno);
        return null;
      }

      // Verifica se CPF já existe
      const alunoComCpf = await AlunoModel.buscarPorCpf(dadosAluno.cpf_aluno);
      if (alunoComCpf) {
        logError('CPF já cadastrado', 'service', { cpf: dadosAluno.cpf_aluno });
        return null;
      }

      // Verifica se RG já existe
      const alunoComRg = await AlunoModel.buscarPorRg(dadosAluno.rg_aluno);
      if (alunoComRg) {
        logError('RG já cadastrado', 'service', { rg: dadosAluno.rg_aluno });
        return null;
      }

      // Validação de idade (mínimo 3 anos, máximo 18 anos)
      const hoje = new Date();
      const nascimento = new Date(dadosAluno.data_nascimento_aluno);
      const idade = hoje.getFullYear() - nascimento.getFullYear();
      
      if (idade < 3 || idade > 18) {
        logError('Idade deve ser entre 3 e 18 anos', 'service', { 
          data_nascimento: dadosAluno.data_nascimento_aluno,
          idade_calculada: idade 
        });
        return null;
      }

      // Cria o aluno
      const novoAluno = await AlunoModel.criar(dadosAluno);
      
      logSuccess('Aluno criado com sucesso', 'service', { 
        aluno_id: novoAluno.aluno_id,
        nome_completo: `${novoAluno.nome_aluno} ${novoAluno.sobrenome_aluno}`
      });
      
      return novoAluno;
    } catch (error) {
      logError('Erro ao criar aluno', 'service', error);
      throw error;
    }
  }

  static async buscarPorId(aluno_id: string): Promise<any | null> {
    try {
      const aluno = await AlunoModel.buscarComDependencias(aluno_id);
      if (!aluno) {
        logError('Aluno não encontrado', 'service', { aluno_id });
        return null;
      }

      logSuccess('Aluno encontrado', 'service', { 
        aluno_id,
        nome_completo: `${aluno.nome_aluno} ${aluno.sobrenome_aluno}`
      });
      
      return aluno;
    } catch (error) {
      logError('Erro ao buscar aluno', 'service', error);
      throw error;
    }
  }

  static async listarTodos(): Promise<any[]> {
    try {
      const alunos = await AlunoModel.listarComDependencias();
      
      logSuccess('Lista de alunos obtida', 'service', { 
        total: alunos.length 
      });
      
      return alunos;
    } catch (error) {
      logError('Erro ao listar alunos', 'service', error);
      throw error;
    }
  }

  static async pesquisarAlunos(termo: string): Promise<Aluno[]> {
    try {
      if (!termo || termo.trim().length < 2) {
        logError('Termo de pesquisa deve ter pelo menos 2 caracteres', 'service', { termo });
        return [];
      }

      const alunos = await AlunoModel.pesquisarPorNome(termo.trim());
      
      logSuccess('Pesquisa de alunos realizada', 'service', { 
        termo,
        resultados: alunos.length 
      });
      
      return alunos;
    } catch (error) {
      logError('Erro ao pesquisar alunos', 'service', error);
      throw error;
    }
  }

  static async listarPorIdade(idadeMinima: number, idadeMaxima: number): Promise<Aluno[]> {
    try {
      if (idadeMinima < 0 || idadeMaxima > 25 || idadeMinima > idadeMaxima) {
        logError('Faixa etária inválida', 'service', { idadeMinima, idadeMaxima });
        return [];
      }

      const alunos = await AlunoModel.listarPorIdade(idadeMinima, idadeMaxima);
      
      logSuccess('Lista de alunos por idade obtida', 'service', { 
        idadeMinima,
        idadeMaxima,
        total: alunos.length 
      });
      
      return alunos;
    } catch (error) {
      logError('Erro ao listar alunos por idade', 'service', error);
      throw error;
    }
  }

  static async atualizarAluno(aluno_id: string, dadosAtualizacao: Partial<Omit<Aluno, 'aluno_id' | 'created_at'>>): Promise<Aluno | null> {
    try {
      // Verifica se o aluno existe
      const alunoExistente = await AlunoModel.buscarPorId(aluno_id);
      if (!alunoExistente) {
        logError('Aluno não encontrado para atualização', 'service', { aluno_id });
        return null;
      }

      // Se está atualizando CPF, verifica duplicação
      if (dadosAtualizacao.cpf_aluno) {
        const alunoComCpf = await AlunoModel.buscarPorCpf(dadosAtualizacao.cpf_aluno);
        if (alunoComCpf && alunoComCpf.aluno_id !== aluno_id) {
          logError('CPF já cadastrado para outro aluno', 'service', { 
            cpf: dadosAtualizacao.cpf_aluno,
            aluno_conflito: alunoComCpf.aluno_id 
          });
          return null;
        }
      }

      // Se está atualizando RG, verifica duplicação
      if (dadosAtualizacao.rg_aluno) {
        const alunoComRg = await AlunoModel.buscarPorRg(dadosAtualizacao.rg_aluno);
        if (alunoComRg && alunoComRg.aluno_id !== aluno_id) {
          logError('RG já cadastrado para outro aluno', 'service', { 
            rg: dadosAtualizacao.rg_aluno,
            aluno_conflito: alunoComRg.aluno_id 
          });
          return null;
        }
      }

      // Atualiza o aluno
      const alunoAtualizado = await AlunoModel.atualizar(aluno_id, dadosAtualizacao);
      
      if (alunoAtualizado) {
        logSuccess('Aluno atualizado com sucesso', 'service', { 
          aluno_id,
          campos_atualizados: Object.keys(dadosAtualizacao)
        });
      }
      
      return alunoAtualizado || null;
    } catch (error) {
      logError('Erro ao atualizar aluno', 'service', error);
      throw error;
    }
  }

  static async deletarAluno(aluno_id: string): Promise<boolean> {
    try {
      // Verifica se o aluno existe
      const aluno = await AlunoModel.buscarPorId(aluno_id);
      if (!aluno) {
        logError('Aluno não encontrado para deletar', 'service', { aluno_id });
        return false;
      }

      // Deleta o aluno
      const deletado = await AlunoModel.deletar(aluno_id);
      
      if (deletado) {
        logSuccess('Aluno deletado com sucesso', 'service', { 
          aluno_id,
          nome_completo: `${aluno.nome_aluno} ${aluno.sobrenome_aluno}`
        });
      } else {
        logError('Falha ao deletar aluno', 'service', { aluno_id });
      }
      
      return deletado;
    } catch (error) {
      logError('Erro ao deletar aluno', 'service', error);
      throw error;
    }
  }

  static async buscarPorCpf(cpf: string): Promise<any | null> {
    try {
      const aluno = await AlunoModel.buscarPorCpfComDependencias(cpf);
      if (!aluno) {
        logError('Aluno não encontrado por CPF', 'service', { cpf });
        return null;
      }

      logSuccess('Aluno encontrado por CPF', 'service', { 
        cpf,
        aluno_id: aluno.aluno_id,
        nome_completo: `${aluno.nome_aluno} ${aluno.sobrenome_aluno}`
      });
      
      return aluno;
    } catch (error) {
      logError('Erro ao buscar aluno por CPF', 'service', error);
      throw error;
    }
  }

  static async buscarPorMatricula(numeroMatricula: string): Promise<any | null> {
    try {
      const aluno = await AlunoModel.buscarPorMatriculaComDependencias(numeroMatricula);
      if (!aluno) {
        logError('Aluno não encontrado por matrícula', 'service', { numeroMatricula });
        return null;
      }

      logSuccess('Aluno encontrado por matrícula', 'service', { 
        numeroMatricula,
        aluno_id: aluno.aluno_id,
        nome_completo: `${aluno.nome_aluno} ${aluno.sobrenome_aluno}`
      });
      
      return aluno;
    } catch (error) {
      logError('Erro ao buscar aluno por matrícula', 'service', error);
      throw error;
    }
  }

  static async obterEstatisticas(): Promise<any> {
    try {
      const estatisticas = await AlunoModel.obterEstatisticas();
      
      logSuccess('Estatísticas de alunos obtidas', 'service', estatisticas);
      
      return estatisticas;
    } catch (error) {
      logError('Erro ao obter estatísticas de alunos', 'service', error);
      throw error;
    }
  }
}

export default AlunoService;
