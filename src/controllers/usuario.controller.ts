import { Request, Response } from 'express';
import * as UsuarioModel from '../model/usuario.model';
import { logError, logSuccess, logInfo } from '../utils/logger';

export class UsuarioController {
  // 📋 LISTAR TODOS OS USUÁRIOS
  static async listarUsuarios(req: Request, res: Response) {
    try {
      const { tipo } = req.query;
      
      // Se foi passado filtro de tipo, buscar por tipo
      if (tipo && typeof tipo === 'string') {
        logInfo(`📋 Listando usuários do tipo: ${tipo}`, 'controller');
        
        const usuarios = await UsuarioModel.listarPorTipo(tipo);
        
        logSuccess(`✅ ${usuarios.length} usuários do tipo "${tipo}" encontrados`, 'controller', { total: usuarios.length });
        
        return res.status(200).json({
          status: 'sucesso',
          mensagem: `Usuários do tipo "${tipo}" listados com sucesso`,
          usuarios: usuarios,
          total: usuarios.length
        });
      }
      
      // Caso contrário, listar todos
      logInfo('📋 Listando todos os usuários...', 'controller');
      
      const usuarios = await UsuarioModel.listarTodos();
      
      logSuccess(`✅ ${usuarios.length} usuários encontrados`, 'controller', { total: usuarios.length });
      
      return res.status(200).json({
        status: 'sucesso',
        mensagem: 'Usuários listados com sucesso',
        usuarios: usuarios,
        total: usuarios.length
      });
    } catch (error: any) {
      logError(`❌ Erro ao listar usuários: ${error.message}`, 'controller', error);
      return res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor',
        detalhes: error.message
      });
    }
  }

  // 🔍 BUSCAR USUÁRIO POR ID
  static async buscarUsuarioPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        logError('❌ ID do usuário não fornecido', 'controller');
        return res.status(400).json({
          status: 'erro',
          mensagem: 'ID do usuário é obrigatório'
        });
      }

      logInfo(`🔍 Buscando usuário: ${id}`, 'controller');
      
      const usuario = await UsuarioModel.buscarPorId(id);
      
      if (!usuario) {
        logError(`❌ Usuário não encontrado: ${id}`, 'controller');
        return res.status(404).json({
          status: 'erro',
          mensagem: 'Usuário não encontrado'
        });
      }

      logSuccess(`✅ Usuário encontrado: ${usuario.nome_usuario}`, 'controller');
      
      return res.status(200).json({
        status: 'sucesso',
        mensagem: 'Usuário encontrado com sucesso',
        usuario: usuario
      });
    } catch (error: any) {
      logError(`❌ Erro ao buscar usuário: ${error.message}`, 'controller', error);
      return res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor',
        detalhes: error.message
      });
    }
  }

  // ✏️ ATUALIZAR USUÁRIO
  static async atualizarUsuario(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome_usuario, email_usuario, tipo_usuario_id } = req.body;
      
      if (!id) {
        logError('❌ ID do usuário não fornecido', 'controller');
        return res.status(400).json({
          status: 'erro',
          mensagem: 'ID do usuário é obrigatório'
        });
      }

      // Verificar se o usuário existe
      const usuarioExistente = await UsuarioModel.buscarPorId(id);
      if (!usuarioExistente) {
        logError(`❌ Usuário não encontrado: ${id}`, 'controller');
        return res.status(404).json({
          status: 'erro',
          mensagem: 'Usuário não encontrado'
        });
      }

      // Verificar se o email já existe em outro usuário
      if (email_usuario && email_usuario !== usuarioExistente.email_usuario) {
        const usuarioComEmail = await UsuarioModel.buscarPorEmail(email_usuario);
        if (usuarioComEmail && usuarioComEmail.usuario_id !== id) {
          logError(`❌ Email já cadastrado: ${email_usuario}`, 'controller');
          return res.status(409).json({
            status: 'erro',
            mensagem: 'Email já cadastrado por outro usuário'
          });
        }
      }

      logInfo(`✏️ Atualizando usuário: ${id}`, 'controller');
      
      const dadosAtualizacao: any = {};
      if (nome_usuario) dadosAtualizacao.nome_usuario = nome_usuario;
      if (email_usuario) dadosAtualizacao.email_usuario = email_usuario;
      if (tipo_usuario_id) dadosAtualizacao.tipo_usuario_id = tipo_usuario_id;

      const usuarioAtualizado = await UsuarioModel.atualizar(id, dadosAtualizacao);
      
      if (!usuarioAtualizado) {
        logError(`❌ Falha ao atualizar usuário: ${id}`, 'controller');
        return res.status(500).json({
          status: 'erro',
          mensagem: 'Falha ao atualizar usuário'
        });
      }

      logSuccess(`✅ Usuário atualizado: ${usuarioAtualizado.nome_usuario}`, 'controller');
      
      return res.status(200).json({
        status: 'sucesso',
        mensagem: 'Usuário atualizado com sucesso',
        usuario: usuarioAtualizado
      });
    } catch (error: any) {
      logError(`❌ Erro ao atualizar usuário: ${error.message}`, 'controller', error);
      return res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor',
        detalhes: error.message
      });
    }
  }

  // 🗑️ EXCLUIR USUÁRIO
  static async excluirUsuario(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        logError('❌ ID do usuário não fornecido', 'controller');
        return res.status(400).json({
          status: 'erro',
          mensagem: 'ID do usuário é obrigatório'
        });
      }

      // Verificar se o usuário existe
      const usuarioExistente = await UsuarioModel.buscarPorId(id);
      if (!usuarioExistente) {
        logError(`❌ Usuário não encontrado: ${id}`, 'controller');
        return res.status(404).json({
          status: 'erro',
          mensagem: 'Usuário não encontrado'
        });
      }

      logInfo(`🗑️ Excluindo usuário: ${id}`, 'controller');
      
      const sucesso = await UsuarioModel.deletar(id);
      
      if (!sucesso) {
        logError(`❌ Falha ao excluir usuário: ${id}`, 'controller');
        return res.status(500).json({
          status: 'erro',
          mensagem: 'Falha ao excluir usuário'
        });
      }

      logSuccess(`✅ Usuário excluído: ${usuarioExistente.nome_usuario}`, 'controller');
      
      return res.status(200).json({
        status: 'sucesso',
        mensagem: 'Usuário excluído com sucesso'
      });
    } catch (error: any) {
      logError(`❌ Erro ao excluir usuário: ${error.message}`, 'controller', error);
      return res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor',
        detalhes: error.message
      });
    }
  }
}

export default UsuarioController;
