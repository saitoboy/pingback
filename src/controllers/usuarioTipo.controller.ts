import { Request, Response } from 'express';
import UsuarioTipoService from '../services/usuarioTipo.service';
import { logError, logSuccess } from '../utils/logger';
import { TipoUsuario } from '../types/models';

export class UsuarioTipoController {
  static async listar(req: Request, res: Response) {
    try {
      const tipos = await UsuarioTipoService.listarTipos();
      logSuccess('Tipos de usuário listados', 'controller');
      return res.status(200).json(tipos);
    } catch (error) {
      logError('Erro ao listar tipos de usuário', 'controller', error);
      return res.status(500).json({ mensagem: 'Erro ao listar tipos de usuário.' });
    }
  }

  static async criar(req: Request, res: Response) {
    try {
      const { nome_tipo } = req.body;
      if (!nome_tipo || !Object.values(TipoUsuario).includes(nome_tipo)) {
        logError('Tipo de usuário inválido', 'controller', req.body);
        return res.status(400).json({ mensagem: 'Tipo de usuário inválido.' });
      }
      const novoTipo = await UsuarioTipoService.criarTipo(nome_tipo);
      logSuccess('Tipo de usuário criado', 'controller', { tipo_usuario_id: novoTipo?.tipo_usuario_id });
      return res.status(201).json(novoTipo);
    } catch (error) {
      logError('Erro ao criar tipo de usuário', 'controller', error);
      return res.status(500).json({ mensagem: 'Erro ao criar tipo de usuário.' });
    }
  }
}

export default UsuarioTipoController;
