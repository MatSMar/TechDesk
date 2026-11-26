# Documentação da Etapa 07 — Persistência e CRUD com Banco de Dados

---

## 1. Visão Geral e Escolha do Banco de Dados

Nesta etapa, a persistência do sistema **TechDesk** foi migrada de dados temporários em arquivo JSON para um banco de dados relacional **MySQL** (`techdesk_db`), garantindo armazenamento real entre reinicializações da aplicação, integridade entre entidades relacionadas, validações, tratamento de erros de persistência e regras de negócio por perfil (`tecnico` e `usuario`)[cite: 1].

### Justificativa da Escolha (MySQL)
A escolha do **MySQL** como banco de dados relacional se justifica por:
- **Modelagem estruturada do domínio:** As entidades do sistema (`usuarios`, `chamados` e `interacoes_chamado`) possuem campos tipados, conjuntos fechados de valores (`ENUM`) e vínculos bem definidos de chave estrangeira (`1:N`).
- **Integridade referencial:** Restrições de chave estrangeira (`FOREIGN KEY`) evitam registros órfãos ou referências a usuários inexistentes e permitem exclusão em cascata (`ON DELETE CASCADE`) das interações ao remover um chamado.
- **Consultas relacionais e filtros:** Permite consultas com `JOIN` para exibir dados do solicitante, do técnico e do autor de cada mensagem, além de aplicar filtros no banco conforme o perfil do usuário.

---

## 2. Arquitetura e Desacoplamento

Para evitar acoplamento desnecessário entre a API e o banco de dados, a aplicação foi estruturada em camadas:

- **`api/src/config/db.js`:** Cria o *pool* de conexões com o MySQL utilizando `mysql2/promise` e variáveis de ambiente carregadas via `dotenv` a partir de `api/.env`.
- **`api/src/repositories/`:** Isola todas as consultas SQL (`usuarios.repository.js`, `chamados.repository.js` e `interacoes.repository.js`).
- **`api/src/controllers/`:** Realiza validações de entrada, aplica as regras de negócio, traduz erros do banco de dados e formata as respostas HTTP.
- **`api/src/routes/`:** Expõe as rotas da API (`auth.routes.js` e `chamados.routes.js`).

---

## 3. Modelo do Banco de Dados

### 3.1. Diagrama Entidade-Relacionamento

```text
+----------------------+       1:N       +--------------------------+
|       usuarios       |---------------->|         chamados         |
+----------------------+ (solicitante)   +--------------------------+
| PK id                |                 | PK id                    |
|    nome              |       0..1:N    |    titulo                |
|    email (UNIQUE)    |---------------->|    descricao             |
|    senha             |   (tecnico)     |    categoria (ENUM)      |
|    perfil (ENUM)     |                 |    prioridade (ENUM)     |
|    criado_em         |                 |    status (ENUM)         |
+----------------------+                 | FK solicitante_id        |
           |                             | FK tecnico_id (NULL)     |
           |                             |    criado_em             |
           | 1:N                         |    atualizado_em         |
           | (autor)                     +--------------------------+
           |                                          |
           v                                          | 1:N
+--------------------------+                          |
|    interacoes_chamado    |<-------------------------+
+--------------------------+
| PK id                    |
| FK chamado_id (CASCADE)  |
| FK autor_id              |
|    mensagem              |
|    criado_em             |
+--------------------------+
```

### 3.2. Descrição das Entidades

- **`usuarios`:** Armazena os usuários do sistema com identificador (`id`), nome (`nome`), e-mail único (`email`), senha (`senha`), perfil (`perfil`: `tecnico` ou `usuario`) e data de criação (`criado_em`).
- **`chamados`:** Armazena os chamados de suporte com identificador (`id`), título (`titulo`), descrição (`descricao`), categoria (`categoria`), prioridade (`prioridade`), status (`status`), referência ao solicitante (`solicitante_id`), referência opcional ao técnico (`tecnico_id`) e datas de criação/atualização (`criado_em`, `atualizado_em`).
- **`interacoes_chamado`:** Armazena o histórico de mensagens/pareceres de cada chamado, contendo identificador (`id`), chamado associado (`chamado_id`), autor da mensagem (`autor_id`), texto (`mensagem`) e data/hora (`criado_em`).

### 3.3. Descrição dos Relacionamentos

- **`usuarios` $\rightarrow$ `chamados` (Solicitante — `1:N`):** Um usuário pode abrir vários chamados (`solicitante_id` referencia `usuarios.id` com `ON DELETE RESTRICT`).
- **`usuarios` $\rightarrow$ `chamados` (Técnico — `0..1:N`):** Um técnico pode atender vários chamados (`tecnico_id` referencia `usuarios.id`, podendo ser `NULL`, com `ON DELETE SET NULL`).
- **`chamados` $\rightarrow$ `interacoes_chamado` (`1:N`):** Um chamado pode possuir várias interações (`chamado_id` referencia `chamados.id` com `ON DELETE CASCADE`).
- **`usuarios` $\rightarrow$ `interacoes_chamado` (Autor — `1:N`):** Um usuário pode enviar várias mensagens nos chamados (`autor_id` referencia `usuarios.id` com `ON DELETE RESTRICT`).

---

## 4. Instruções para Criação do Banco e Execução

1. Certifique-se de que o serviço do **MySQL** esteja em execução.
2. Execute o script SQL localizado em `api/database/schema.sql` no MySQL Workbench ou via linha de comando para criar o banco `techdesk_db`, as tabelas, os relacionamentos e os dados iniciais.
3. Configure o arquivo `api/.env` (a partir de `api/.env.example`) com as credenciais do banco (`PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).
4. Inicie a API:
   ```bash
   cd api
   npm install
   npm start
   ```
5. Abra o front-end em `src/html/index.html` utilizando um servidor local (como o Live Server).

---

## 5. Regras de Negócio e Funcionalidades

- **Perfil `usuario` (Funcionário):** Visualiza apenas os próprios chamados na dashboard, pode abrir novos chamados, não tem permissão para alterar o status do chamado e pode participar do bate-papo/histórico do seu chamado.
- **Perfil `tecnico` (Técnico):** Visualiza todos os chamados na dashboard, pode abrir chamados, pode alterar o status dos chamados (persistindo no banco) e pode registrar mensagens/pareceres no histórico do chamado.
- **Tela de Login:** Conta com autenticação no banco (`POST /auth/login`), opção *"Lembrar de mim"* para salvar o e-mail no `localStorage` e aviso orientativo em *"Esqueceu a senha?"*.

---

## 6. Exemplos de Operações CRUD

**URL Base:** `http://localhost:3001`

### Create (`POST /chamados`)
```json
{
  "titulo": "Falha no acesso à VPN",
  "categoria": "Rede",
  "prioridade": "Alta",
  "descricao": "Não consigo conectar na rede interna fora do escritório.",
  "solicitanteId": 2
}
```
Resposta esperada: `201 Created` com o chamado criado e persistido no MySQL.

### Read (`GET /chamados` e `GET /chamados/:id`)
- `GET /chamados?usuarioId=2&perfil=usuario` -> Retorna `200 OK` com os chamados do usuário `2`.
- `GET /chamados/101` -> Retorna `200 OK` com os detalhes do chamado `#101` e suas `interacoes`.

### Criar Interação (`POST /chamados/:id/interacoes`)
```json
{
  "autorId": 1,
  "mensagem": "Verifiquei seu acesso e redefini a sessão da VPN. Pode testar novamente?"
}
```
Resposta esperada: `201 Created` com a mensagem salva na tabela `interacoes_chamado`.

### Update (`PATCH /chamados/:id`)
```json
{
  "status": "Em Atendimento",
  "tecnicoId": 1
}
```
Resposta esperada: `200 OK` com o chamado atualizado no MySQL.

### Delete (`DELETE /chamados/:id`)
- `DELETE /chamados/103` -> Remove o chamado `#103` do banco e retorna `200 OK`.