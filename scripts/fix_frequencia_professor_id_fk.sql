-- Script para corrigir a foreign key de professor_id na tabela frequencia
-- O campo professor_id armazena usuario_id, então deve referenciar usuario.usuario_id

-- 1. Remover a foreign key antiga (se existir)
ALTER TABLE frequencia 
DROP CONSTRAINT IF EXISTS frequencia_professor_id_foreign;

-- 2. Adicionar a foreign key correta referenciando usuario.usuario_id
ALTER TABLE frequencia
ADD CONSTRAINT frequencia_professor_id_foreign
FOREIGN KEY (professor_id)
REFERENCES usuario(usuario_id)
ON DELETE CASCADE;

-- Verificar se foi criada corretamente
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE 
    tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'frequencia'
    AND kcu.column_name = 'professor_id';

