import * as CertidaoModel from '../model/certidao.model';
import { CertidaoNascimento } from '../types/models';
import { logError, logSuccess } from '../utils/logger';

export class CertidaoService {
  
  static async criarCertidao(dadosCertidao: Omit<CertidaoNascimento, 'certidao_id' | 'created_at' | 'updated_at'>): Promise<CertidaoNascimento | null> {
    try {
      // Validações básicas
      const camposObrigatorios = [
        'livro_certidao', 'matricula_certidao', 'termo_certidao', 
        'folha_certidao', 'data_expedicao_certidao', 'nome_cartorio_certidao'
      ];
      
      for (const campo of camposObrigatorios) {
        if (!dadosCertidao[campo as keyof typeof dadosCertidao]) {
          logError(`Campo obrigatório ausente: ${campo}`, 'service', dadosCertidao);
          return null;
        }
      }

      // Verifica se já existe uma certidão com esta matrícula
      const certidaoExistente = await CertidaoModel.buscarPorMatricula(dadosCertidao.matricula_certidao);
      if (certidaoExistente) {
        logError('Certidão já cadastrada com esta matrícula', 'service', { matricula: dadosCertidao.matricula_certidao });
        return null;
      }

      // Valida data de expedição
      const dataExpedicao = new Date(dadosCertidao.data_expedicao_certidao);
      if (isNaN(dataExpedicao.getTime())) {
        logError('Data de expedição inválida', 'service', { data: dadosCertidao.data_expedicao_certidao });
        return null;
      }

      // Cria a certidão
      const novaCertidao = await CertidaoModel.criar({
        livro_certidao: dadosCertidao.livro_certidao.trim(),
        matricula_certidao: dadosCertidao.matricula_certidao.trim(),
        termo_certidao: dadosCertidao.termo_certidao.trim(),
        folha_certidao: dadosCertidao.folha_certidao.trim(),
        data_expedicao_certidao: dataExpedicao,
        nome_cartorio_certidao: dadosCertidao.nome_cartorio_certidao.trim()
      });
      
      logSuccess('Certidão criada com sucesso', 'service', { 
        certidao_id: novaCertidao.certidao_id,
        matricula: novaCertidao.matricula_certidao
      });
      
      return novaCertidao;
    } catch (error) {
      logError('Erro ao criar certidão', 'service', error);
      throw error;
    }
  }

  static async buscarPorId(certidao_id: string): Promise<CertidaoNascimento | null> {
    try {
      const certidao = await CertidaoModel.buscarPorId(certidao_id);
      if (!certidao) {
        logError('Certidão não encontrada', 'service', { certidao_id });
        return null;
      }

      logSuccess('Certidão encontrada', 'service', { certidao_id });
      return certidao;
    } catch (error) {
      logError('Erro ao buscar certidão', 'service', error);
      throw error;
    }
  }

  static async listarTodas(): Promise<CertidaoNascimento[]> {
    try {
      const certidoes = await CertidaoModel.listarTodos();
      
      logSuccess('Lista de certidões obtida', 'service', { 
        total: certidoes.length 
      });
      
      return certidoes;
    } catch (error) {
      logError('Erro ao listar certidões', 'service', error);
      throw error;
    }
  }

  static async buscarPorMatricula(matricula_certidao: string): Promise<CertidaoNascimento | null> {
    try {
      const certidao = await CertidaoModel.buscarPorMatricula(matricula_certidao);
      if (!certidao) {
        logError('Certidão não encontrada por matrícula', 'service', { matricula_certidao });
        return null;
      }

      logSuccess('Certidão encontrada por matrícula', 'service', { 
        matricula_certidao,
        certidao_id: certidao.certidao_id
      });
      
      return certidao;
    } catch (error) {
      logError('Erro ao buscar certidão por matrícula', 'service', error);
      throw error;
    }
  }

  static async atualizarCertidao(certidao_id: string, dadosAtualizacao: Partial<Omit<CertidaoNascimento, 'certidao_id' | 'created_at' | 'updated_at'>>): Promise<CertidaoNascimento | null> {
    try {
      // Verifica se a certidão existe
      const certidaoExistente = await CertidaoModel.buscarPorId(certidao_id);
      if (!certidaoExistente) {
        logError('Certidão não encontrada para atualizar', 'service', { certidao_id });
        return null;
      }

      // Se está atualizando a matrícula, verifica duplicatas
      if (dadosAtualizacao.matricula_certidao) {
        const certidaoComMatricula = await CertidaoModel.buscarPorMatricula(dadosAtualizacao.matricula_certidao);
        if (certidaoComMatricula && certidaoComMatricula.certidao_id !== certidao_id) {
          logError('Já existe uma certidão com esta matrícula', 'service', { matricula: dadosAtualizacao.matricula_certidao });
          return null;
        }
      }

      const certidaoAtualizada = await CertidaoModel.atualizar(certidao_id, dadosAtualizacao);
      
      logSuccess('Certidão atualizada com sucesso', 'service', { 
        certidao_id,
        matricula: certidaoAtualizada?.matricula_certidao
      });
      
      return certidaoAtualizada || null;
    } catch (error) {
      logError('Erro ao atualizar certidão', 'service', error);
      throw error;
    }
  }

  static async deletarCertidao(certidao_id: string): Promise<boolean> {
    try {
      // Verifica se a certidão existe
      const certidao = await CertidaoModel.buscarPorId(certidao_id);
      if (!certidao) {
        logError('Certidão não encontrada para deletar', 'service', { certidao_id });
        return false;
      }

      // Deleta a certidão
      const deletado = await CertidaoModel.deletar(certidao_id);
      
      if (deletado) {
        logSuccess('Certidão deletada com sucesso', 'service', { certidao_id });
      } else {
        logError('Falha ao deletar certidão', 'service', { certidao_id });
      }
      
      return deletado;
    } catch (error) {
      logError('Erro ao deletar certidão', 'service', error);
      throw error;
    }
  }
}

export default CertidaoService;
