CREATE DATABASE IF NOT EXISTS techdesk_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE techdesk_db;

-- 1. Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  perfil ENUM('tecnico', 'usuario') NOT NULL DEFAULT 'usuario',
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tabela de chamados
CREATE TABLE IF NOT EXISTS chamados (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(160) NOT NULL,
  descricao TEXT NOT NULL,
  categoria ENUM('Hardware', 'Software', 'Rede', 'Acesso', 'Outros') NOT NULL DEFAULT 'Outros',
  prioridade ENUM('Baixa', 'Média', 'Alta', 'Crítica') NOT NULL DEFAULT 'Média',
  status ENUM('Aberto', 'Em Atendimento', 'Aguardando Usuário', 'Resolvido', 'Fechado') NOT NULL DEFAULT 'Aberto',
  solicitante_id INT UNSIGNED NOT NULL,
  tecnico_id INT UNSIGNED NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_chamados_solicitante
    FOREIGN KEY (solicitante_id) REFERENCES usuarios(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_chamados_tecnico
    FOREIGN KEY (tecnico_id) REFERENCES usuarios(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 3. Tabela de interações / histórico (bate-papo entre solicitante e técnico)
CREATE TABLE IF NOT EXISTS interacoes_chamado (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  chamado_id INT UNSIGNED NOT NULL,
  autor_id INT UNSIGNED NOT NULL,
  mensagem TEXT NOT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_interacoes_chamado
    FOREIGN KEY (chamado_id) REFERENCES chamados(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_interacoes_autor
    FOREIGN KEY (autor_id) REFERENCES usuarios(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Índices úteis para buscas e filtros
CREATE INDEX idx_chamados_status ON chamados(status);
CREATE INDEX idx_chamados_solicitante ON chamados(solicitante_id);
CREATE INDEX idx_chamados_tecnico ON chamados(tecnico_id);
CREATE INDEX idx_interacoes_chamado ON interacoes_chamado(chamado_id);

-- Dados iniciais para testes (mesmos usuários já usados na autenticação)
INSERT IGNORE INTO usuarios (id, nome, email, senha, perfil) VALUES
  (1, 'Carlos Técnico', 'carlos@techdesk.local', '123', 'tecnico'),
  (2, 'Ana Solicitante', 'ana@techdesk.local', '123', 'usuario');

INSERT IGNORE INTO chamados (id, titulo, descricao, categoria, prioridade, status, solicitante_id, tecnico_id) VALUES
  (101, 'Impressora do setor de vendas não liga', 'A impressora de etiquetas do setor de vendas parou de responder hoje pela manhã.', 'Hardware', 'Alta', 'Aberto', 2, 1),
  (102, 'Sem acesso ao sistema ERP', 'Erro de autenticação ao tentar abrir o módulo financeiro.', 'Software', 'Média', 'Em Atendimento', 2, 1);

INSERT IGNORE INTO interacoes_chamado (id, chamado_id, autor_id, mensagem) VALUES
  (1, 101, 1, 'Chamado atribuído à equipe de Hardware. Verifique se o cabo de força está firme na tomada.'),
  (2, 101, 2, 'Verifiquei o cabo e troquei de tomada, mesmo assim o LED de energia não acende.');