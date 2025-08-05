import { Request, Response } from 'express';
import AlunoService from '../services/aluno.service';
import { logError, logSuccess } from '../utils/logger';

export class AlunoController {
  
  static async criarAluno(req: Request, res: Response) {
    try {
      const camposEsperados = [
        'nome_aluno', 'sobrenome_aluno', 'data_nascimento_aluno',
        'cpf_aluno', 'rg_aluno', 'naturalidade_aluno',
        'endereco_aluno', 'bairro_aluno', 'cep_aluno',
        'religiao_id', 'certidao_id'
      ];
      
      const camposFaltando = camposEsperados.filter(campo => !(campo in req.body));
      
      if (camposFaltando.length > 0) {
        logError(`Erro ao criar aluno: campos ausentes: ${camposFaltando.join(', ')}`, 'controller', req.body);
        return res.status(400).json({ 
          mensagem: `Campos obrigatórios ausentes: ${camposFaltando.join(', ')}` 
        });
      }

      const {
        nome_aluno, sobrenome_aluno, data_nascimento_aluno,
        cpf_aluno, rg_aluno, naturalidade_aluno,
        endereco_aluno, bairro_aluno, cep_aluno,
        religiao_id, certidao_id
      } = req.body;
      
      // Validação de campos vazios
      const camposVazios = [];
      if (!nome_aluno) camposVazios.push('nome_aluno');
      if (!sobrenome_aluno) camposVazios.push('sobrenome_aluno');
      if (!data_nascimento_aluno) camposVazios.push('data_nascimento_aluno');
      if (!cpf_aluno) camposVazios.push('cpf_aluno');
      if (!rg_aluno) camposVazios.push('rg_aluno');
      if (!naturalidade_aluno) camposVazios.push('naturalidade_aluno');
      if (!endereco_aluno) camposVazios.push('endereco_aluno');
      if (!bairro_aluno) camposVazios.push('bairro_aluno');
      if (!cep_aluno) camposVazios.push('cep_aluno');
      if (!religiao_id) camposVazios.push('religiao_id');
      if (!certidao_id) camposVazios.push('certidao_id');
      
      if (camposVazios.length > 0) {
        logError(`Erro ao criar aluno: campos sem valor: ${camposVazios.join(', ')}`, 'controller', req.body);
        return res.status(400).json({ 
          mensagem: `Campos obrigatórios sem valor: ${camposVazios.join(', ')}` 
        });
      }

      // Validação de formato de data
      const dataNascimento = new Date(data_nascimento_aluno);
      if (isNaN(dataNascimento.getTime())) {
        logError('Data de nascimento inválida', 'controller', { data_nascimento_aluno });
        return res.status(400).json({ 
          mensagem: 'Data de nascimento deve estar no formato válido (YYYY-MM-DD).' 
        });
      }

      // Validação básica de CPF (apenas números e 11 dígitos)
      const cpfLimpo = cpf_aluno.replace(/\D/g, '');
      if (cpfLimpo.length !== 11) {
        logError('CPF deve ter 11 dígitos', 'controller', { cpf_aluno });
        return res.status(400).json({ 
          mensagem: 'CPF deve conter exatamente 11 dígitos.' 
        });
      }

      // Validação básica de CEP (8 dígitos)
      const cepLimpo = cep_aluno.replace(/\D/g, '');
      if (cepLimpo.length !== 8) {
        logError('CEP deve ter 8 dígitos', 'controller', { cep_aluno });
        return res.status(400).json({ 
          mensagem: 'CEP deve conter exatamente 8 dígitos.' 
        });
      }

      const novoAluno = await AlunoService.criarAluno({
        nome_aluno: nome_aluno.trim(),
        sobrenome_aluno: sobrenome_aluno.trim(),
        data_nascimento_aluno: dataNascimento,
        cpf_aluno: cpfLimpo,
        rg_aluno: rg_aluno.trim(),
        naturalidade_aluno: naturalidade_aluno.trim(),
        endereco_aluno: endereco_aluno.trim(),
        bairro_aluno: bairro_aluno.trim(),
        cep_aluno: cepLimpo,
        religiao_id,
        certidao_id
      });
      
      if (!novoAluno) {
        logError('Falha ao criar aluno no service', 'controller', { nome_aluno, sobrenome_aluno });
        return res.status(400).json({ 
          mensagem: 'Não foi possível criar o aluno. Verifique se CPF/RG não estão duplicados e se a idade está entre 3 e 18 anos.' 
        });
      }

      logSuccess(`Aluno criado com sucesso: ${novoAluno.nome_aluno} ${novoAluno.sobrenome_aluno}`, 'controller', { 
        aluno_id: novoAluno.aluno_id 
      });
      
      return res.status(201).json({ 
        mensagem: 'Aluno criado com sucesso.',
        aluno: novoAluno 
      });
      
    } catch (error: any) {
      if (error.code === '23503') {
        logError('Erro ao criar aluno: FK constraint (religião ou certidão inválida)', 'controller', error);
        return res.status(400).json({ 
          mensagem: 'religiao_id ou certidao_id inválidos. Verifique se existem no sistema.' 
        });
      }
      
      if (error.code === '23505') {
        logError('Erro ao criar aluno: CPF ou RG duplicado (constraint)', 'controller', error);
        return res.status(409).json({ 
          mensagem: 'CPF ou RG já cadastrado no sistema.' 
        });
      }
      
      logError('Erro inesperado ao criar aluno', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async buscarAlunoPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        logError('ID do aluno não fornecido', 'controller', req.params);
        return res.status(400).json({ 
          mensagem: 'ID do aluno é obrigatório.' 
        });
      }

      const aluno = await AlunoService.buscarPorId(id);
      
      if (!aluno) {
        logError(`Aluno não encontrado: ${id}`, 'controller', { id });
        return res.status(404).json({ 
          mensagem: 'Aluno não encontrado.' 
        });
      }

      logSuccess(`Aluno encontrado: ${aluno.nome_aluno} ${aluno.sobrenome_aluno}`, 'controller', { aluno_id: id });
      return res.status(200).json({ aluno });
      
    } catch (error: any) {
      logError('Erro inesperado ao buscar aluno', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async listarAlunos(req: Request, res: Response) {
    try {
      const alunos = await AlunoService.listarTodos();
      
      logSuccess('Lista de alunos obtida com sucesso', 'controller', { 
        total: alunos.length 
      });
      
      return res.status(200).json({ 
        alunos,
        total: alunos.length 
      });
      
    } catch (error: any) {
      logError('Erro inesperado ao listar alunos', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async buscarAlunosPorNome(req: Request, res: Response) {
    try {
      const { termo } = req.query;
      
      if (!termo || typeof termo !== 'string') {
        logError('Termo de pesquisa não fornecido', 'controller', req.query);
        return res.status(400).json({ 
          mensagem: 'Parâmetro "termo" é obrigatório para pesquisa.' 
        });
      }

      const alunos = await AlunoService.pesquisarAlunos(termo);
      
      logSuccess(`Pesquisa realizada: "${termo}"`, 'controller', { 
        termo,
        resultados: alunos.length 
      });
      
      return res.status(200).json({ 
        alunos,
        total: alunos.length,
        termo_pesquisa: termo 
      });
      
    } catch (error: any) {
      logError('Erro inesperado ao pesquisar alunos', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  // Manter método de listar por idade para funcionalidade extra
  static async listarAlunosPorIdade(req: Request, res: Response) {
    try {
      const { idade_minima, idade_maxima } = req.query;
      
      const idadeMin = parseInt(idade_minima as string);
      const idadeMax = parseInt(idade_maxima as string);
      
      if (isNaN(idadeMin) || isNaN(idadeMax)) {
        logError('Idades inválidas fornecidas', 'controller', { idade_minima, idade_maxima });
        return res.status(400).json({ 
          mensagem: 'Parâmetros idade_minima e idade_maxima devem ser números válidos.' 
        });
      }

      const alunos = await AlunoService.listarPorIdade(idadeMin, idadeMax);
      
      logSuccess(`Lista por idade obtida: ${idadeMin}-${idadeMax} anos`, 'controller', { 
        idade_minima: idadeMin,
        idade_maxima: idadeMax,
        total: alunos.length 
      });
      
      return res.status(200).json({ 
        alunos,
        total: alunos.length,
        faixa_etaria: { idade_minima: idadeMin, idade_maxima: idadeMax }
      });
      
    } catch (error: any) {
      logError('Erro inesperado ao listar alunos por idade', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async atualizarAluno(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        logError('ID do aluno não fornecido para atualização', 'controller', req.params);
        return res.status(400).json({ 
          mensagem: 'ID do aluno é obrigatório.' 
        });
      }

      if (Object.keys(req.body).length === 0) {
        logError('Nenhum dado fornecido para atualização', 'controller', req.body);
        return res.status(400).json({ 
          mensagem: 'Pelo menos um campo deve ser fornecido para atualização.' 
        });
      }

      const alunoAtualizado = await AlunoService.atualizarAluno(id, req.body);
      
      if (!alunoAtualizado) {
        logError(`Falha ao atualizar aluno: ${id}`, 'controller', { aluno_id: id });
        return res.status(404).json({ 
          mensagem: 'Aluno não encontrado ou dados inválidos.' 
        });
      }

      logSuccess(`Aluno atualizado: ${alunoAtualizado.nome_aluno} ${alunoAtualizado.sobrenome_aluno}`, 'controller', { 
        aluno_id: id 
      });
      
      return res.status(200).json({ 
        mensagem: 'Aluno atualizado com sucesso.',
        aluno: alunoAtualizado 
      });
      
    } catch (error: any) {
      logError('Erro inesperado ao atualizar aluno', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async removerAluno(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        logError('ID do aluno não fornecido para deletar', 'controller', req.params);
        return res.status(400).json({ 
          mensagem: 'ID do aluno é obrigatório.' 
        });
      }

      const deletado = await AlunoService.deletarAluno(id);
      
      if (!deletado) {
        logError(`Aluno não encontrado para deletar: ${id}`, 'controller', { aluno_id: id });
        return res.status(404).json({ 
          mensagem: 'Aluno não encontrado.' 
        });
      }

      logSuccess(`Aluno deletado com sucesso: ${id}`, 'controller', { aluno_id: id });
      return res.status(200).json({ 
        mensagem: 'Aluno deletado com sucesso.' 
      });
      
    } catch (error: any) {
      logError('Erro inesperado ao deletar aluno', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async buscarAlunoPorCpf(req: Request, res: Response) {
    try {
      const { cpf } = req.params;
      
      if (!cpf) {
        logError('CPF do aluno não fornecido', 'controller', req.params);
        return res.status(400).json({ 
          mensagem: 'CPF do aluno é obrigatório.' 
        });
      }

      // Limpar CPF (remover caracteres não numéricos)
      const cpfLimpo = cpf.replace(/\D/g, '');
      
      if (cpfLimpo.length !== 11) {
        logError('CPF inválido fornecido', 'controller', { cpf });
        return res.status(400).json({ 
          mensagem: 'CPF deve conter 11 dígitos.' 
        });
      }

      const aluno = await AlunoService.buscarPorCpf(cpfLimpo);
      
      if (!aluno) {
        logError(`Aluno não encontrado com CPF: ${cpfLimpo}`, 'controller', { cpf: cpfLimpo });
        return res.status(404).json({ 
          mensagem: 'Aluno não encontrado com este CPF.' 
        });
      }

      logSuccess(`Aluno encontrado por CPF: ${aluno.nome_aluno} ${aluno.sobrenome_aluno}`, 'controller', { cpf: cpfLimpo });
      return res.status(200).json({ aluno });
      
    } catch (error: any) {
      logError('Erro inesperado ao buscar aluno por CPF', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async buscarAlunoPorMatricula(req: Request, res: Response) {
    try {
      const { numeroMatricula } = req.params;
      
      if (!numeroMatricula) {
        logError('Número de matrícula não fornecido', 'controller', req.params);
        return res.status(400).json({ 
          mensagem: 'Número de matrícula é obrigatório.' 
        });
      }

      const aluno = await AlunoService.buscarPorMatricula(numeroMatricula);
      
      if (!aluno) {
        logError(`Aluno não encontrado com matrícula: ${numeroMatricula}`, 'controller', { numeroMatricula });
        return res.status(404).json({ 
          mensagem: 'Aluno não encontrado com este número de matrícula.' 
        });
      }

      logSuccess(`Aluno encontrado por matrícula: ${aluno.nome_aluno} ${aluno.sobrenome_aluno}`, 'controller', { numeroMatricula });
      return res.status(200).json({ aluno });
      
    } catch (error: any) {
      logError('Erro inesperado ao buscar aluno por matrícula', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }

  static async obterEstatisticas(req: Request, res: Response) {
    try {
      const estatisticas = await AlunoService.obterEstatisticas();
      
      logSuccess('Estatísticas de alunos obtidas com sucesso', 'controller', estatisticas);
      return res.status(200).json({ 
        mensagem: 'Estatísticas obtidas com sucesso.',
        estatisticas 
      });
      
    } catch (error: any) {
      logError('Erro inesperado ao obter estatísticas de alunos', 'controller', error);
      return res.status(500).json({ 
        mensagem: 'Erro interno do servidor.',
        detalhes: error.message 
      });
    }
  }
}

export default AlunoController;
