# Proposta e Especificação do Projeto: TechDesk

## 1. Nome da Aplicação
**TechDesk — Sistema Web de Gerenciamento de Chamados de TI**

## 2. Descrição do Problema
Em muitas pequenas e médias empresas, solicitações de suporte de TI são realizadas por mensagens informais ou e-mails, o que resulta em perda de histórico e desorganização da equipe técnica. O TechDesk centraliza essas solicitações em uma plataforma Web estruturada.

## 3. Público-Alvo
- **Funcionários:** Registram chamados de suporte e acompanham o andamento da solução.
- **Técnicos de TI:** Visualizam, assumem, comentam e alteram o status dos chamados.

## 4. Objetivo Principal
Desenvolver uma aplicação Web para centralizar e gerenciar o fluxo de atendimento de suporte de TI, permitindo registro de chamados, controle de status, histórico de interações e métricas básicas de atendimento.

## 5. Funcionalidades da Aplicação
1. **Autenticação e Perfis:** Login diferenciado para Funcionários e Técnicos de TI.
2. **Abertura de Chamados:** Formulário para registrar título, descrição, categoria e prioridade.
3. **Acompanhamento de Status:** Visualização do estado do chamado (*Aberto*, *Em Atendimento*, *Resolvido*).
4. **Atendimento pelo Técnico:** Permissão para o técnico assumir chamados e registrar a solução.
5. **Histórico e Comentários:** Linha do tempo com atualizações e mensagens trocadas no chamado.
6. **Gerenciamento de Categorias:** Permite cadastrar categorias de problemas (ex: Hardware, Rede, Software).
7. **Dashboard Resumido:** Indicadores Numéricos com contadores de chamados por status.

## 6. Entidades do Domínio
1. **Usuário (`User`):** Nome, E-mail, Senha e Tipo de Perfil (Funcionário ou Técnico).
2. **Chamado (`Ticket`):** Título, Descrição, Prioridade, Status, Data de Abertura e Atualização.
3. **Categoria (`Category`):** Classificação do problema (Hardware, Software, Rede, etc.).
4. **Comentário (`Comment`):** Mensagens e pareceres técnicos atrelados a um chamado.

## 7. Descrição das Telas e Interfaces
1. **Tela de Login:** Autenticação de usuários no sistema.
2. **Dashboard / Visão Geral:** Exibição de contadores e lista de chamados recentes.
3. **Meus Chamados:** Listagem de chamados do usuário com filtros de busca.
4. **Formulário de Abertura:** Interface para registrar uma nova solicitação.
5. **Detalhes do Chamado:** Exibição completa, histórico e caixa de mensagens/comentários.

## 8. Operações da Aplicação
1. Cadastrar e autenticar usuário.
2. Criar novo chamado de suporte.
3. Atribuir chamado a um técnico.
4. Atualizar o status do chamado (*Aberto* -> *Em Atendimento* -> *Resolvido*).
5. Adicionar comentário/parecer técnico ao chamado.
6. Filtrar e pesquisar chamados por categoria e status.

## 9. Tecnologias Planejadas para o Cliente
- HTML5, CSS3, JavaScript
- React.js

## 10. Tecnologias Planejadas para o Servidor
- Node.js
- Express.js

## 11. Tecnologia de Persistência
- Banco de dados relacional MySQL

## 12. Diagrama Visão Geral da Solução

```text
  +-------------------------------------------------------+
  |                   CLIENTE (FRONTEND)                  |
  |              React.js / HTML / CSS / JS               |
  |               (Funcionário / Técnico)                 |
  +-------------------------------------------------------+
                              |
                       Requisições HTTP
                              v
  +-------------------------------------------------------+
  |                   SERVIDOR (BACKEND)                  |
  |                   Node.js / Express                   |
  |        - API REST / Autenticação / Regras             |
  +-------------------------------------------------------+
                              |
                        Consultas SQL
                              v
  +-------------------------------------------------------+
  |                   BANCO DE DADOS                      |
  |                        MySQL                          |
  |       - Tabelas: Usuarios, Chamados, Categorias...    |
  +-------------------------------------------------------+