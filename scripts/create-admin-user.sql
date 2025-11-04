-- ============================================================================
-- Script SQL para criar usuário administrador
-- ============================================================================
-- 
-- IMPORTANTE: Este script usa um hash bcrypt pré-gerado da senha "admin123"
-- 
-- RECOMENDAÇÃO: Use o script Node.js ao invés deste SQL para criar o usuário:
--   npm run create:admin
--   ou
--   node scripts/create-admin-user.js
-- 
-- O script Node.js gera o hash bcrypt automaticamente e é mais seguro.
-- 
-- ============================================================================
-- 
-- NOTA: O hash bcrypt abaixo é para a senha "admin123"
-- Hash gerado com: bcrypt.hash("admin123", 10)
-- Para gerar um novo hash com senha diferente, use o script Node.js
-- 
-- ============================================================================

DO $$
DECLARE
    v_tipo_admin_id UUID;
    v_senha_hash TEXT := '$2b$10$U2pbPx2.slo28KrOlvSdPugwQYKo3SDEarl6NVuZJGI6AhwlyQg6e'; -- Hash de "admin123"
    v_email_admin TEXT := 'admin@escola.com';
    v_nome_admin TEXT := 'Administrador';
    v_usuario_existe BOOLEAN;
BEGIN
    -- 1. Buscar o ID do tipo de usuário 'admin'
    SELECT tipo_usuario_id INTO v_tipo_admin_id
    FROM usuario_tipo
    WHERE nome_tipo = 'admin'
    LIMIT 1;

    -- Verificar se o tipo admin existe
    IF v_tipo_admin_id IS NULL THEN
        RAISE EXCEPTION 'Tipo de usuário "admin" não encontrado! Execute as migrações primeiro.';
    END IF;

    -- 2. Verificar se o usuário já existe
    SELECT EXISTS(
        SELECT 1 FROM usuario WHERE email_usuario = v_email_admin
    ) INTO v_usuario_existe;

    IF v_usuario_existe THEN
        RAISE NOTICE 'Usuário com email % já existe!', v_email_admin;
        RETURN;
    END IF;

    -- 3. Inserir o usuário administrador
    INSERT INTO usuario (
        nome_usuario,
        email_usuario,
        senha_usuario,
        tipo_usuario_id,
        created_at,
        updated_at
    ) VALUES (
        v_nome_admin,
        v_email_admin,
        v_senha_hash,
        v_tipo_admin_id,
        NOW(),
        NOW()
    );

    RAISE NOTICE '✅ Usuário administrador criado com sucesso!';
    RAISE NOTICE '📧 Email: %', v_email_admin;
    RAISE NOTICE '🔑 Senha: admin123';
    RAISE NOTICE '⚠️  IMPORTANTE: Altere a senha após o primeiro login!';

END $$;

-- Para verificar o usuário criado:
-- SELECT usuario_id, nome_usuario, email_usuario, tipo_usuario_id, created_at
-- FROM usuario
-- WHERE email_usuario = 'admin@escola.com';

