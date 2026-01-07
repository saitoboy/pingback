/**
 * Script para marcar migrações como executadas sem executá-las
 * 
 * Este script verifica o estado atual do banco de dados e marca as migrações
 * correspondentes como já executadas na tabela knex_migrations.
 * 
 * Use este script quando:
 * - As tabelas já existem no banco mas as migrações não estão registradas
 * - Você removeu os registros de knex_migrations mas o banco já está atualizado
 * 
 * Uso:
 *   node scripts/mark_migrations_as_executed.js
 * 
 * Para produção:
 *   NODE_ENV=production node scripts/mark_migrations_as_executed.js
 */

require('dotenv').config();
const knexfile = require('../knexfile');
const fs = require('fs');
const path = require('path');

const environment = process.env.NODE_ENV || 'development';
const knex = require('knex')(knexfile[environment]);

// Mapeamento de tabelas principais para identificar quais migrações foram executadas
const MIGRATION_TABLES = {
  '20250101000000_create_complete_database_schema.js': [
    'usuario_tipo',
    'usuario',
    'professor',
    'aluno',
    'turma',
    'disciplina',
    'ano_letivo'
  ],
  '20250115000000_add_grade_horario_and_modify_diario_structure.js': [
    'grade_horario_professor'
  ],
  '20250122000000_fix_turma_turno_enum.js': [
    // Esta migração modifica a tabela turma, então verificamos se turma existe
    // e se tem a constraint de turno
    'turma'
  ],
  '20250125000000_modify_frequencia_to_professor_turma_data.js': [
    // Esta migração modifica frequencia, verificamos se tem professor_id
    'frequencia'
  ],
  '20250126000000_fix_frequencia_professor_id_foreign_key.js': [
    // Esta migração adiciona foreign key, verificamos se frequencia tem a constraint
    'frequencia'
  ]
};

async function checkTableExists(tableName) {
  try {
    return await knex.schema.hasTable(tableName);
  } catch (error) {
    return false;
  }
}

async function checkColumnExists(tableName, columnName) {
  try {
    return await knex.schema.hasColumn(tableName, columnName);
  } catch (error) {
    return false;
  }
}

async function checkConstraintExists(tableName, constraintName) {
  try {
    const result = await knex.raw(`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = ? AND constraint_name = ?
    `, [tableName, constraintName]);
    return result.rows.length > 0;
  } catch (error) {
    return false;
  }
}

async function determineExecutedMigrations() {
  const migrationsDir = path.join(__dirname, '..', 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.js'))
    .sort();

  const executedMigrations = [];

  for (const migrationFile of migrationFiles) {
    const migrationName = migrationFile;
    const tables = MIGRATION_TABLES[migrationName] || [];

    let shouldMarkAsExecuted = false;

    if (migrationName === '20250101000000_create_complete_database_schema.js') {
      // Verificar se as tabelas principais existem
      const hasUsuarioTipo = await checkTableExists('usuario_tipo');
      const hasUsuario = await checkTableExists('usuario');
      const hasTurma = await checkTableExists('turma');
      
      if (hasUsuarioTipo && hasUsuario && hasTurma) {
        shouldMarkAsExecuted = true;
        console.log(`  ✅ ${migrationName} - Tabelas principais existem`);
      } else {
        console.log(`  ❌ ${migrationName} - Tabelas principais não existem`);
      }
    } else if (migrationName === '20250115000000_add_grade_horario_and_modify_diario_structure.js') {
      const hasGradeHorario = await checkTableExists('grade_horario_professor');
      if (hasGradeHorario) {
        shouldMarkAsExecuted = true;
        console.log(`  ✅ ${migrationName} - Tabela grade_horario_professor existe`);
      } else {
        console.log(`  ❌ ${migrationName} - Tabela grade_horario_professor não existe`);
      }
    } else if (migrationName === '20250122000000_fix_turma_turno_enum.js') {
      // Verificar se turma existe e se tem a constraint de turno (string, não enum)
      const hasTurma = await checkTableExists('turma');
      if (hasTurma) {
        // Verificar se tem constraint de turno (indica que foi modificado)
        const hasConstraint = await checkConstraintExists('turma', 'turma_turno_check');
        if (hasConstraint) {
          shouldMarkAsExecuted = true;
          console.log(`  ✅ ${migrationName} - Constraint de turno existe`);
        } else {
          console.log(`  ⚠️  ${migrationName} - Tabela turma existe mas sem constraint (pode não ter sido executada)`);
        }
      } else {
        console.log(`  ❌ ${migrationName} - Tabela turma não existe`);
      }
    } else if (migrationName === '20250125000000_modify_frequencia_to_professor_turma_data.js') {
      // Verificar se frequencia tem professor_id e turma_id
      const hasFrequencia = await checkTableExists('frequencia');
      if (hasFrequencia) {
        const hasProfessorId = await checkColumnExists('frequencia', 'professor_id');
        const hasTurmaId = await checkColumnExists('frequencia', 'turma_id');
        const hasNotTurmaDisciplinaProfessorId = !await checkColumnExists('frequencia', 'turma_disciplina_professor_id');
        
        if (hasProfessorId && hasTurmaId && hasNotTurmaDisciplinaProfessorId) {
          shouldMarkAsExecuted = true;
          console.log(`  ✅ ${migrationName} - Frequencia tem professor_id e turma_id`);
        } else {
          console.log(`  ❌ ${migrationName} - Frequencia não tem a estrutura esperada`);
        }
      } else {
        console.log(`  ❌ ${migrationName} - Tabela frequencia não existe`);
      }
    } else if (migrationName === '20250126000000_fix_frequencia_professor_id_foreign_key.js') {
      // Verificar se frequencia tem a foreign key correta
      const hasFrequencia = await checkTableExists('frequencia');
      if (hasFrequencia) {
        const hasConstraint = await checkConstraintExists('frequencia', 'frequencia_professor_id_foreign');
        if (hasConstraint) {
          shouldMarkAsExecuted = true;
          console.log(`  ✅ ${migrationName} - Foreign key existe`);
        } else {
          console.log(`  ⚠️  ${migrationName} - Foreign key não existe (pode não ter sido executada)`);
        }
      } else {
        console.log(`  ❌ ${migrationName} - Tabela frequencia não existe`);
      }
    } else {
      // Para outras migrações, verificar se as tabelas existem
      if (tables.length > 0) {
        const allTablesExist = await Promise.all(
          tables.map(table => checkTableExists(table))
        );
        shouldMarkAsExecuted = allTablesExist.every(exists => exists);
        
        if (shouldMarkAsExecuted) {
          console.log(`  ✅ ${migrationName} - Tabelas relacionadas existem`);
        } else {
          console.log(`  ❌ ${migrationName} - Algumas tabelas relacionadas não existem`);
        }
      } else {
        console.log(`  ⚠️  ${migrationName} - Sem verificação definida, assumindo não executada`);
      }
    }

    if (shouldMarkAsExecuted) {
      executedMigrations.push(migrationName);
    }
  }

  return executedMigrations;
}

async function markMigrationsAsExecuted() {
  try {
    console.log('🔄 Verificando estado do banco de dados...');
    console.log(`📁 Ambiente: ${environment}\n`);

    // Verificar quais migrações já foram executadas
    console.log('📋 Verificando migrações:\n');
    const executedMigrations = await determineExecutedMigrations();

    if (executedMigrations.length === 0) {
      console.log('\n⚠️  Nenhuma migração parece ter sido executada.');
      console.log('   Execute as migrações normalmente: npm run migrate');
      process.exit(0);
    }

    console.log(`\n✅ Migrações que serão marcadas como executadas (${executedMigrations.length}):`);
    executedMigrations.forEach(m => console.log(`  - ${m}`));

    // Verificar quais já estão registradas
    const registeredMigrations = await knex('knex_migrations')
      .select('name')
      .whereIn('name', executedMigrations);

    const registeredNames = registeredMigrations.map(m => m.name);
    const toInsert = executedMigrations.filter(name => !registeredNames.includes(name));

    if (toInsert.length === 0) {
      console.log('\n✅ Todas as migrações já estão registradas!');
      process.exit(0);
    }

    console.log(`\n📝 Migrações a serem inseridas (${toInsert.length}):`);
    toInsert.forEach(m => console.log(`  - ${m}`));

    // Inserir as migrações
    console.log('\n🔄 Inserindo registros na tabela knex_migrations...');
    
    // Obter o próximo batch number
    const maxBatch = await knex('knex_migrations')
      .max('batch as max_batch')
      .first();
    
    const nextBatch = (maxBatch?.max_batch || 0) + 1;

    for (const migrationName of toInsert) {
      await knex('knex_migrations').insert({
        name: migrationName,
        batch: nextBatch,
        migration_time: new Date()
      });
      console.log(`  ✅ ${migrationName} inserida`);
    }

    // Verificar estado final
    const allMigrations = await knex('knex_migrations')
      .select('name', 'batch')
      .orderBy('name');

    console.log(`\n📋 Migrações registradas no banco (${allMigrations.length}):`);
    allMigrations.forEach(m => console.log(`  - ${m.name} (batch ${m.batch})`));

    console.log('\n✅ Processo concluído com sucesso!');
    console.log('   Agora você pode executar as migrações pendentes: npm run migrate');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro ao marcar migrações:', error);
    console.error('\nDetalhes do erro:');
    console.error(error.stack);
    process.exit(1);
  } finally {
    await knex.destroy();
  }
}

// Executar o script
markMigrationsAsExecuted();

