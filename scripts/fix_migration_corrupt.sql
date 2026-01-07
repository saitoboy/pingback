-- Script SQL para corrigir migrações corrompidas no banco de dados
-- 
-- Este script remove registros de migrações que não existem mais no diretório de migrações
-- da tabela knex_migrations.
-- 
-- Execute este script se você receber o erro:
-- "The migration directory is corrupt, the following files are missing: [nome_da_migração]"
-- 
-- IMPORTANTE: Substitua '20250125000001_fix_frequencia_structure' pelo nome da migração
-- que está causando o problema.

-- 1. Verificar migrações registradas no banco
SELECT name, batch, migration_time 
FROM knex_migrations 
ORDER BY name;

-- 2. Remover a migração corrompida específica
-- (Substitua pelo nome da migração que está causando o problema)
DELETE FROM knex_migrations 
WHERE name = '20250125000001_fix_frequencia_structure';

-- 3. Verificar se foi removida
SELECT name, batch, migration_time 
FROM knex_migrations 
ORDER BY name;

-- 4. Se você quiser remover TODAS as migrações e começar do zero (CUIDADO!)
-- Isso só deve ser feito em desenvolvimento ou se você tiver certeza absoluta
-- DELETE FROM knex_migrations;

