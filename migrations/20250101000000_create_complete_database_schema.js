/**
 * Migration completa do Sistema Escolar Pinguinho
 * Cria todas as tabelas do banco de dados em uma única migration
 * 
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Habilitar extensão UUID se não estiver habilitada
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  
  // 1. TIPOS DE USUÁRIO
  await knex.schema.createTable('usuario_tipo', function(table) {
    table.uuid('tipo_usuario_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.enum('nome_tipo', ['admin', 'secretario', 'professor']).notNullable().unique();
    table.timestamps(true, true);
    
    // Índices
    table.index('nome_tipo');
  });

  // 2. USUÁRIOS
  await knex.schema.createTable('usuario', function(table) {
    table.uuid('usuario_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('nome_usuario', 100).notNullable();
    table.string('email_usuario', 150).notNullable().unique();
    table.string('senha_usuario', 255).notNullable();
    table.uuid('tipo_usuario_id').notNullable();
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('tipo_usuario_id').references('tipo_usuario_id').inTable('usuario_tipo').onDelete('CASCADE');
    
    // Índices
    table.index('email_usuario');
    table.index('tipo_usuario_id');
    table.index('created_at');
  });

  // 3. PROFESSORES
  await knex.schema.createTable('professor', function(table) {
    table.uuid('professor_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('usuario_id').notNullable().unique();
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('usuario_id').references('usuario_id').inTable('usuario').onDelete('CASCADE');
    
    // Índices
    table.index('usuario_id');
  });

  // 4. RELIGIÕES
  await knex.schema.createTable('religiao', function(table) {
    table.uuid('religiao_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('nome_religiao', 100).notNullable().unique();
    table.timestamps(true, true);
    
    // Índices
    table.index('nome_religiao');
  });

  // 5. CERTIDÕES DE NASCIMENTO
  await knex.schema.createTable('certidao_nascimento', function(table) {
    table.uuid('certidao_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('livro_certidao', 20).notNullable();
    table.string('matricula_certidao', 20).notNullable();
    table.string('termo_certidao', 20).notNullable();
    table.string('folha_certidao', 20).notNullable();
    table.date('data_expedicao_certidao').notNullable();
    table.string('nome_cartorio_certidao', 200).notNullable();
    table.timestamps(true, true);
    
    // Índices
    table.index('livro_certidao');
    table.index('matricula_certidao');
    table.index('termo_certidao');
  });

  // 6. ALUNOS
  await knex.schema.createTable('aluno', function(table) {
    table.uuid('aluno_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('nome_aluno', 100).notNullable();
    table.string('sobrenome_aluno', 100).notNullable();
    table.date('data_nascimento_aluno').notNullable();
    table.string('cpf_aluno', 14).notNullable().unique();
    table.string('rg_aluno', 20).notNullable().unique();
    table.string('naturalidade_aluno', 100).notNullable();
    table.string('endereco_aluno', 200).notNullable();
    table.string('bairro_aluno', 100).notNullable();
    table.string('cep_aluno', 9).notNullable();
    table.string('numero_matricula_aluno', 20).unique();
    table.uuid('religiao_id').nullable();
    table.uuid('certidao_id').nullable();
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('religiao_id').references('religiao_id').inTable('religiao').onDelete('SET NULL');
    table.foreign('certidao_id').references('certidao_id').inTable('certidao_nascimento').onDelete('SET NULL');
    
    // Índices
    table.index('cpf_aluno');
    table.index('rg_aluno');
    table.index('numero_matricula_aluno');
    table.index('nome_aluno');
    table.index('sobrenome_aluno');
    table.index('religiao_id');
    table.index('certidao_id');
  });

  // 7. PARENTESCOS
  await knex.schema.createTable('parentesco', function(table) {
    table.uuid('parentesco_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('nome_parentesco', 50).notNullable().unique();
    table.timestamps(true, true);
    
    // Índices
    table.index('nome_parentesco');
  });

  // 8. RESPONSÁVEIS
  await knex.schema.createTable('responsavel', function(table) {
    table.uuid('responsavel_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('aluno_id').notNullable();
    table.string('telefone_responsavel', 20).notNullable();
    table.string('nome_responsavel', 100).notNullable();
    table.string('sobrenome_responsavel', 100).notNullable();
    table.string('rg_responsavel', 20).notNullable();
    table.string('cpf_responsavel', 14).notNullable();
    table.string('grau_instrucao_responsavel', 100).notNullable();
    table.string('email_responsavel', 150).nullable();
    table.uuid('parentesco_id').notNullable();
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('aluno_id').references('aluno_id').inTable('aluno').onDelete('CASCADE');
    table.foreign('parentesco_id').references('parentesco_id').inTable('parentesco').onDelete('CASCADE');
    
    // Índices
    table.index('aluno_id');
    table.index('cpf_responsavel');
    table.index('rg_responsavel');
    table.index('parentesco_id');
  });

  // 9. DADOS DE SAÚDE
  await knex.schema.createTable('dados_saude', function(table) {
    table.uuid('dados_saude_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('aluno_id').notNullable().unique();
    table.text('necessidades_especiais').nullable();
    table.boolean('vacinas_em_dia').notNullable().defaultTo(true);
    table.boolean('dorme_bem').notNullable().defaultTo(true);
    table.boolean('alimenta_se_bem').notNullable().defaultTo(true);
    table.boolean('uso_sanitario_sozinho').notNullable().defaultTo(true);
    table.text('restricao_alimentar').nullable();
    table.text('problema_saude').nullable();
    table.text('alergia_medicamento').nullable();
    table.text('uso_continuo_medicamento').nullable();
    table.text('alergias').nullable();
    table.text('medicacao_febre').nullable();
    table.text('medicacao_dor_cabeca').nullable();
    table.text('medicacao_dor_barriga').nullable();
    table.boolean('historico_convulsao').notNullable().defaultTo(false);
    table.boolean('perda_esfincter_emocional').notNullable().defaultTo(false);
    table.boolean('frequentou_outra_escola').notNullable().defaultTo(false);
    table.string('tipo_parto', 50).nullable();
    table.boolean('gravidez_tranquila').notNullable().defaultTo(true);
    table.text('medicacao_gravidez').nullable();
    table.boolean('tem_irmaos').notNullable().defaultTo(false);
    table.boolean('fonoaudiologico').notNullable().defaultTo(false);
    table.boolean('psicopedagogico').notNullable().defaultTo(false);
    table.boolean('neurologico').notNullable().defaultTo(false);
    table.text('outro_tratamento').nullable();
    table.text('motivo_tratamento').nullable();
    table.text('observacoes').nullable();
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('aluno_id').references('aluno_id').inTable('aluno').onDelete('CASCADE');
    
    // Índices
    table.index('aluno_id');
  });

  // 10. DIAGNÓSTICOS
  await knex.schema.createTable('diagnostico', function(table) {
    table.uuid('diagnostico_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('aluno_id').notNullable().unique();
    table.boolean('cegueira').notNullable().defaultTo(false);
    table.boolean('baixa_visao').notNullable().defaultTo(false);
    table.boolean('surdez').notNullable().defaultTo(false);
    table.boolean('deficiencia_auditiva').notNullable().defaultTo(false);
    table.boolean('surdocegueira').notNullable().defaultTo(false);
    table.boolean('deficiencia_fisica').notNullable().defaultTo(false);
    table.boolean('deficiencia_multipla').notNullable().defaultTo(false);
    table.boolean('deficiencia_intelectual').notNullable().defaultTo(false);
    table.boolean('sindrome_down').notNullable().defaultTo(false);
    table.boolean('altas_habilidades').notNullable().defaultTo(false);
    table.boolean('tea').notNullable().defaultTo(false);
    table.boolean('alteracoes_processamento_auditivo').notNullable().defaultTo(false);
    table.boolean('tdah').notNullable().defaultTo(false);
    table.text('outros_diagnosticos').nullable();
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('aluno_id').references('aluno_id').inTable('aluno').onDelete('CASCADE');
    
    // Índices
    table.index('aluno_id');
  });

  // 11. ANOS LETIVOS
  await knex.schema.createTable('ano_letivo', function(table) {
    table.uuid('ano_letivo_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.integer('ano').notNullable().unique();
    table.date('data_inicio').notNullable();
    table.date('data_fim').notNullable();
    table.boolean('ativo').notNullable().defaultTo(false);
    table.timestamps(true, true);
    
    // Índices
    table.index('ano');
    table.index('ativo');
    table.index('created_at');
  });

  // 12. PERÍODOS LETIVOS (BIMESTRES)
  await knex.schema.createTable('periodo_letivo', function(table) {
    table.uuid('periodo_letivo_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.integer('bimestre').notNullable();
    table.uuid('ano_letivo_id').notNullable();
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('ano_letivo_id').references('ano_letivo_id').inTable('ano_letivo').onDelete('CASCADE');
    
    // Índices
    table.index('bimestre');
    table.index('ano_letivo_id');
    table.index('created_at');
    
    // Constraint de unicidade
    table.unique(['bimestre', 'ano_letivo_id']);
  });

  // 13. SÉRIES
  await knex.schema.createTable('serie', function(table) {
    table.uuid('serie_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('nome_serie', 50).notNullable().unique();
    table.timestamps(true, true);
    
    // Índices
    table.index('nome_serie');
  });

  // 14. TURMAS
  await knex.schema.createTable('turma', function(table) {
    table.uuid('turma_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('serie_id').notNullable();
    table.uuid('ano_letivo_id').notNullable();
    table.string('nome_turma', 50).notNullable();
    table.enum('turno', ['manha', 'tarde', 'noite']).notNullable();
    table.string('sala', 20).notNullable();
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('serie_id').references('serie_id').inTable('serie').onDelete('CASCADE');
    table.foreign('ano_letivo_id').references('ano_letivo_id').inTable('ano_letivo').onDelete('CASCADE');
    
    // Índices
    table.index('serie_id');
    table.index('ano_letivo_id');
    table.index('nome_turma');
    table.index('turno');
  });

  // 15. MATRÍCULAS DE ALUNOS
  await knex.schema.createTable('matricula_aluno', function(table) {
    table.uuid('matricula_aluno_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('ra', 10).unique();
    table.uuid('aluno_id').notNullable();
    table.uuid('turma_id').notNullable();
    table.uuid('ano_letivo_id').notNullable();
    table.date('data_matricula').notNullable();
    table.date('data_saida').nullable();
    table.string('motivo_saida', 200).nullable();
    table.enum('status', ['ativo', 'transferido', 'concluido', 'cancelado']).notNullable().defaultTo('ativo');
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('aluno_id').references('aluno_id').inTable('aluno').onDelete('CASCADE');
    table.foreign('turma_id').references('turma_id').inTable('turma').onDelete('CASCADE');
    table.foreign('ano_letivo_id').references('ano_letivo_id').inTable('ano_letivo').onDelete('CASCADE');
    
    // Índices
    table.index('ra');
    table.index('aluno_id');
    table.index('turma_id');
    table.index('ano_letivo_id');
    table.index('status');
    table.index('data_matricula');
  });

  // 16. DISCIPLINAS
  await knex.schema.createTable('disciplina', function(table) {
    table.uuid('disciplina_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('nome_disciplina', 100).notNullable().unique();
    table.timestamps(true, true);
    
    // Índices
    table.index('nome_disciplina');
  });

  // 17. VINCULAÇÃO TURMA-DISCIPLINA-PROFESSOR
  await knex.schema.createTable('turma_disciplina_professor', function(table) {
    table.uuid('turma_disciplina_professor_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('turma_id').notNullable();
    table.uuid('disciplina_id').notNullable();
    table.uuid('professor_id').notNullable();
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('turma_id').references('turma_id').inTable('turma').onDelete('CASCADE');
    table.foreign('disciplina_id').references('disciplina_id').inTable('disciplina').onDelete('CASCADE');
    table.foreign('professor_id').references('usuario_id').inTable('usuario').onDelete('CASCADE');
    
    // Índices
    table.index('turma_id');
    table.index('disciplina_id');
    table.index('professor_id');
    
    // Constraint de unicidade
    table.unique(['turma_id', 'disciplina_id', 'professor_id']);
  });

  // 18. AULAS
  await knex.schema.createTable('aula', function(table) {
    table.uuid('aula_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('turma_disciplina_professor_id').notNullable();
    table.date('data_aula').notNullable();
    table.time('hora_inicio').notNullable();
    table.time('hora_fim').notNullable();
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('turma_disciplina_professor_id').references('turma_disciplina_professor_id').inTable('turma_disciplina_professor').onDelete('CASCADE');
    
    // Índices
    table.index('turma_disciplina_professor_id');
    table.index('data_aula');
    table.index(['data_aula', 'hora_inicio']);
  });

  // 19. CONTEÚDO DAS AULAS
  await knex.schema.createTable('conteudo_aula', function(table) {
    table.uuid('conteudo_aula_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('aula_id').notNullable();
    table.string('descricao', 200).notNullable();
    table.text('conteudo').notNullable();
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('aula_id').references('aula_id').inTable('aula').onDelete('CASCADE');
    
    // Índices
    table.index('aula_id');
    table.index('descricao');
  });

  // 20. ATIVIDADES
  await knex.schema.createTable('atividade', function(table) {
    table.uuid('atividade_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('titulo', 200).notNullable();
    table.text('descricao').notNullable();
    table.decimal('peso', 3, 1).notNullable().defaultTo(1.0);
    table.boolean('vale_nota').notNullable().defaultTo(true);
    table.uuid('periodo_letivo_id').notNullable();
    table.uuid('aula_id').nullable();
    table.uuid('turma_disciplina_professor_id').notNullable();
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('periodo_letivo_id').references('periodo_letivo_id').inTable('periodo_letivo').onDelete('CASCADE');
    table.foreign('aula_id').references('aula_id').inTable('aula').onDelete('SET NULL');
    table.foreign('turma_disciplina_professor_id').references('turma_disciplina_professor_id').inTable('turma_disciplina_professor').onDelete('CASCADE');
    
    // Índices
    table.index('periodo_letivo_id');
    table.index('aula_id');
    table.index('turma_disciplina_professor_id');
    table.index('titulo');
    table.index('vale_nota');
    
    // Constraint para peso positivo
    table.check('peso > 0');
  });

  // 21. NOTAS
  await knex.schema.createTable('nota', function(table) {
    table.uuid('nota_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('atividade_id').notNullable();
    table.uuid('matricula_aluno_id').notNullable();
    table.decimal('valor', 3, 1).notNullable();
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('atividade_id').references('atividade_id').inTable('atividade').onDelete('CASCADE');
    table.foreign('matricula_aluno_id').references('matricula_aluno_id').inTable('matricula_aluno').onDelete('CASCADE');
    
    // Índices
    table.index('atividade_id');
    table.index('matricula_aluno_id');
    table.index('valor');
    table.index('created_at');
    
    // Constraint de unicidade - um aluno pode ter apenas uma nota por atividade
    table.unique(['atividade_id', 'matricula_aluno_id']);
    
    // Constraint para valor da nota entre 0 e 10
    table.check('valor >= 0 AND valor <= 10');
  });

  // 22. FREQUÊNCIA
  await knex.schema.createTable('frequencia', function(table) {
    table.uuid('frequencia_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('aula_id').notNullable();
    table.uuid('matricula_aluno_id').notNullable();
    table.boolean('presenca').notNullable().defaultTo(true);
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('aula_id').references('aula_id').inTable('aula').onDelete('CASCADE');
    table.foreign('matricula_aluno_id').references('matricula_aluno_id').inTable('matricula_aluno').onDelete('CASCADE');
    
    // Índices
    table.index('aula_id');
    table.index('matricula_aluno_id');
    table.index('presenca');
    
    // Constraint de unicidade - um aluno pode ter apenas uma frequência por aula
    table.unique(['aula_id', 'matricula_aluno_id']);
  });

  // 23. MÉDIA DISCIPLINA BIMESTRE
  await knex.schema.createTable('media_disciplina_bimestre', function(table) {
    table.uuid('media_disciplina_bimestre_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('matricula_aluno_id').notNullable();
    table.uuid('turma_disciplina_professor_id').notNullable();
    table.uuid('periodo_letivo_id').notNullable();
    table.decimal('valor_media', 4, 2).notNullable();
    table.enum('origem', ['manual', 'calculada']).notNullable().defaultTo('calculada');
    table.text('observacao').nullable();
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('matricula_aluno_id').references('matricula_aluno_id').inTable('matricula_aluno').onDelete('CASCADE');
    table.foreign('turma_disciplina_professor_id').references('turma_disciplina_professor_id').inTable('turma_disciplina_professor').onDelete('CASCADE');
    table.foreign('periodo_letivo_id').references('periodo_letivo_id').inTable('periodo_letivo').onDelete('CASCADE');
    
    // Índices
    table.index('matricula_aluno_id');
    table.index('turma_disciplina_professor_id');
    table.index('periodo_letivo_id');
    table.index('valor_media');
    table.index('origem');
    
    // Constraint de unicidade
    table.unique(['matricula_aluno_id', 'turma_disciplina_professor_id', 'periodo_letivo_id']);
    
    // Constraint para valor da média entre 0 e 10
    table.check('valor_media >= 0 AND valor_media <= 10');
  });

  // 24. BOLETIM
  await knex.schema.createTable('boletim', function(table) {
    table.uuid('boletim_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('matricula_aluno_id').notNullable();
    table.uuid('periodo_letivo_id').notNullable();
    table.text('observacoes_gerais').nullable();
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('matricula_aluno_id').references('matricula_aluno_id').inTable('matricula_aluno').onDelete('CASCADE');
    table.foreign('periodo_letivo_id').references('periodo_letivo_id').inTable('periodo_letivo').onDelete('CASCADE');
    
    // Índices
    table.index('matricula_aluno_id');
    table.index('periodo_letivo_id');
    table.index(['matricula_aluno_id', 'periodo_letivo_id']);
    
    // Constraint de unicidade: um boletim por aluno por bimestre
    table.unique(['matricula_aluno_id', 'periodo_letivo_id']);
  });

  // 25. BOLETIM DISCIPLINA
  await knex.schema.createTable('boletim_disciplina', function(table) {
    table.uuid('boletim_disciplina_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('boletim_id').notNullable();
    table.uuid('turma_disciplina_professor_id').notNullable();
    table.decimal('media_bimestre', 4, 2).notNullable();
    table.integer('faltas_bimestre').notNullable().defaultTo(0);
    table.text('observacoes_disciplina').nullable();
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('boletim_id').references('boletim_id').inTable('boletim').onDelete('CASCADE');
    table.foreign('turma_disciplina_professor_id').references('turma_disciplina_professor_id').inTable('turma_disciplina_professor').onDelete('CASCADE');
    
    // Índices
    table.index('boletim_id');
    table.index('turma_disciplina_professor_id');
    table.index('media_bimestre');
    
    // Constraint de unicidade
    table.unique(['boletim_id', 'turma_disciplina_professor_id']);
    
    // Constraint para valor da média entre 0 e 10
    table.check('media_bimestre >= 0 AND media_bimestre <= 10');
    
    // Constraint para faltas não negativas
    table.check('faltas_bimestre >= 0');
  });

  // 26. HISTÓRICO ESCOLAR
  await knex.schema.createTable('historico_escolar', function(table) {
    table.uuid('historico_escolar_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('matricula_aluno_id').notNullable();
    table.uuid('ano_letivo_id').notNullable();
    table.decimal('media_final_anual', 4, 2).notNullable();
    table.integer('total_faltas_anual').notNullable().defaultTo(0);
    table.enum('situacao_final', ['aprovado', 'reprovado', 'aprovado_conselho', 'transferido', 'em_andamento'])
         .notNullable()
         .defaultTo('em_andamento');
    table.text('observacoes_finais').nullable();
    table.date('data_conclusao').nullable();
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('matricula_aluno_id').references('matricula_aluno_id').inTable('matricula_aluno').onDelete('CASCADE');
    table.foreign('ano_letivo_id').references('ano_letivo_id').inTable('ano_letivo').onDelete('CASCADE');
    
    // Índices
    table.index('matricula_aluno_id');
    table.index('ano_letivo_id');
    table.index('situacao_final');
    
    // Constraint de unicidade: um histórico por aluno por ano letivo
    table.unique(['matricula_aluno_id', 'ano_letivo_id']);
    
    // Constraint para valor da média entre 0 e 10
    table.check('media_final_anual >= 0 AND media_final_anual <= 10');
    
    // Constraint para faltas não negativas
    table.check('total_faltas_anual >= 0');
  });

  // 27. HISTÓRICO ESCOLAR DISCIPLINA
  await knex.schema.createTable('historico_escolar_disciplina', function(table) {
    table.uuid('historico_disciplina_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('historico_escolar_id').notNullable();
    table.uuid('turma_disciplina_professor_id').notNullable();
    table.decimal('media_final_disciplina', 4, 2).notNullable();
    table.integer('total_faltas_disciplina').notNullable().defaultTo(0);
    table.enum('situacao_disciplina', ['aprovado', 'reprovado', 'recuperacao', 'em_andamento'])
         .notNullable()
         .defaultTo('em_andamento');
    table.text('observacoes_disciplina').nullable();
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('historico_escolar_id').references('historico_escolar_id').inTable('historico_escolar').onDelete('CASCADE');
    table.foreign('turma_disciplina_professor_id').references('turma_disciplina_professor_id').inTable('turma_disciplina_professor').onDelete('CASCADE');
    
    // Índices
    table.index('historico_escolar_id');
    table.index('turma_disciplina_professor_id');
    table.index('situacao_disciplina');
    
    // Constraint de unicidade
    table.unique(['historico_escolar_id', 'turma_disciplina_professor_id']);
    
    // Constraint para valor da média entre 0 e 10
    table.check('media_final_disciplina >= 0 AND media_final_disciplina <= 10');
    
    // Constraint para faltas não negativas
    table.check('total_faltas_disciplina >= 0');
  });

  // 28. ALOCAÇÃO PROFESSOR (tabela adicional para controle de alocação)
  await knex.schema.createTable('alocacao_professor', function(table) {
    table.uuid('alocacao_professor_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('professor_id').notNullable();
    table.uuid('turma_disciplina_professor_id').notNullable();
    table.date('data_inicio').notNullable();
    table.date('data_fim').nullable();
    table.boolean('ativo').notNullable().defaultTo(true);
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('professor_id').references('usuario_id').inTable('usuario').onDelete('CASCADE');
    table.foreign('turma_disciplina_professor_id').references('turma_disciplina_professor_id').inTable('turma_disciplina_professor').onDelete('CASCADE');
    
    // Índices
    table.index('professor_id');
    table.index('turma_disciplina_professor_id');
    table.index('ativo');
    table.index('data_inicio');
  });

  // INSERIR DADOS INICIAIS
  
  // Tipos de usuário
  await knex('usuario_tipo').insert([
    { nome_tipo: 'admin' },
    { nome_tipo: 'secretario' },
    { nome_tipo: 'professor' }
  ]);

  // Religiões básicas
  await knex('religiao').insert([
    { nome_religiao: 'Católica' },
    { nome_religiao: 'Evangélica' },
    { nome_religiao: 'Espírita' },
    { nome_religiao: 'Budista' },
    { nome_religiao: 'Judaica' },
    { nome_religiao: 'Muçulmana' },
    { nome_religiao: 'Sem religião' },
    { nome_religiao: 'Outras' }
  ]);

  // Parentescos básicos
  await knex('parentesco').insert([
    { nome_parentesco: 'Pai' },
    { nome_parentesco: 'Mãe' },
    { nome_parentesco: 'Avô' },
    { nome_parentesco: 'Avó' },
    { nome_parentesco: 'Tio' },
    { nome_parentesco: 'Tia' },
    { nome_parentesco: 'Irmão' },
    { nome_parentesco: 'Irmã' },
    { nome_parentesco: 'Responsável Legal' },
    { nome_parentesco: 'Outros' }
  ]);

  // Séries básicas
  await knex('serie').insert([
    { nome_serie: 'Educação Infantil - Maternal' },
    { nome_serie: 'Educação Infantil - Jardim I' },
    { nome_serie: 'Educação Infantil - Jardim II' },
    { nome_serie: '1º Ano' },
    { nome_serie: '2º Ano' },
    { nome_serie: '3º Ano' },
    { nome_serie: '4º Ano' },
    { nome_serie: '5º Ano' },
    { nome_serie: '6º Ano' },
    { nome_serie: '7º Ano' },
    { nome_serie: '8º Ano' },
    { nome_serie: '9º Ano' }
  ]);

  // Disciplinas básicas
  await knex('disciplina').insert([
    { nome_disciplina: 'Língua Portuguesa' },
    { nome_disciplina: 'Matemática' },
    { nome_disciplina: 'História' },
    { nome_disciplina: 'Geografia' },
    { nome_disciplina: 'Ciências' },
    { nome_disciplina: 'Educação Física' },
    { nome_disciplina: 'Arte' },
    { nome_disciplina: 'Inglês' },
    { nome_disciplina: 'Educação Religiosa' },
    { nome_disciplina: 'Informática' }
  ]);

  // Ano letivo atual (2025)
  const anoAtual = new Date().getFullYear();
  await knex('ano_letivo').insert({
    ano: anoAtual,
    data_inicio: `${anoAtual}-02-01`,
    data_fim: `${anoAtual}-12-15`,
    ativo: true
  });

  // Criar períodos letivos (bimestres) para o ano atual
  const anoLetivoAtual = await knex('ano_letivo').where('ano', anoAtual).first();
  for (let bimestre = 1; bimestre <= 4; bimestre++) {
    await knex('periodo_letivo').insert({
      bimestre: bimestre,
      ano_letivo_id: anoLetivoAtual.ano_letivo_id
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  // Remover tabelas na ordem inversa (devido às foreign keys)
  await knex.schema.dropTableIfExists('alocacao_professor');
  await knex.schema.dropTableIfExists('historico_escolar_disciplina');
  await knex.schema.dropTableIfExists('historico_escolar');
  await knex.schema.dropTableIfExists('boletim_disciplina');
  await knex.schema.dropTableIfExists('boletim');
  await knex.schema.dropTableIfExists('media_disciplina_bimestre');
  await knex.schema.dropTableIfExists('frequencia');
  await knex.schema.dropTableIfExists('nota');
  await knex.schema.dropTableIfExists('atividade');
  await knex.schema.dropTableIfExists('conteudo_aula');
  await knex.schema.dropTableIfExists('aula');
  await knex.schema.dropTableIfExists('turma_disciplina_professor');
  await knex.schema.dropTableIfExists('disciplina');
  await knex.schema.dropTableIfExists('matricula_aluno');
  await knex.schema.dropTableIfExists('turma');
  await knex.schema.dropTableIfExists('serie');
  await knex.schema.dropTableIfExists('periodo_letivo');
  await knex.schema.dropTableIfExists('ano_letivo');
  await knex.schema.dropTableIfExists('diagnostico');
  await knex.schema.dropTableIfExists('dados_saude');
  await knex.schema.dropTableIfExists('responsavel');
  await knex.schema.dropTableIfExists('parentesco');
  await knex.schema.dropTableIfExists('aluno');
  await knex.schema.dropTableIfExists('certidao_nascimento');
  await knex.schema.dropTableIfExists('religiao');
  await knex.schema.dropTableIfExists('professor');
  await knex.schema.dropTableIfExists('usuario');
  await knex.schema.dropTableIfExists('usuario_tipo');
};
