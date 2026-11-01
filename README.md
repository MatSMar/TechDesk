# TechDesk

## Nome do Projeto

**TechDesk — Sistema Web de Gerenciamento de Chamados de TI**

## Descrição da Aplicação

O TechDesk é uma aplicação Web criada para centralizar, organizar e gerenciar solicitações de suporte e atendimento técnico de TI em pequenas e médias empresas.

## Problema que a Aplicação Resolve

Evita a perda de histórico, falhas de comunicação e desorganização decorrentes de chamados feitos por mensagens informais ou e-mails, disponibilizando um fluxo estruturado com controle de status, prioridades e canal direto entre funcionários e técnicos de TI.

## Tecnologias Utilizadas

- **Frontend:** HTML5 Semântico, CSS3 (Design Responsivo, CSS Grid, Flexbox), JavaScript ES6+ (Módulos, Fetch API, Async/Await).
- **Backend Simulado:** Node.js, JSON Server (`db.json`).
- **Controle de Versão:** Git / GitHub.

## Instruções para Execução

O projeto agora conta com comunicação assíncrona integrada a um servidor simulado. Para visualizar e testar a aplicação por completo:

1. Clone ou baixe o repositório em sua máquina.

2. Certifique-se de ter o Node.js instalado e execute o servidor simulado na raiz do projeto:

   ```bash
   json-server --watch db.json --port 3000
   ```

3. Com o servidor rodando, abra o arquivo `src/html/index.html` (ou utilize um servidor local como o Live Server) no seu navegador web.

4. As instruções detalhadas e evidências de cada etapa encontram-se na pasta `docs/`.

## Funcionalidades Implementadas

- **Etapa 01:** Especificação inicial, escopo e proposta do projeto (`docs/proposta.md`).

- **Etapa 02:** Protótipo estrutural com HTML5 semântico contendo 4 interfaces principais (`index.html`, `dashboard.html`, `novo_chamado.html`, `detalhes_chamado.html`) e documentação em `docs/etapa-02.md`.

- **Etapa 03:** Estilização visual completa com CSS3, design responsivo (Mobile First / Breakpoints), paleta de cores personalizada e acessibilidade (`docs/etapa-03.md`).

- **Etapa 04:** Interatividade e comportamentos dinâmicos com JavaScript (ES6+), validação de formulários em tempo real, filtros e linha do tempo interativa (`docs/etapa-04.md`).

- **Etapa 05:** Modularização do código JavaScript, integração assíncrona com Fetch API (`async/await`), gestão de estados (carregamento, sucesso e erro) e persistência via servidor simulado (JSON Server).

## Limitações Conhecidas

- Esta entrega refere-se à **Etapa 05 (Modularização e Comunicação Assíncrona)**.
- A persistência e as requisições utilizam um ambiente simulado local (`db.json` via JSON Server) como preparação para o backend definitivo nas próximas fases.