import connection from '../connection';
import { UsuarioTipo, TipoUsuario } from '../types/models';

const tabela = 'usuario_tipo';

export const listarTodos = async (): Promise<UsuarioTipo[]> => {
  return await connection(tabela).select('*');
};

export const criar = async (nome_tipo: TipoUsuario): Promise<UsuarioTipo> => {
  const [novoTipo] = await connection(tabela)
    .insert({ nome_tipo, created_at: new Date(), updated_at: new Date() })
    .returning('*');
  return novoTipo;
};
