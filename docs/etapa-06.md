# Documentação da Etapa 06 — Integração Front-End e API REST

---

## 1. Visão Geral e Arquitetura

Nesta etapa, o sistema **TechDesk** teve sua camada de interface (HTML5, CSS3 e JavaScript modular) conectada a uma **API REST** desenvolvida em Node.js e Express (executando na porta `3001`), substituindo os dados estáticos por requisições HTTP reais (`fetch`) e persistência em arquivo JSON (`chamados.json`).

### Principais Integrações Realizadas
- **Serviço Centralizado de API (`src/js/services/api.js`):** Encapsula todas as chamadas HTTP (`GET`, `POST`, `PATCH`) e o tratamento padronizado de respostas e erros de rede.
- **Autenticação (`src/js/login.js` + `POST /auth/login`):** Valida as credenciais informadas no formulário de login contra a API e armazena a sessão do usuário no `localStorage`.
- **Dashboard Dinâmica (`src/js/dashboard.js` + `GET /chamados`):** Carrega os chamados do servidor, atualiza automaticamente os 4 cards de indicadores (`Total`, `Abertos`, `Em Atendimento` e `Resolvidos`), aplica filtros por texto/status e ajusta os badges visuais conforme o status.
- **Abertura de Chamados (`src/js/form-novo.js` + `POST /chamados`):** Envia novos registros de chamados para persistência no back-end.
- **Detalhes e Atualização de Status (`src/js/detalhes.js` + `GET /chamados/:id` e `PATCH /chamados/:id`):** Carrega os dados completos de um chamado específico via parâmetro de URL (`?id=`) e permite atualizar seu status no servidor.

---

## 2. Instruções para Execução

### Pré-requisitos
- **Node.js** (versão 18 ou superior) e **npm** instalados.
- Navegador web moderno (Chrome, Edge, Firefox) e extensão **Live Server** (ou servidor HTTP estático equivalente para servir os módulos ES do front-end).

### Passo 1: Iniciar a API (Back-end)
1. Abra o terminal na pasta da API (`api/`):
   ```bash
   cd api
   ```
2. Instale as dependências do projeto:
   ```bash
   npm install
   ```
3. Inicie o servidor:
   ```bash
   npm start
   ```
   O servidor iniciará em `http://localhost:3001`.

### Passo 2: Iniciar o Front-end
1. Abra o arquivo `src/html/index.html` utilizando um servidor local (como o **Live Server** do VS Code, na porta `5500`), garantindo que os scripts com `type="module"` sejam carregados corretamente sem bloqueio de CORS.
2. Realize o login na tela inicial e navegue entre a **Dashboard**, **Abrir Chamado** e **Ver Detalhes**.

---

## 3. Documentação dos Endpoints

**URL Base:** `http://localhost:3001`  
**Formato de Dados:** `application/json`

| Método | Endpoint | Descrição | Códigos de Status |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Autentica um usuário com e-mail e senha. | `200`, `400`, `401` |
| `GET` | `/chamados` | Lista todos os chamados cadastrados (aceita filtros via query string). | `200`, `500` |
| `GET` | `/chamados/:id` | Retorna os detalhes de um chamado específico pelo ID. | `200`, `404` |
| `POST` | `/chamados` | Cria e persiste um novo chamado. | `201`, `400` |
| `PATCH` | `/chamados/:id` | Atualiza parcialmente os dados (como o status) de um chamado. | `200`, `400`, `404` |

---

## 4. Exemplos de Requisições e Respostas

### 4.1. Autenticar Usuário — `POST /auth/login`

- **Requisição:**
  ```http
  POST /auth/login HTTP/1.1
  Host: localhost:3001
  Content-Type: application/json

  {
    "email": "tecnico@techdesk.com",
    "senha": "123456"
  }
  ```

- **Resposta de Sucesso (`200 OK`):**
  ```json
  {
    "mensagem": "Login realizado com sucesso.",
    "usuario": {
      "id": 1,
      "nome": "Técnico TI",
      "email": "tecnico@techdesk.com",
      "perfil": "tecnico"
    }
  }
  ```

- **Resposta de Erro (`401 Unauthorized`):**
  ```json
  {
    "mensagem": "E-mail ou senha inválidos."
  }
  ```

---

### 4.2. Listar Chamados — `GET /chamados`

- **Requisição (listagem completa ou com filtros opcionais `?status=...&prioridade=...&categoria=...&busca=...`):**
  ```http
  GET /chamados HTTP/1.1
  Host: localhost:3001
  ```

- **Resposta de Sucesso (`200 OK`):**
  ```json
  [
    {
      "id": 101,
      "titulo": "Impressora do setor de vendas não liga",
      "categoria": "Hardware",
      "prioridade": "Alta",
      "status": "Aberto",
      "descricao": "Equipamento não apresenta sinal de energia na tomada."
    },
    {
      "id": 102,
      "titulo": "Sem acesso ao sistema ERP",
      "categoria": "Software",
      "prioridade": "Média",
      "status": "Em Atendimento",
      "descricao": "Erro de autenticação ao tentar abrir o módulo financeiro."
    }
  ]
  ```

---

### 4.3. Buscar Chamado por ID — `GET /chamados/:id`

- **Requisição:**
  ```http
  GET /chamados/101 HTTP/1.1
  Host: localhost:3001
  ```

- **Resposta de Sucesso (`200 OK`):**
  ```json
  {
    "id": 101,
    "titulo": "Impressora do setor de vendas não liga",
    "categoria": "Hardware",
    "prioridade": "Alta",
    "status": "Aberto",
    "descricao": "Equipamento não apresenta sinal de energia na tomada."
  }
  ```

- **Resposta de Erro (`404 Not Found`):**
  ```json
  {
    "mensagem": "Chamado não encontrado."
  }
  ```

---

### 4.4. Criar Novo Chamado — `POST /chamados`

- **Requisição:**
  ```http
  POST /chamados HTTP/1.1
  Host: localhost:3001
  Content-Type: application/json

  {
    "titulo": "Computador não conecta na rede Wi-Fi",
    "categoria": "Rede",
    "prioridade": "Alta",
    "descricao": "Estação de trabalho do financeiro perdeu conexão com a rede interna."
  }
  ```

- **Resposta de Sucesso (`201 Created`):**
  ```json
  {
    "id": 103,
    "titulo": "Computador não conecta na rede Wi-Fi",
    "categoria": "Rede",
    "prioridade": "Alta",
    "status": "Aberto",
    "descricao": "Estação de trabalho do financeiro perdeu conexão com a rede interna."
  }
  ```

- **Resposta de Erro (`400 Bad Request`):**
  ```json
  {
    "mensagem": "Dados inválidos para criação do chamado.",
    "detalhes": [
      "O campo título é obrigatório."
    ]
  }
  ```

---

### 4.5. Atualizar Chamado — `PATCH /chamados/:id`

- **Requisição:**
  ```http
  PATCH /chamados/101 HTTP/1.1
  Host: localhost:3001
  Content-Type: application/json

  {
    "status": "Em Atendimento"
  }
  ```

- **Resposta de Sucesso (`200 OK`):**
  ```json
  {
    "id": 101,
    "titulo": "Impressora do setor de vendas não liga",
    "categoria": "Hardware",
    "prioridade": "Alta",
    "status": "Em Atendimento",
    "descricao": "Equipamento não apresenta sinal de energia na tomada."
  }
  ```

- **Resposta de Erro (`404 Not Found`):**
  ```json
  {
    "mensagem": "Chamado não encontrado."
  }
  ```

---

## 5. Coleção de Testes (Postman / Insomnia)

A coleção de requisições pronta para importação encontra-se no arquivo [coleção.json](./evidencias/etapa-06/coleção.json), compatível com **Postman**, **Insomnia** e **Thunder Client**, configurada com a variável `{{baseUrl}}` apontando para `http://localhost:3001`.