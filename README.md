# TechDesk

## Nome do Projeto

**TechDesk — Sistema Web de Gerenciamento de Chamados de TI**

## Descrição da Aplicação

O TechDesk é uma aplicação Web criada para centralizar, organizar e gerenciar solicitações de suporte e atendimento técnico de TI em pequenas e médias empresas.

## Problema que a Aplicação Resolve

Evita a perda de histórico, falhas de comunicação e desorganização decorrentes de chamados feitos por mensagens informais ou e-mails, disponibilizando um fluxo estruturado com controle de status, prioridades e canal direto entre funcionários e técnicos de TI.

## Tecnologias Utilizadas

- **Frontend:** HTML5 Semântico, CSS3 (Design Responsivo, CSS Grid, Flexbox), JavaScript ES6+ (Módulos, Fetch API, Async/Await).
- **Backend / API REST:** Node.js, Express, CORS e persistência em arquivo JSON (`chamados.json`).
- **Testes de API:** Postman / Insomnia (`coleção.json`).
- **Controle de Versão:** Git / GitHub.

## Instruções para Execução

O projeto conta com uma API REST própria integrada ao front-end. Para visualizar e testar a aplicação por completo:

1. Clone ou baixe o repositório em sua máquina.

2. Certifique-se de ter o Node.js instalado, acesse a pasta da API, instale as dependências e inicie o servidor:

   ```bash
   cd api
   npm install
   npm start
   ```

   A API iniciará por padrão em `http://localhost:3001`.

3. Com o servidor rodando, abra o arquivo `src/html/index.html` utilizando um servidor local (como a extensão Live Server do VS Code) no seu navegador web.

4. As instruções detalhadas, documentação dos endpoints, coleção de testes e evidências de cada etapa encontram-se na pasta `docs/`.

## Funcionalidades Implementadas

- **Etapa 01:** Especificação inicial, escopo e proposta do projeto (`docs/proposta.md`).

- **Etapa 02:** Protótipo estrutural com HTML5 semântico contendo 4 interfaces principais (`index.html`, `dashboard.html`, `novo_chamado.html`, `detalhes_chamado.html`) e documentação em `docs/etapa-02.md`.

- **Etapa 03:** Estilização visual completa com CSS3, design responsivo (Mobile First / Breakpoints), paleta de cores personalizada e acessibilidade (`docs/etapa-03.md`).

- **Etapa 04:** Interatividade e comportamentos dinâmicos com JavaScript (ES6+), validação de formulários em tempo real, filtros e linha do tempo interativa (`docs/etapa-04.md`).

- **Etapa 05:** Modularização do código JavaScript, integração assíncrona com Fetch API (`async/await`), gestão de estados (carregamento, sucesso e erro) e protótipo inicial de comunicação com servidor (`docs/etapa-05.md`).

- **Etapa 06:** Desenvolvimento da API REST em Node.js/Express (`POST /auth/login`, `GET /chamados`, `GET /chamados/:id`, `POST /chamados` e `PATCH /chamados/:id`), integração completa entre front-end e back-end, atualização dinâmica dos indicadores da dashboard e documentação de endpoints com coleção Postman/Insomnia (`docs/etapa-06.md`).

## Limitações Conhecidas

- Esta entrega refere-se à **Etapa 06 (Desenvolvimento de API REST e Integração)**.
- A persistência dos dados na API utiliza armazenamento local em arquivo JSON (`chamados.json`), preparando o sistema para a migração para banco de dados relacional/persistente e regras de controle de acesso por perfil na próxima etapa.