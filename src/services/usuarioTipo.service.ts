import * as UsuarioTipoModel from '../model/usuarioTipo.model';
import { UsuarioTipo, TipoUsuario } from '../types/models';
import { logError, logSuccess } from '../utils/logger';

export class UsuarioTipoService {
  static async listarTipos(): Promise<UsuarioTipo[]> {
    try {
      const tipos = await UsuarioTipoModel.listarTodos();
      logSuccess('Tipos de usuário listados com sucesso', 'service');
      return tipos;
    } catch (error) {
      logError('Erro ao listar tipos de usuário', 'service', error);
      throw error;
    }
  }

  static async criarTipo(nome_tipo: TipoUsuario): Promise<UsuarioTipo | null> {
    try {
      const novoTipo = await UsuarioTipoModel.criar({ nome_tipo });
      logSuccess('Tipo de usuário criado com sucesso', 'service', { tipo_usuario_id: novoTipo?.tipo_usuario_id });
      return novoTipo || null;
    } catch (error) {
      logError('Erro ao criar tipo de usuário', 'service', error);
      throw error;
    }
  }
}

export default UsuarioTipoService;
