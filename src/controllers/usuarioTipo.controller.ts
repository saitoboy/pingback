import { Request, Response } from 'express';
import * as UsuarioTipoModel from '../model/usuarioTipo.model';
import { logError, logSuccess, logInfo } from '../utils/logger';

export class UsuarioTipoController {
  // 📋 LISTAR TODOS OS TIPOS DE USUÁRIO
  static async listarTiposUsuario(req: Request, res: Response) {
    try {
      logInfo('📋 Listando todos os tipos de usuário...', 'controller');
      
      const tipos = await UsuarioTipoModel.listarTodos();
      
      logSuccess(`✅ ${tipos.length} tipos de usuário encontrados`, 'controller', { total: tipos.length });
      
      return res.status(200).json({
        status: 'sucesso',
        mensagem: 'Tipos de usuário listados com sucesso',
        dados: tipos
      });
    } catch (error: any) {
      logError(`❌ Erro ao listar tipos de usuário: ${error.message}`, 'controller', error);
      return res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor',
        detalhes: error.message
      });
    }
  }

  // 🔍 BUSCAR TIPO DE USUÁRIO POR ID
  static async buscarTipoUsuarioPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        logError('❌ ID do tipo de usuário não fornecido', 'controller');
        return res.status(400).json({
          status: 'erro',
          mensagem: 'ID do tipo de usuário é obrigatório'
        });
      }

      logInfo(`🔍 Buscando tipo de usuário: ${id}`, 'controller');
      
      const tipo = await UsuarioTipoModel.buscarPorId(id);
      
      if (!tipo) {
        logError(`❌ Tipo de usuário não encontrado: ${id}`, 'controller');
        return res.status(404).json({
          status: 'erro',
          mensagem: 'Tipo de usuário não encontrado'
        });
      }

      logSuccess(`✅ Tipo de usuário encontrado: ${tipo.nome_tipo}`, 'controller');
      
      return res.status(200).json({
        status: 'sucesso',
        mensagem: 'Tipo de usuário encontrado com sucesso',
        dados: tipo
      });
    } catch (error: any) {
      logError(`❌ Erro ao buscar tipo de usuário: ${error.message}`, 'controller', error);
      return res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor',
        detalhes: error.message
      });
    }
  }

  // ➕ CRIAR TIPO DE USUÁRIO
  static async criarTipoUsuario(req: Request, res: Response) {
    try {
      const { nome_tipo } = req.body;
      
      // Validação dos campos obrigatórios
      if (!nome_tipo) {
        logError('❌ Nome do tipo não fornecido', 'controller');
        return res.status(400).json({
          status: 'erro',
          mensagem: 'Nome do tipo é obrigatório'
        });
      }

      // Validação do formato do nome
      if (!/^[a-z_]+$/.test(nome_tipo)) {
        logError('❌ Nome do tipo inválido', 'controller', { nome_tipo });
        return res.status(400).json({
          status: 'erro',
          mensagem: 'Nome do tipo deve conter apenas letras minúsculas e underscore'
        });
      }

      // Verificar se o tipo já existe
      const tipoExistente = await UsuarioTipoModel.buscarPorNome(nome_tipo);
      if (tipoExistente) {
        logError(`❌ Tipo de usuário já existe: ${nome_tipo}`, 'controller');
        return res.status(409).json({
          status: 'erro',
          mensagem: 'Tipo de usuário já existe'
        });
      }

      logInfo(`➕ Criando tipo de usuário: ${nome_tipo}`, 'controller');
      
      const novoTipo = await UsuarioTipoModel.criar({
        nome_tipo
      });
      
      if (!novoTipo) {
        logError(`❌ Falha ao criar tipo de usuário: ${nome_tipo}`, 'controller');
        return res.status(500).json({
          status: 'erro',
          mensagem: 'Falha ao criar tipo de usuário'
        });
      }

      logSuccess(`✅ Tipo de usuário criado: ${novoTipo.nome_tipo}`, 'controller');
      
      return res.status(201).json({
        status: 'sucesso',
        mensagem: 'Tipo de usuário criado com sucesso',
        dados: novoTipo
      });
    } catch (error: any) {
      logError(`❌ Erro ao criar tipo de usuário: ${error.message}`, 'controller', error);
      return res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor',
        detalhes: error.message
      });
    }
  }

  // ✏️ ATUALIZAR TIPO DE USUÁRIO
  static async atualizarTipoUsuario(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome_tipo } = req.body;
      
      if (!id) {
        logError('❌ ID do tipo de usuário não fornecido', 'controller');
        return res.status(400).json({
          status: 'erro',
          mensagem: 'ID do tipo de usuário é obrigatório'
        });
      }

      // Verificar se o tipo existe
      const tipoExistente = await UsuarioTipoModel.buscarPorId(id);
      if (!tipoExistente) {
        logError(`❌ Tipo de usuário não encontrado: ${id}`, 'controller');
        return res.status(404).json({
          status: 'erro',
          mensagem: 'Tipo de usuário não encontrado'
        });
      }

      // Validação do formato do nome (se fornecido)
      if (nome_tipo && !/^[a-z_]+$/.test(nome_tipo)) {
        logError('❌ Nome do tipo inválido', 'controller', { nome_tipo });
        return res.status(400).json({
          status: 'erro',
          mensagem: 'Nome do tipo deve conter apenas letras minúsculas e underscore'
        });
      }

      // Verificar se o novo nome já existe (se diferente do atual)
      if (nome_tipo && nome_tipo !== tipoExistente.nome_tipo) {
        const tipoComNome = await UsuarioTipoModel.buscarPorNome(nome_tipo);
        if (tipoComNome) {
          logError(`❌ Nome do tipo já existe: ${nome_tipo}`, 'controller');
          return res.status(409).json({
            status: 'erro',
            mensagem: 'Nome do tipo já existe'
          });
        }
      }

      logInfo(`✏️ Atualizando tipo de usuário: ${id}`, 'controller');
      
      const dadosAtualizacao: any = {};
      if (nome_tipo) dadosAtualizacao.nome_tipo = nome_tipo;

      const tipoAtualizado = await UsuarioTipoModel.atualizar(id, dadosAtualizacao);
      
      if (!tipoAtualizado) {
        logError(`❌ Falha ao atualizar tipo de usuário: ${id}`, 'controller');
        return res.status(500).json({
          status: 'erro',
          mensagem: 'Falha ao atualizar tipo de usuário'
        });
      }

      logSuccess(`✅ Tipo de usuário atualizado: ${tipoAtualizado.nome_tipo}`, 'controller');
      
      return res.status(200).json({
        status: 'sucesso',
        mensagem: 'Tipo de usuário atualizado com sucesso',
        dados: tipoAtualizado
      });
    } catch (error: any) {
      logError(`❌ Erro ao atualizar tipo de usuário: ${error.message}`, 'controller', error);
      return res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor',
        detalhes: error.message
      });
    }
  }

  // 🗑️ EXCLUIR TIPO DE USUÁRIO
  static async excluirTipoUsuario(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        logError('❌ ID do tipo de usuário não fornecido', 'controller');
        return res.status(400).json({
          status: 'erro',
          mensagem: 'ID do tipo de usuário é obrigatório'
        });
      }

      // Verificar se o tipo existe
      const tipoExistente = await UsuarioTipoModel.buscarPorId(id);
      if (!tipoExistente) {
        logError(`❌ Tipo de usuário não encontrado: ${id}`, 'controller');
        return res.status(404).json({
          status: 'erro',
          mensagem: 'Tipo de usuário não encontrado'
        });
      }

      // TODO: Verificar se há usuários usando este tipo antes de excluir
      // const usuariosComTipo = await UsuarioModel.buscarPorTipo(id);
      // if (usuariosComTipo.length > 0) {
      //   return res.status(409).json({
      //     status: 'erro',
      //     mensagem: 'Não é possível excluir tipo que está sendo usado por usuários'
      //   });
      // }

      logInfo(`🗑️ Excluindo tipo de usuário: ${id}`, 'controller');
      
      const sucesso = await UsuarioTipoModel.deletar(id);
      
      if (!sucesso) {
        logError(`❌ Falha ao excluir tipo de usuário: ${id}`, 'controller');
        return res.status(500).json({
          status: 'erro',
          mensagem: 'Falha ao excluir tipo de usuário'
        });
      }

      logSuccess(`✅ Tipo de usuário excluído: ${tipoExistente.nome_tipo}`, 'controller');
      
      return res.status(200).json({
        status: 'sucesso',
        mensagem: 'Tipo de usuário excluído com sucesso'
      });
    } catch (error: any) {
      logError(`❌ Erro ao excluir tipo de usuário: ${error.message}`, 'controller', error);
      return res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor',
        detalhes: error.message
      });
    }
  }
}

export default UsuarioTipoController;