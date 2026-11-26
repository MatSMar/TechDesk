import pool from '../config/db.js';

export async function buscarUsuarioPorEmail(email) {
  const [linhas] = await pool.execute(
    `SELECT id, nome, email, senha, perfil, criado_em
     FROM usuarios
     WHERE LOWER(email) = LOWER(?)
     LIMIT 1`,
    [email]
  );

  return linhas[0] || null;
}

export async function buscarUsuarioPorId(id) {
  const [linhas] = await pool.execute(
    `SELECT id, nome, email, perfil, criado_em
     FROM usuarios
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return linhas[0] || null;
}