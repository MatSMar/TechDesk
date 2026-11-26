# TechDesk

## Nome do Projeto

**TechDesk — Sistema Web de Gerenciamento de Chamados de TI**

## Descrição da Aplicação

O TechDesk é uma aplicação Web criada para centralizar, organizar e gerenciar solicitações de suporte e atendimento técnico de TI em pequenas e médias empresas.

## Problema que a Aplicação Resolve

Evita a perda de histórico, falhas de comunicação e desorganização decorrentes de chamados feitos por mensagens informais ou e-mails, disponibilizando um fluxo estruturado com controle de status, prioridades e canal direto entre funcionários e técnicos de TI.

## Tecnologias Utilizadas

- **Frontend:** HTML5 Semântico, CSS3 (Design Responsivo, CSS Grid, Flexbox), JavaScript ES6+ (Módulos, Fetch API, Async/Await).
- **Backend / API REST:** Node.js, Express, CORS, `dotenv`, arquitetura em camadas (`config`, `repositories`, `controllers`, `routes`).
- **Banco de Dados:** MySQL (`mysql2/promise`) com modelagem relacional (`usuarios`, `chamados`, `interacoes_chamado`).
- **Testes de API:** Postman / Insomnia (`coleção.json`) / PowerShell (`Invoke-RestMethod`).
- **Controle de Versão:** Git / GitHub.

## Instruções para Execução

O projeto conta com uma API REST própria conectada ao **MySQL** e integrada ao front-end. Para configurar, executar e testar a aplicação:

1. Clone ou baixe o repositório em sua máquina.

2. **Configure o Banco de Dados MySQL:**
   - Certifique-se de ter o MySQL Server em execução.
   - Abra e execute o script SQL localizado em `api/database/schema.sql` (no MySQL Workbench ou terminal `mysql`) para criar o banco `techdesk_db`, as tabelas e os usuários iniciais de teste (`carlos@techdesk.local` e `ana@techdesk.local`, ambos com senha `123`).

3. **Configure as Variáveis de Ambiente da API:**
   - Na pasta `api/`, crie um arquivo `.env` (baseado em `api/.env.example`) informando suas credenciais locais:
     ```env
     PORT=3001
     DB_HOST=localhost
     DB_PORT=3306
     DB_USER=root
     DB_PASSWORD=sua_senha_do_mysql
     DB_NAME=techdesk_db
     ```

4. **Inicie a API:**
   - Acesse a pasta `api/`, instale as dependências e inicie o servidor:
     ```bash
     cd api
     npm install
     npm start
     ```
   - A API iniciará por padrão em `http://localhost:3001`.

5. **Execute o Front-End:**
   - Com o servidor rodando, abra o arquivo `src/html/index.html` utilizando um servidor local (como a extensão Live Server do VS Code) no seu navegador web.

6. As instruções detalhadas, modelagem do banco, exemplos de CRUD, coleção de testes e documentação de cada etapa encontram-se na pasta `docs/`.

## Funcionalidades Implementadas

- **Etapa 01:** Especificação inicial, escopo e proposta do projeto (`docs/proposta.md`).

- **Etapa 02:** Protótipo estrutural com HTML5 semântico contendo 4 interfaces principais (`index.html`, `dashboard.html`, `novo_chamado.html`, `detalhes_chamado.html`) e documentação em `docs/etapa-02.md`.

- **Etapa 03:** Estilização visual completa com CSS3, design responsivo (Mobile First / Breakpoints), paleta de cores personalizada e acessibilidade (`docs/etapa-03.md`).

- **Etapa 04:** Interatividade e comportamentos dinâmicos com JavaScript (ES6+), validação de formulários em tempo real, filtros e linha do tempo interativa (`docs/etapa-04.md`).

- **Etapa 05:** Modularização do código JavaScript, integração assíncrona com Fetch API (`async/await`), gestão de estados (carregamento, sucesso e erro) e protótipo inicial de comunicação com servidor (`docs/etapa-05.md`).

- **Etapa 06:** Desenvolvimento da API REST em Node.js/Express (`POST /auth/login`, `GET /chamados`, `GET /chamados/:id`, `POST /chamados` e `PATCH /chamados/:id`), integração entre front-end e back-end, atualização dinâmica dos indicadores da dashboard e documentação de endpoints (`docs/etapa-06.md`).

- **Etapa 07:** Persistência real em banco de dados relacional **MySQL** (`techdesk_db`), desacoplamento via camada de *repositories*, operações CRUD completas (`POST`, `GET`, `PUT`, `PATCH`, `DELETE`), visão da dashboard e controle de status por perfil (`tecnico` e `usuario`), bate-papo/histórico de interações persistido e modelagem documentada (`docs/etapa-07.md`).

## Limitações Conhecidas

- Esta entrega refere-se à **Etapa 07 (Persistência e CRUD com Banco de Dados)**.
- As senhas dos usuários de demonstração ainda são armazenadas em texto simples para fins didáticos, e a recuperação automática de senha ainda não está implementada.