# Documentação da Etapa 02 (TechDesk)

## 1. Visão Geral
Nesta segunda etapa do projeto **TechDesk**, foi desenvolvida a estrutura base das interfaces Web utilizando **HTML5 Semântico**, sem dependência de estilização CSS complexa ou lógica de backend. O foco principal foi garantir acessibilidade, organização de elementos, boas práticas de SEO e conformidade com os requisitos da disciplina.

---

## 2. Páginas Criadas
Para contemplar todo o fluxo da aplicação e atender aos requisitos, foram implementadas **4 páginas representativas**:

1. **`index.html` (Tela de Login e Autenticação):**
   - Interface de acesso para Funcionários e Técnicos.
   - Contém formulário com campos de e-mail e senha.

2. **`dashboard.html` (Painel Geral e Gestão de Chamados):**
   - Interface principal do sistema unificada para Funcionários e Técnicos.
   - Apresenta estatísticas resumidas de chamados (Total, Abertos, Em Andamento, Concluídos) e a listagem estruturada das solicitações.
   - Inclui controles de filtro para alternar visões ("Meus Chamados" vs. "Todos os Chamados").

3. **`novo_chamado.html` (Formulário de Abertura):**
   - Interface de registro de incidentes e solicitações de TI pelo usuário solicitante.
   - Formulário completo para inserção do título, categoria, prioridade e descrição detalhada do problema.

4. **`detalhes_chamado.html` (Visualização e Atendimento):**
   - Interface para acompanhamento e alteração do ciclo de vida de um chamado específico.
   - Exibe informações detalhadas da solicitação, histórico de atualizações e campo para o técnico registrar pareceres ou soluções.

---

## 3. Funcionalidades Implementadas
Apesar de ser uma etapa estática, a estrutura HTML simula e representa as seguintes funcionalidades chave do domínio do sistema:

- **Autenticação Simulado:** Redirecionamento básico via formulário para o painel principal.
- **Filtragem e Pesquisa de Chamados:** Componentes de entrada (`<select>` e `<input type="text">`) estruturados para permitir posterior integração com filtros de busca.
- **Abertura de Chamados:** Coleta padronizada dos dados necessários que serão posteriormente vinculados ao usuário logado e persistidos no banco de dados.
- **Histórico e Atendimento:** Registro ordenado de comentários e respostas técnicas associadas a um determinado chamado.

---

## 4. Decisões Relacionadas à Estrutura HTML e Semântica

A estrutura de marcação foi elaborada estritamente com base nos padrões do **HTML5 Semântico**, priorizando o significado das tags em relação ao seu aspecto visual:

### 4.1. Estrutura Geral das Páginas
- **`<header>`:** Utilizado no topo das páginas para abrigar a identidade visual (logomarca **TechDesk**) e saudações/identificação do usuário.
- **`<nav>`:** Define a barra de navegação principal, garantindo que leitores de tela e robôs de busca identifiquem os links de trânsito entre as telas.
- **`<main>`:** Delimita o conteúdo exclusivo e central de cada página, garantindo que a área principal não seja confundida com menus ou rodapés.
- **`<footer>`:** Presente no rodapé das páginas para exibir informações de copyright e identificação do projeto acadêmico.

### 4.2. Organização de Conteúdo (`<section>` e `<article>`)
- **`<section>`:** Empregada para agrupar blocos temáticos dentro de uma mesma página (ex: Seção de Estatísticas, Seção de Filtros, Seção de Histórico).
- **`<article>`:** Utilizado para representar elementos autônomos e independentes da interface. No **TechDesk**, cada **card/item de chamado** na listagem e cada **resposta/comentário** no histórico foram envolvidos por `<article>`, pois possuem significado próprio e isolável.

### 4.3. Formulários e Acessibilidade (`<form>`, `<label>`, `<input>`)
- **Associação Rótulo-Campo:** Todos os campos de formulário (`<input>`, `<select>`, `<textarea>`) possuem tags `<label>` com o atributo `for` estritamente associado ao `id` correspondente do campo, garantindo acessibilidade para leitores de tela.
- **Semântica de Tipos:** Utilização de tipos nativos adequados (`type="email"`, `type="password"`, `type="text"`) e tags específicas como `<select>` para seleções fixas de prioridade e categoria.
- **Diferenciação de Ações (`action` e `method`):** Os formulários possuem destinos configurados para simular a navegação do protótipo (`action="dashboard.html"`), preparando a estrutura para substituição futura por rotas de API.

### 4.4. Otimização e Metadados (SEO)
- Todas as páginas incluem metadados essenciais no `<head>`:
  - Definidor de codificação (`charset="UTF-8"`) e responsividade (`viewport`).
  - Meta tags `<meta name="description">` personalizadas por contexto da tela.
  - Meta tags `<meta name="keywords">` e `<meta name="author">` para identificação de autoria e indexação.