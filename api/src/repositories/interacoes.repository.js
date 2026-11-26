import pool from '../config/db.js';

export async function listarInteracoesPorChamadoDb(chamadoId) {
  const [linhas] = await pool.execute(
    `SELECT
       i.id,
       i.chamado_id,
       i.autor_id,
       u.nome AS autor_nome,
       u.perfil AS autor_perfil,
       i.mensagem,
       i.criado_em
     FROM interacoes_chamado i
     INNER JOIN usuarios u ON u.id = i.autor_id
     WHERE i.chamado_id = ?
     ORDER BY i.criado_em ASC, i.id ASC`,
    [chamadoId]
  );

  return linhas;
}

export async function criarInteracaoChamadoDb({ chamadoId, autorId, mensagem }) {
  const [resultado] = await pool.execute(
    `INSERT INTO interacoes_chamado (chamado_id, autor_id, mensagem)
     VALUES (?, ?, ?)`,
    [chamadoId, autorId, mensagem]
  );

  const [linhas] = await pool.execute(
    `SELECT
       i.id,
       i.chamado_id,
       i.autor_id,
       u.nome AS autor_nome,
       u.perfil AS autor_perfil,
       i.mensagem,
       i.criado_em
     FROM interacoes_chamado i
     INNER JOIN usuarios u ON u.id = i.autor_id
     WHERE i.id = ?
     LIMIT 1`,
    [resultado.insertId]
  );

  return linhas[0] || null;
}