# Documentação da Etapa 03 — Interface Responsiva com CSS

Este documento descreve a implementação da estilização e responsividade da aplicação **TechDesk**, atendendo a todos os requisitos de layout adaptável, arquitetura CSS modular e padronização visual.

---

## 1. Interfaces Apresentadas

Para a composição das evidências, foram selecionadas as 3 páginas mais representativas da aplicação desenvolvidas na Etapa 02:

1. **Interface 01 — Dashboard (`dashboard.html`):** Painel principal com visão geral, cards de métricas, formulário de filtros e tabela de acompanhamento de chamados.
2. **Interface 02 — Novo Chamado (`novo_chamado.html`):** Formulário para abertura de solicitações e suporte técnico.
3. **Interface 03 — Detalhes do Chamado (`detalhes_chamado.html`):** Interface de atendimento com informações do ticket, histórico de atualizações e formulário de parecer técnico.

---

## 2. Viewport Utilizado em Cada Evidência

As capturas de tela foram registradas na pasta `/docs/evidencias/etapa-03/` com base nos 3 viewports padronizados requeridos:

| Categoria | Viewport (L × A) | Arquivos de Evidência Associados |
| :--- | :--- | :--- |
| **Desktop** | `1440 × 900 px` | `desktop-tela-01.png`<br>`desktop-tela-02.png`<br>`desktop-tela-03.png` |
| **Tablet** | `768 × 1024 px` | `tablet-tela-01.png`<br>`tablet-tela-02.png`<br>`tablet-tela-03.png` |
| **Smartphone** | `390 × 844 px` | `smartphone-tela-01.png`<br>`smartphone-tela-02.png`<br>`smartphone-tela-03.png` |

---

## 3. Breakpoints Utilizados

Para garantir que a interface reaja uniformemente em diferentes tamanhos de tela, foram definidos **dois breakpoints principais**:

* **Breakpoint 1 — `max-width: 768px` (Tablets e Telas Médias):**
  * Reorganiza a navegação do cabeçalho de horizontal para vertical/centralizada.
  * Converte os cards de estatística da Dashboard de 4 colunas para 2 colunas.
  * Empilha os filtros de busca e converte o layout de 2 colunas da tela de Detalhes em coluna única.
* **Breakpoint 2 — `max-width: 480px` (Smartphones e Telas Pequenas):**
  * Transforma todos os containers e grids em coluna única (100% de largura).
  * Empilha os campos de formulário que ficavam lado a lado (`.form-row`).
  * Expande os botões de ação para ocuparem toda a largura da tela, facilitando a interação por toque.

---

## 4. Principais Decisões de Responsividade

* **Uso de CSS Grid:** Aplicado na distribuição dos cards estatísticos na Dashboard (`.stats-grid`) e na separação da área principal e barra lateral em Detalhes do Chamado (`.details-layout`).
* **Uso de Flexbox:** Utilizado no alinhamento do cabeçalho e menu (`.main-header`), organização interna dos formulários (`.filter-form`, `.form-grid`), agrupamento de botões e centralização da tela de login.
* **Tabelas Adaptáveis:** Inclusão de um container com `overflow-x: auto` (`.table-responsive`) na listagem de chamados da Dashboard para permitir rolagem horizontal em telas móveis sem quebrar a largura da página.
* **Toque e Acessibilidade:** Redimensionamento de botões e campos de entrada para ocuparem 100% da largura em dispositivos móveis, garantindo áreas de clique confortáveis.

---

## 5. Localização dos Arquivos CSS Responsáveis

Toda a estilização e regras de responsividade (*media queries*) estão organizadas de forma modular no diretório `src/css/`:

* **`src/css/global.css`**: Define as variáveis de cor, reset CSS, tipografia, rodapé, botões base e a responsividade do cabeçalho/menu de navegação (`<header>` / `<nav>`).
* **`src/css/dashboard.css`**: Responsável pelo layout responsivo em Grid da Dashboard, formulário de filtros e tabela de chamados.
* **`src/css/form.css`**: Responsável pela responsividade dos formulários de abertura de novos chamados, visualização detalhada de tickets e linha do tempo do histórico de atendimento.
* **`src/css/login.css`**: Responsável pelo alinhamento e card de autenticação da tela inicial (`index.html`).