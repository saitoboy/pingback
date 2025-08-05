import { Request, Response } from 'express';
import CertidaoService from '../services/certidao.service';
import { logError, logSuccess } from '../utils/logger';

export class CertidaoController {
  
  static async criarCertidao(req: Request, res: Response) {
    try {
      const camposEsperados = [
        'livro_certidao', 'matricula_certidao', 'termo_certidao',
        'folha_certidao', 'data_expedicao_certidao', 'nome_cartorio_certidao'
      ];
      
      const camposFaltando = camposEsperados.filter(campo => !(campo in req.body));
      
      if (camposFaltando.length > 0) {
        logError(`Erro ao criar certidão: campos ausentes: ${camposFaltando.join(', ')}`, 'controller', req.body);
        return res.status(400).json({ 
          mensagem: `Campos obrigatórios ausentes: ${camposFaltando.join(', ')}` 
        });
      }

      const {
        livro_certidao, matricula_certidao, termo_certidao,
        folha_certidao, data_expedicao_certidao, nome_cartorio_certidao
      } = req.body;
      
      // Validação de campos vazios
      const camposVazios = [];
      if (!livro_certidao) camposVazios.push('livro_certidao');
      if (!matricula_certidao) camposVazios.push('matricula_certidao');
      if (!termo_certidao) camposVazios.push('termo_certidao');
      if (!folha_certidao) camposVazios.push('folha_certidao');
      if (!data_expedicao_certidao) camposVazios.push('data_expedicao_certidao');
      if (!nome_cartorio_certidao) camposVazios.push('nome_cartorio_certidao');
      
      if (camposVazios.length > 0) {
        logError(`Erro ao criar certidão: campos sem valor: ${camposVazios.join(', ')}`, 'controller', req.body);
        return res.status(400).json({ 
          mensagem: `Campos obrigatórios sem valor: ${camposVazios.join(', ')}` 
        });
      }

      // Validação de formato de data
      const dataExpedicao = new Date(data_expedicao_certidao);
      if (isNaN(dataExpedicao.getTime())) {
        logError('Data de expedição inválida', 'controller', { data_expedicao_certidao });
        return res.status(400).json({ 
          mensagem: 'Data de expedição deve estar no formato válido (YYYY-MM-DD).' 
        });
      }

      const novaCertidao = await CertidaoService.criarCertidao({
        livro_certidao: livro_certidao.trim(),
        matricula_certidao: matricula_certidao.trim(),
        termo_certidao: termo_certidao.trim(),
        folha_certidao: folha_certidao.trim(),
        data_expedicao_certidao: dataExpedicao,
        nome_cartorio_certidao: nome_cartorio_certidao.trim()
      });
      
      if (!novaCertidao) {
        logError('Falha ao criar certidão no service', 'controller', { matricula_certidao });
        return res.status(400).json({ 
          mensagem: 'Não foi possível criar a certidão. Verifique se a matrícula não está duplicada.' 
        });
      }

      logSuccess(`Certidão criada com sucesso: ${novaCertidao.matricula_certidao}`, 'controller', { 
        certidao_id: novaCertidao.certidao_id 
      });
      
      return res.status(201).json({ 
        mensagem: 'Certidão criada com sucesso.',
        certidao: novaCertidao 
      });
      
    } catch (error: any) {
      if (error.code === '23505') {
        logError('Erro ao criar certidão: matrícula duplicada (constraint)', 'controller', error);
        return res.status(409).json({ 
          mensagem: 'Matrícula de certidão já cadastrada no sistema.' 
        });
      }
      
      logError('Erro inesperado ao criar certidão', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async buscarCertidaoPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        logError('ID da certidão não fornecido', 'controller', req.params);
        return res.status(400).json({ 
          mensagem: 'ID da certidão é obrigatório.' 
        });
      }

      const certidao = await CertidaoService.buscarPorId(id);
      
      if (!certidao) {
        logError(`Certidão não encontrada: ${id}`, 'controller', { id });
        return res.status(404).json({ 
          mensagem: 'Certidão não encontrada.' 
        });
      }

      logSuccess(`Certidão encontrada: ${certidao.matricula_certidao}`, 'controller', { certidao_id: id });
      return res.status(200).json({ certidao });
      
    } catch (error: any) {
      logError('Erro inesperado ao buscar certidão', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async listarCertidoes(req: Request, res: Response) {
    try {
      const certidoes = await CertidaoService.listarTodas();
      
      logSuccess('Lista de certidões obtida com sucesso', 'controller', { 
        total: certidoes.length 
      });
      
      return res.status(200).json({ 
        certidoes,
        total: certidoes.length 
      });
      
    } catch (error: any) {
      logError('Erro inesperado ao listar certidões', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async buscarCertidaoPorMatricula(req: Request, res: Response) {
    try {
      const { matricula } = req.params;
      
      if (!matricula) {
        logError('Matrícula da certidão não fornecida', 'controller', req.params);
        return res.status(400).json({ 
          mensagem: 'Matrícula da certidão é obrigatória.' 
        });
      }

      const certidao = await CertidaoService.buscarPorMatricula(matricula);
      
      if (!certidao) {
        logError(`Certidão não encontrada com matrícula: ${matricula}`, 'controller', { matricula });
        return res.status(404).json({ 
          mensagem: 'Certidão não encontrada com esta matrícula.' 
        });
      }

      logSuccess(`Certidão encontrada por matrícula: ${certidao.matricula_certidao}`, 'controller', { matricula });
      return res.status(200).json({ certidao });
      
    } catch (error: any) {
      logError('Erro inesperado ao buscar certidão por matrícula', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async atualizarCertidao(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        logError('ID da certidão não fornecido para atualização', 'controller', req.params);
        return res.status(400).json({ 
          mensagem: 'ID da certidão é obrigatório.' 
        });
      }

      if (Object.keys(req.body).length === 0) {
        logError('Nenhum dado fornecido para atualização', 'controller', req.body);
        return res.status(400).json({ 
          mensagem: 'Pelo menos um campo deve ser fornecido para atualização.' 
        });
      }

      const certidaoAtualizada = await CertidaoService.atualizarCertidao(id, req.body);
      
      if (!certidaoAtualizada) {
        logError(`Falha ao atualizar certidão: ${id}`, 'controller', { certidao_id: id });
        return res.status(404).json({ 
          mensagem: 'Certidão não encontrada ou dados inválidos.' 
        });
      }

      logSuccess(`Certidão atualizada: ${certidaoAtualizada.matricula_certidao}`, 'controller', { 
        certidao_id: id 
      });
      
      return res.status(200).json({ 
        mensagem: 'Certidão atualizada com sucesso.',
        certidao: certidaoAtualizada 
      });
      
    } catch (error: any) {
      logError('Erro inesperado ao atualizar certidão', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async removerCertidao(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        logError('ID da certidão não fornecido para deletar', 'controller', req.params);
        return res.status(400).json({ 
          mensagem: 'ID da certidão é obrigatório.' 
        });
      }

      const deletado = await CertidaoService.deletarCertidao(id);
      
      if (!deletado) {
        logError(`Certidão não encontrada para deletar: ${id}`, 'controller', { certidao_id: id });
        return res.status(404).json({ 
          mensagem: 'Certidão não encontrada.' 
        });
      }

      logSuccess(`Certidão deletada com sucesso: ${id}`, 'controller', { certidao_id: id });
      return res.status(200).json({ 
        mensagem: 'Certidão deletada com sucesso.' 
      });
      
    } catch (error: any) {
      if (error.code === '23503') {
        logError('Erro ao deletar certidão: constraint de FK (alunos dependentes)', 'controller', error);
        return res.status(400).json({ 
          mensagem: 'Não é possível deletar esta certidão pois existem alunos vinculados a ela.' 
        });
      }
      
      logError('Erro inesperado ao deletar certidão', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }
}

export default CertidaoController;
