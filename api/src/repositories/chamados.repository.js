import pool from '../config/db.js';

const SELECT_CHAMADO_BASE = `
  SELECT
    c.id,
    c.titulo,
    c.descricao,
    c.categoria,
    c.prioridade,
    c.status,
    c.solicitante_id,
    sol.nome AS solicitante_nome,
    sol.perfil AS solicitante_perfil,
    c.tecnico_id,
    tec.nome AS tecnico_nome,
    c.criado_em,
    c.atualizado_em
  FROM chamados c
  INNER JOIN usuarios sol ON sol.id = c.solicitante_id
  LEFT JOIN usuarios tec ON tec.id = c.tecnico_id
`;

export async function listarChamadosDb({ status, prioridade, categoria, busca, usuarioId, perfil } = {}) {
  const where = [];
  const params = [];

  // Se for funcionário ("usuario"), restringe aos chamados abertos por ele mesmo
  if (perfil === 'usuario' && usuarioId) {
    where.push('c.solicitante_id = ?');
    params.push(usuarioId);
  }

  if (status) {
    where.push('LOWER(c.status) = LOWER(?)');
    params.push(String(status).trim());
  }

  if (prioridade) {
    where.push('LOWER(c.prioridade) = LOWER(?)');
    params.push(String(prioridade).trim());
  }

  if (categoria) {
    where.push('LOWER(c.categoria) = LOWER(?)');
    params.push(String(categoria).trim());
  }

  if (busca) {
    const termo = `%${String(busca).trim()}%`;
    where.push('(c.titulo LIKE ? OR c.descricao LIKE ? OR CAST(c.id AS CHAR) LIKE ? OR sol.nome LIKE ?)');
    params.push(termo, termo, termo, termo);
  }

  let sql = SELECT_CHAMADO_BASE;
  if (where.length > 0) {
    sql += ` WHERE ${where.join(' AND ')}`;
  }
  sql += ' ORDER BY c.criado_em DESC, c.id DESC';

  const [linhas] = await pool.execute(sql, params);
  return linhas;
}

export async function buscarChamadoPorIdDb(id) {
  const [linhas] = await pool.execute(
    `${SELECT_CHAMADO_BASE} WHERE c.id = ? LIMIT 1`,
    [id]
  );
  return linhas[0] || null;
}

export async function criarChamadoDb({ titulo, descricao, categoria, prioridade, status, solicitanteId, tecnicoId = null }) {
  const [resultado] = await pool.execute(
    `INSERT INTO chamados (titulo, descricao, categoria, prioridade, status, solicitante_id, tecnico_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [titulo, descricao, categoria, prioridade, status, solicitanteId, tecnicoId]
  );

  return buscarChamadoPorIdDb(resultado.insertId);
}

export async function atualizarChamadoDb(id, campos) {
  const colunas = [];
  const params = [];

  if (Object.hasOwn(campos, 'titulo')) {
    colunas.push('titulo = ?');
    params.push(campos.titulo);
  }
  if (Object.hasOwn(campos, 'descricao')) {
    colunas.push('descricao = ?');
    params.push(campos.descricao);
  }
  if (Object.hasOwn(campos, 'categoria')) {
    colunas.push('categoria = ?');
    params.push(campos.categoria);
  }
  if (Object.hasOwn(campos, 'prioridade')) {
    colunas.push('prioridade = ?');
    params.push(campos.prioridade);
  }
  if (Object.hasOwn(campos, 'status')) {
    colunas.push('status = ?');
    params.push(campos.status);
  }
  if (Object.hasOwn(campos, 'tecnico_id')) {
    colunas.push('tecnico_id = ?');
    params.push(campos.tecnico_id);
  }

  if (colunas.length === 0) {
    return buscarChamadoPorIdDb(id);
  }

  params.push(id);

  const [resultado] = await pool.execute(
    `UPDATE chamados SET ${colunas.join(', ')} WHERE id = ?`,
    params
  );

  if (resultado.affectedRows === 0) {
    return null;
  }

  return buscarChamadoPorIdDb(id);
}

export async function removerChamadoDb(id) {
  const existente = await buscarChamadoPorIdDb(id);
  if (!existente) {
    return null;
  }

  await pool.execute('DELETE FROM chamados WHERE id = ?', [id]);
  return existente;
}