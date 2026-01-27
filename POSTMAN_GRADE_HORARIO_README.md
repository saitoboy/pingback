# Collection Postman - Grade de Horários e Diário por Data

Esta collection contém todos os endpoints para testar a funcionalidade de **Grade de Horários** e o novo sistema de registro de diário por **data** (ao invés de aula_id).

## 📋 Pré-requisitos

1. **Postman** instalado
2. **Backend** rodando (padrão: `http://localhost:3003`)
3. **Token de autenticação** (obtido através do endpoint de login)

## 🚀 Como Usar

### 1. Importar a Collection

1. Abra o Postman
2. Clique em **Import**
3. Selecione o arquivo `POSTMAN_GRADE_HORARIO_COLLECTION.json`
4. A collection será importada com todas as requisições organizadas

### 2. Configurar Variáveis de Ambiente

A collection já vem com variáveis pré-configuradas:
- `baseUrl`: `http://localhost:3003` (ajuste se necessário)
- `authToken`: Será preenchido automaticamente após o login

### 3. Fazer Login

1. Vá para a pasta **"Autenticação"**
2. Execute a requisição **"Login"**
3. O token será salvo automaticamente na variável `authToken`
4. Todas as outras requisições usarão este token automaticamente

## 📁 Estrutura da Collection

### 1. **Grade de Horários**
Endpoints para gerenciar a grade de horários dos professores:

- **Listar Todas as Grades**: `GET /grade-horario`
- **Buscar Grade por ID**: `GET /grade-horario/:id`
- **Buscar Grades por Vinculação**: `GET /grade-horario/vinculacao/:vinculacaoId`
- **Buscar Grades por Professor**: `GET /grade-horario/professor/:professorId`
- **Criar Grade de Horário**: `POST /grade-horario`
- **Criar Grades em Lote**: `POST /grade-horario/lote`
- **Atualizar Grade de Horário**: `PUT /grade-horario/:id`
- **Deletar Grade de Horário**: `DELETE /grade-horario/:id`
- **Deletar Grades por Vinculação**: `DELETE /grade-horario/vinculacao/:vinculacaoId`

### 2. **Frequência por Data**
Endpoints para gerenciar frequência usando data e vinculação:

- **Buscar Frequências por Data e Vinculação**: `GET /frequencia/data/:vinculacaoId/:data`
- **Registrar Frequência em Lote por Data**: `POST /frequencia/lote-por-data`

### 3. **Atividades por Data**
Endpoints para gerenciar atividades usando data e vinculação:

- **Buscar Atividades por Data e Vinculação**: `GET /atividade/data/:vinculacaoId/:data`
- **Criar Atividade com Data**: `POST /atividade` (agora aceita `data_aula` ao invés de `aula_id`)

### 4. **Conteúdos por Data**
Endpoints para gerenciar conteúdos usando data e vinculação:

- **Buscar Conteúdos por Data e Vinculação**: `GET /conteudo-aula/data/:vinculacaoId/:data`
- **Criar Conteúdo com Data**: `POST /conteudo-aula` (agora aceita `data_aula` + `turma_disciplina_professor_id` ao invés de `aula_id`)

### 5. **Autenticação**
- **Login**: `POST /auth/login` (salva token automaticamente)

### 6. **Utilitários**
Endpoints auxiliares para obter dados necessários:
- **Listar Vinculações**: `GET /vinculacao`
- **Listar Professores**: `GET /professor`
- **Listar Matrículas**: `GET /matricula-aluno`
- **Listar Períodos Letivos**: `GET /periodo-letivo`

## 📝 Exemplos de Uso

### Criar Grade de Horário

```json
POST /grade-horario
{
  "turma_disciplina_professor_id": "uuid-da-vinculacao",
  "dia_semana": 1,
  "hora_inicio": "07:00",
  "hora_fim": "08:40"
}
```

**Dia da semana**: 
- 0 = Domingo
- 1 = Segunda-feira
- 2 = Terça-feira
- 3 = Quarta-feira
- 4 = Quinta-feira
- 5 = Sexta-feira
- 6 = Sábado

### Registrar Frequência por Data

```json
POST /frequencia/lote-por-data
{
  "turma_disciplina_professor_id": "uuid-da-vinculacao",
  "data_aula": "2025-01-15",
  "frequencias": [
    {
      "matricula_aluno_id": "uuid-matricula-1",
      "presenca": true
    },
    {
      "matricula_aluno_id": "uuid-matricula-2",
      "presenca": false
    }
  ]
}
```

### Criar Atividade com Data

```json
POST /atividade
{
  "titulo": "Exercícios de Matemática",
  "descricao": "Resolver exercícios das páginas 10 a 15",
  "peso": 2.0,
  "vale_nota": true,
  "periodo_letivo_id": "uuid-periodo-letivo",
  "turma_disciplina_professor_id": "uuid-da-vinculacao",
  "data_aula": "2025-01-15"
}
```

### Criar Conteúdo com Data

```json
POST /conteudo-aula
{
  "turma_disciplina_professor_id": "uuid-da-vinculacao",
  "data_aula": "2025-01-15",
  "descricao": "Introdução à Álgebra",
  "conteudo": "Hoje estudamos os conceitos básicos de álgebra..."
}
```

## 🔑 Permissões

- **ADMIN**: Acesso total a todos os endpoints
- **SECRETARIO**: Pode visualizar e criar, mas não deletar algumas entidades
- **PROFESSOR**: Pode gerenciar apenas suas próprias aulas/atividades/conteúdos

## ⚠️ Observações Importantes

1. **Formato de Data**: Use sempre o formato `YYYY-MM-DD` (ex: `2025-01-15`)
2. **Formato de Hora**: Use sempre o formato `HH:MM` (ex: `07:00`, `14:30`)
3. **IDs**: Todos os IDs são UUIDs (strings)
4. **Token**: O token expira após um período. Se receber erro 401, faça login novamente
5. **Vinculação**: A `turma_disciplina_professor_id` é obrigatória para os novos endpoints por data

## 🐛 Troubleshooting

### Erro 401 (Unauthorized)
- Faça login novamente
- Verifique se o token está sendo enviado no header `Authorization`

### Erro 404 (Not Found)
- Verifique se os IDs fornecidos existem no banco de dados
- Use os endpoints de "Utilitários" para listar IDs válidos

### Erro 400 (Bad Request)
- Verifique o formato dos dados enviados
- Confira se todos os campos obrigatórios estão presentes
- Valide o formato de data (YYYY-MM-DD) e hora (HH:MM)

## 📚 Documentação Adicional

Para mais informações sobre a API, consulte:
- `docs/API-Documentation.md` - Documentação completa da API
- `migrations/20250115000000_add_grade_horario_and_modify_diario_structure.js` - Estrutura do banco de dados

