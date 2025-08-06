import * as DadosSaudeModel from '../model/dadosSaude.model';
import * as AlunoModel from '../model/aluno.model';
import { DadosSaude } from '../types/models';
import { logError, logSuccess } from '../utils/logger';

export class DadosSaudeService {
  
  static async criarDadosSaude(dadosSaude: Omit<DadosSaude, 'dados_saude_id' | 'created_at' | 'updated_at'>): Promise<DadosSaude | null> {
    try {
      // Validações básicas
      const camposObrigatorios = [
        'aluno_id', 'vacinas_em_dia', 'dorme_bem', 'alimenta_se_bem',
        'uso_sanitario_sozinho', 'historico_convulsao', 'perda_esfincter_emocional',
        'frequentou_outra_escola', 'gravidez_tranquila', 'tem_irmaos',
        'fonoaudiologico', 'psicopedagogico', 'neurologico'
      ];
      
      for (const campo of camposObrigatorios) {
        if (dadosSaude[campo as keyof typeof dadosSaude] === undefined || dadosSaude[campo as keyof typeof dadosSaude] === null) {
          const erro = new Error(`Campo obrigatório ausente: ${campo}`);
          (erro as any).codigo = 'CAMPO_OBRIGATORIO';
          (erro as any).campo = campo;
          throw erro;
        }
      }

      // Verifica se o aluno existe
      const aluno = await AlunoModel.buscarPorId(dadosSaude.aluno_id);
      if (!aluno) {
        const erro = new Error(`Aluno não encontrado com ID: ${dadosSaude.aluno_id}`);
        (erro as any).codigo = 'ALUNO_NAO_ENCONTRADO';
        (erro as any).aluno_id = dadosSaude.aluno_id;
        throw erro;
      }

      // Verifica se já existem dados de saúde para este aluno
      const dadosExistentes = await DadosSaudeModel.buscarPorAlunoId(dadosSaude.aluno_id);
      if (dadosExistentes) {
        const erro = new Error(`Já existem dados de saúde cadastrados para este aluno: ${dadosSaude.aluno_id}`);
        (erro as any).codigo = 'DADOS_SAUDE_DUPLICADOS';
        (erro as any).aluno_id = dadosSaude.aluno_id;
        (erro as any).dados_saude_existente_id = dadosExistentes.dados_saude_id;
        throw erro;
      }

      // Validação de campos de texto (limpar espaços e verificar tamanho)
      const camposTexto = [
        'necessidades_especiais', 'restricao_alimentar', 'problema_saude',
        'alergia_medicamento', 'uso_continuo_medicamento', 'alergias',
        'medicacao_febre', 'medicacao_dor_cabeca', 'medicacao_dor_barriga',
        'tipo_parto', 'medicacao_gravidez', 'outro_tratamento', 
        'motivo_tratamento', 'observacoes'
      ];

      const dadosLimpos = { ...dadosSaude };
      
      for (const campo of camposTexto) {
        if (dadosLimpos[campo as keyof typeof dadosLimpos]) {
          const valor = String(dadosLimpos[campo as keyof typeof dadosLimpos]).trim();
          if (valor.length > 500) {
            const erro = new Error(`Campo ${campo} deve ter no máximo 500 caracteres. Recebido: ${valor.length} caracteres`);
            (erro as any).codigo = 'CAMPO_MUITO_LONGO';
            (erro as any).campo = campo;
            (erro as any).tamanho_atual = valor.length;
            (erro as any).tamanho_maximo = 500;
            throw erro;
          }
          (dadosLimpos as any)[campo] = valor;
        } else {
          // Se não fornecido, define como string vazia
          (dadosLimpos as any)[campo] = '';
        }
      }

      // Validação específica para tipo_parto
      const tiposPartoValidos = ['Normal', 'Cesárea', 'Fórceps', 'Induzido', 'Outro'];
      if (dadosLimpos.tipo_parto && !tiposPartoValidos.includes(dadosLimpos.tipo_parto)) {
        const erro = new Error(`Tipo de parto inválido: ${dadosLimpos.tipo_parto}. Valores aceitos: ${tiposPartoValidos.join(', ')}`);
        (erro as any).codigo = 'TIPO_PARTO_INVALIDO';
        (erro as any).tipo_parto_recebido = dadosLimpos.tipo_parto;
        (erro as any).tipos_validos = tiposPartoValidos;
        throw erro;
      }

      // Se tipo_parto não fornecido, definir como vazio
      if (!dadosLimpos.tipo_parto) {
        dadosLimpos.tipo_parto = '';
      }

      // Cria os dados de saúde
      const novosDadosSaude = await DadosSaudeModel.criar(dadosLimpos);
      
      logSuccess('Dados de saúde criados com sucesso', 'service', { 
        dados_saude_id: novosDadosSaude.dados_saude_id,
        aluno_id: dadosSaude.aluno_id
      });
      
      return novosDadosSaude;
    } catch (error) {
      logError('Erro ao criar dados de saúde', 'service', error);
      throw error;
    }
  }

  static async buscarPorId(dados_saude_id: string): Promise<any | null> {
    try {
      const dadosSaude = await DadosSaudeModel.buscarComDependencias(dados_saude_id);
      if (!dadosSaude) {
        logError('Dados de saúde não encontrados', 'service', { dados_saude_id });
        return null;
      }

      logSuccess('Dados de saúde encontrados', 'service', { 
        dados_saude_id,
        aluno: `${dadosSaude.nome_aluno} ${dadosSaude.sobrenome_aluno}`
      });
      
      return dadosSaude;
    } catch (error) {
      logError('Erro ao buscar dados de saúde', 'service', error);
      throw error;
    }
  }

  static async buscarPorAlunoId(aluno_id: string): Promise<any | null> {
    try {
      // Verifica se o aluno existe
      const aluno = await AlunoModel.buscarPorId(aluno_id);
      if (!aluno) {
        const erro = new Error(`Aluno não encontrado com ID: ${aluno_id}`);
        (erro as any).codigo = 'ALUNO_NAO_ENCONTRADO';
        (erro as any).aluno_id = aluno_id;
        throw erro;
      }

      const dadosSaude = await DadosSaudeModel.buscarPorAlunoComDependencias(aluno_id);
      if (!dadosSaude) {
        logError('Dados de saúde não encontrados para o aluno', 'service', { aluno_id });
        return null;
      }

      logSuccess('Dados de saúde encontrados para o aluno', 'service', { 
        aluno_id,
        dados_saude_id: dadosSaude.dados_saude_id
      });
      
      return dadosSaude;
    } catch (error) {
      logError('Erro ao buscar dados de saúde por aluno', 'service', error);
      throw error;
    }
  }

  static async listarTodos(): Promise<any[]> {
    try {
      const dadosSaude = await DadosSaudeModel.listarComDependencias();
      
      logSuccess('Lista de dados de saúde obtida', 'service', { 
        total: dadosSaude.length 
      });
      
      return dadosSaude;
    } catch (error) {
      logError('Erro ao listar dados de saúde', 'service', error);
      throw error;
    }
  }

  static async atualizarDadosSaude(dados_saude_id: string, dadosAtualizacao: Partial<Omit<DadosSaude, 'dados_saude_id' | 'created_at' | 'updated_at'>>): Promise<DadosSaude | null> {
    try {
      // Verifica se os dados de saúde existem
      const dadosExistentes = await DadosSaudeModel.buscarPorId(dados_saude_id);
      if (!dadosExistentes) {
        const erro = new Error(`Dados de saúde não encontrados com ID: ${dados_saude_id}`);
        (erro as any).codigo = 'DADOS_SAUDE_NAO_ENCONTRADOS';
        (erro as any).dados_saude_id = dados_saude_id;
        throw erro;
      }

      // Validação de campos de texto se fornecidos
      const camposTexto = [
        'necessidades_especiais', 'restricao_alimentar', 'problema_saude',
        'alergia_medicamento', 'uso_continuo_medicamento', 'alergias',
        'medicacao_febre', 'medicacao_dor_cabeca', 'medicacao_dor_barriga',
        'tipo_parto', 'medicacao_gravidez', 'outro_tratamento', 
        'motivo_tratamento', 'observacoes'
      ];

      const dadosLimpos = { ...dadosAtualizacao };
      
      for (const campo of camposTexto) {
        if (dadosLimpos[campo as keyof typeof dadosLimpos] !== undefined) {
          const valor = String(dadosLimpos[campo as keyof typeof dadosLimpos]).trim();
          if (valor.length > 500) {
            const erro = new Error(`Campo ${campo} deve ter no máximo 500 caracteres. Recebido: ${valor.length} caracteres`);
            (erro as any).codigo = 'CAMPO_MUITO_LONGO';
            (erro as any).campo = campo;
            (erro as any).tamanho_atual = valor.length;
            (erro as any).tamanho_maximo = 500;
            throw erro;
          }
          (dadosLimpos as any)[campo] = valor;
        }
      }

      // Validação específica para tipo_parto se fornecido
      if (dadosLimpos.tipo_parto !== undefined) {
        const tiposPartoValidos = ['Normal', 'Cesárea', 'Fórceps', 'Induzido', 'Outro', ''];
        if (!tiposPartoValidos.includes(dadosLimpos.tipo_parto)) {
          const erro = new Error(`Tipo de parto inválido: ${dadosLimpos.tipo_parto}. Valores aceitos: ${tiposPartoValidos.join(', ')}`);
          (erro as any).codigo = 'TIPO_PARTO_INVALIDO';
          (erro as any).tipo_parto_recebido = dadosLimpos.tipo_parto;
          (erro as any).tipos_validos = tiposPartoValidos.filter(t => t !== '');
          throw erro;
        }
      }

      const dadosSaudeAtualizado = await DadosSaudeModel.atualizar(dados_saude_id, dadosLimpos);
      
      if (!dadosSaudeAtualizado) {
        const erro = new Error(`Falha ao atualizar dados de saúde com ID: ${dados_saude_id}`);
        (erro as any).codigo = 'FALHA_ATUALIZACAO';
        (erro as any).dados_saude_id = dados_saude_id;
        throw erro;
      }
      
      logSuccess('Dados de saúde atualizados com sucesso', 'service', { 
        dados_saude_id,
        aluno_id: dadosSaudeAtualizado.aluno_id
      });
      
      return dadosSaudeAtualizado;
    } catch (error) {
      logError('Erro ao atualizar dados de saúde', 'service', error);
      throw error;
    }
  }

  static async deletarDadosSaude(dados_saude_id: string): Promise<boolean> {
    try {
      // Verifica se os dados de saúde existem
      const dadosSaude = await DadosSaudeModel.buscarPorId(dados_saude_id);
      if (!dadosSaude) {
        logError('Dados de saúde não encontrados para deletar', 'service', { dados_saude_id });
        return false;
      }

      // Deleta os dados de saúde
      const deletado = await DadosSaudeModel.deletar(dados_saude_id);
      
      if (deletado) {
        logSuccess('Dados de saúde deletados com sucesso', 'service', { dados_saude_id });
      } else {
        logError('Falha ao deletar dados de saúde', 'service', { dados_saude_id });
      }
      
      return deletado;
    } catch (error) {
      logError('Erro ao deletar dados de saúde', 'service', error);
      throw error;
    }
  }
}

export default DadosSaudeService;
