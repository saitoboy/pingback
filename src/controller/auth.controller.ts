import { Request, Response } from 'express';
import AuthService from '../services/auth.service';
import { logError, logSuccess } from '../utils/logger';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const camposEsperados = ['email', 'senha'];
      const camposFaltando = camposEsperados.filter(campo => !(campo in req.body));
      if (camposFaltando.length > 0) {
        logError(`Erro no login: campos ausentes ou incorretos: ${camposFaltando.join(', ')}`, 'controller', req.body);
        return res.status(400).json({ mensagem: `Campos obrigatórios ausentes ou incorretos: ${camposFaltando.join(', ')}` });
      }
      const { email, senha } = req.body;
      if (!email || !senha) {
        const camposVazios = [];
        if (!email) camposVazios.push('email');
        if (!senha) camposVazios.push('senha');
        logError(`Erro no login: campos sem valor: ${camposVazios.join(', ')}`, 'controller', req.body);
        return res.status(400).json({ mensagem: `Campos obrigatórios sem valor: ${camposVazios.join(', ')}` });
      }
      const resultado = await AuthService.loginUsuario(email, senha);
      if (!resultado) {
        logError(`Erro no login: email ou senha inválidos (${email})`, 'controller', { email });
        return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
      }
      logSuccess(`Login realizado com sucesso: ${resultado.usuario.email_usuario}`, 'controller', { usuario_id: resultado.usuario.usuario_id });
      // Retorna apenas o token, os dados protegidos estão dentro do token JWT
      return res.status(200).json({
        token: resultado.token
      });
    } catch (error: any) {
      if (error.message && error.message.includes('Cannot find module')) {
        logError(`Erro no login: dependência não encontrada (${error.message})`, 'controller', error);
        return res.status(500).json({ mensagem: 'Erro interno: dependência não encontrada.', detalhes: error.message });
      }
      if (error.message && error.message.includes('undefined')) {
        logError(`Erro no login: campo não encontrado ou undefined (${error.message})`, 'controller', error);
        return res.status(400).json({ mensagem: 'Erro: campo não encontrado ou undefined.', detalhes: error.message });
      }
      logError(`Erro no login: inesperado (${error.message})`, 'controller', error);
      return res.status(500).json({ mensagem: 'Erro interno do servidor.', detalhes: error.message });
    }
  }

  static async registrar(req: Request, res: Response) {
    try {
      const camposEsperados = ['nome_usuario', 'email_usuario', 'senha_usuario', 'tipo_usuario_id'];
      const camposFaltando = camposEsperados.filter(campo => !(campo in req.body));
      if (camposFaltando.length > 0) {
        logError(`Erro no cadastro: campos obrigatórios ausentes ou incorretos: ${camposFaltando.join(', ')}.`, 'controller', req.body);
        return res.status(400).json({ mensagem: `Campos obrigatórios ausentes ou incorretos: ${camposFaltando.join(', ')}.` });
      }
      const { nome_usuario, email_usuario, senha_usuario, tipo_usuario_id } = req.body;
      if (!nome_usuario || !email_usuario || !senha_usuario || !tipo_usuario_id) {
        const camposVazios = [];
        if (!nome_usuario) camposVazios.push('nome_usuario');
        if (!email_usuario) camposVazios.push('email_usuario');
        if (!senha_usuario) camposVazios.push('senha_usuario');
        if (!tipo_usuario_id) camposVazios.push('tipo_usuario_id');
        logError(`Erro no cadastro: campos obrigatórios sem valor: ${camposVazios.join(', ')}.`, 'controller', req.body);
        return res.status(400).json({ mensagem: `Campos obrigatórios sem valor: ${camposVazios.join(', ')}.` });
      }
      const usuarioCriado = await AuthService.registrarUsuario(
        nome_usuario,
        email_usuario,
        senha_usuario,
        tipo_usuario_id
      );
      if (!usuarioCriado) {
        logError(`Erro no cadastro: email já cadastrado (${email_usuario}).`, 'controller', { email_usuario });
        return res.status(409).json({ mensagem: 'Email já cadastrado.' });
      }
      logSuccess(`Usuário cadastrado com sucesso: ${usuarioCriado.email_usuario}.`, 'controller', { usuario_id: usuarioCriado.usuario_id });
      return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.', usuario: usuarioCriado });
    } catch (error: any) {
      if (error.code === '23505') {
        logError(`Erro no cadastro: email já cadastrado (constraint) para ${req.body.email_usuario}.`, 'controller', error);
        return res.status(409).json({ mensagem: 'Email já cadastrado (constraint).' });
      }
      if (error.message && error.message.includes('sintaxe de entrada é inválida para tipo uuid')) {
        logError('Erro no cadastro: UUID inválido para tipo_usuario_id. Envie o UUID correto, não o nome.', 'controller', error);
        return res.status(400).json({ mensagem: 'O campo tipo_usuario_id deve ser o UUID do tipo de usuário, não o nome. Consulte /usuario-tipo para obter os UUIDs válidos.', detalhes: error.message });
      }
      logError('Erro no cadastro: erro inesperado ao registrar usuário. Verifique o backend.', 'controller', error);
      return res.status(500).json({ mensagem: 'Erro interno do servidor.', detalhes: error.message });
    }
  }
}

export default AuthController;
