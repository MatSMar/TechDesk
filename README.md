# TechDesk

## Nome do Projeto
**TechDesk — Sistema Web de Gerenciamento de Chamados de TI**

## Descrição da Aplicação
O TechDesk é uma aplicação Web criada para centralizar, organizar e gerenciar solicitações de suporte e atendimento técnico de TI em pequenas e médias empresas.

## Problema que a Aplicação Resolve
Evita a perda de histórico, falhas de comunicação e desorganização decorrentes de chamados feitos por mensagens informais ou e-mails, disponibilizando um fluxo estruturado com controle de status, prioridades e canal direto entre funcionários e técnicos de TI.

## Tecnologias Utilizadas
- **Frontend:** HTML5 Semântico, CSS3 (Design Responsivo, CSS Grid, Flexbox), JavaScript (ES6+ / Manipulação do DOM)
- **Controle de Versão:** Git / GitHub

## Instruções para Execução
Atualmente, o projeto conta com as interfaces desenvolvidas em HTML5, estilizadas com CSS3 responsivo e com comportamentos dinâmicos e validações implementadas em JavaScript. Para visualizar e testar a aplicação:
1. Clone ou baixe o repositório em sua máquina.
2. Navegue até a pasta do projeto e abra o arquivo `src/html/index.html` em qualquer navegador web moderno.
3. As instruções detalhadas para teste das funcionalidades dinâmicas de cada etapa encontram-se na pasta `docs/`.

## Funcionalidades Implementadas
- **Etapa 01:** Especificação inicial, escopo e proposta do projeto (`docs/proposta.md`).
- **Etapa 02:** Protótipo estrutural com HTML5 semântico contendo 4 interfaces principais (`index.html`, `dashboard.html`, `novo_chamado.html`, `detalhes_chamado.html`) e documentação em `docs/documentacao_etapa-02.md`.
- **Etapa 03:** Estilização visual completa com CSS3, design responsivo (Mobile First / Breakpoints), paleta de cores personalizada e acessibilidade (`docs/etapa-03.md`).
- **Etapa 04:** Interatividade e comportamentos dinâmicos com JavaScript (ES6+), incluindo validação de formulários em tempo real, filtro e busca dinâmica na Dashboard, atualização dinâmica de status e inclusão de pareceres na linha do tempo (`docs/etapa-04.md`).

## Limitações Conhecidas
- Esta entrega refere-se à **Etapa 04 (Interatividade com JavaScript)**.
- A persistência dos dados e a alternância entre contas de usuário são simuladas via manipulação do DOM na camada cliente (front-end).
- Não há integração funcional com servidor backend ou banco de dados nesta fase.