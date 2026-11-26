import {
  listarChamadosDb,
  buscarChamadoPorIdDb,
  criarChamadoDb,
  atualizarChamadoDb,
  removerChamadoDb
} from '../repositories/chamados.repository.js';
import {
  listarInteracoesPorChamadoDb,
  criarInteracaoChamadoDb
} from '../repositories/interacoes.repository.js';
import { buscarUsuarioPorId } from '../repositories/usuarios.repository.js';

const CATEGORIAS_VALIDAS = ['Hardware', 'Software', 'Rede', 'Acesso', 'Outros'];
const PRIORIDADES_VALIDAS = ['Baixa', 'Média', 'Alta', 'Crítica'];
const STATUS_VALIDOS = ['Aberto', 'Em Atendimento', 'Aguardando Usuário', 'Resolvido', 'Fechado'];

function criarErro(statusCode, erro, mensagem, detalhes = null) {
  const err = new Error(mensagem);
  err.statusCode = statusCode;
  err.name = erro;
  if (detalhes) err.detalhes = detalhes;
  return err;
}

function validarId(idParam) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    throw criarErro(400, 'ID inválido', 'O parâmetro id deve ser um número inteiro positivo.');
  }
  return id;
}

function validarPayloadChamado(body, { parcial = false } = {}) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw criarErro(400, 'Requisição inválida', 'O corpo da requisição deve ser um objeto JSON válido.');
  }

  const erros = [];
  const dadosValidados = {};

  if (!parcial || Object.hasOwn(body, 'titulo')) {
    if (typeof body.titulo !== 'string' || body.titulo.trim().length < 3) {
      erros.push('O campo "titulo" é obrigatório e deve ter pelo menos 3 caracteres.');
    } else {
      dadosValidados.titulo = body.titulo.trim();
    }
  }

  if (!parcial || Object.hasOwn(body, 'categoria')) {
    if (typeof body.categoria !== 'string' || !CATEGORIAS_VALIDAS.includes(body.categoria.trim())) {
      erros.push(`O campo "categoria" deve ser um destes valores: ${CATEGORIAS_VALIDAS.join(', ')}.`);
    } else {
      dadosValidados.categoria = body.categoria.trim();
    }
  }

  if (!parcial || Object.hasOwn(body, 'prioridade')) {
    if (typeof body.prioridade !== 'string' || !PRIORIDADES_VALIDAS.includes(body.prioridade.trim())) {
      erros.push(`O campo "prioridade" deve ser um destes valores: ${PRIORIDADES_VALIDAS.join(', ')}.`);
    } else {
      dadosValidados.prioridade = body.prioridade.trim();
    }
  }

  if (!parcial || Object.hasOwn(body, 'status')) {
    if (body.status === undefined && !parcial) {
      dadosValidados.status = 'Aberto';
    } else if (typeof body.status !== 'string' || !STATUS_VALIDOS.includes(body.status.trim())) {
      erros.push(`O campo "status" deve ser um destes valores: ${STATUS_VALIDOS.join(', ')}.`);
    } else {
      dadosValidados.status = body.status.trim();
    }
  }

  if (!parcial || Object.hasOwn(body, 'descricao')) {
    if (typeof body.descricao !== 'string' || body.descricao.trim().length < 5) {
      erros.push('O campo "descricao" é obrigatório e deve ter pelo menos 5 caracteres.');
    } else {
      dadosValidados.descricao = body.descricao.trim();
    }
  }

  if (!parcial) {
    const solicitanteRaw = body.solicitanteId ?? body.solicitante_id ?? 2;
    const solicitanteId = Number(solicitanteRaw);
    if (!Number.isInteger(solicitanteId) || solicitanteId <= 0) {
      erros.push('O campo "solicitanteId" deve ser um número inteiro positivo.');
    } else {
      dadosValidados.solicitanteId = solicitanteId;
    }
  }

  if (Object.hasOwn(body, 'tecnicoId') || Object.hasOwn(body, 'tecnico_id')) {
    const tecnicoRaw = body.tecnicoId ?? body.tecnico_id;
    if (tecnicoRaw === null || tecnicoRaw === '') {
      dadosValidados.tecnico_id = null;
    } else {
      const tecnicoId = Number(tecnicoRaw);
      if (!Number.isInteger(tecnicoId) || tecnicoId <= 0) {
        erros.push('O campo "tecnicoId" deve ser um número inteiro positivo ou nulo.');
      } else {
        dadosValidados.tecnico_id = tecnicoId;
      }
    }
  }

  if (parcial && Object.keys(dadosValidados).length === 0 && erros.length === 0) {
    erros.push('Envie ao menos um campo válido para atualização.');
  }

  if (erros.length > 0) {
    throw criarErro(400, 'Erro de validação', 'Os dados enviados são inválidos.', erros);
  }

  return dadosValidados;
}

function traduzirErroBanco(err, next) {
  if (err?.code === 'ER_NO_REFERENCED_ROW_2') {
    return next(criarErro(400, 'Referência inválida', 'O usuário informado não existe na base de dados.'));
  }
  if (err?.code === 'ER_ROW_IS_REFERENCED_2') {
    return next(criarErro(409, 'Conflito de integridade', 'Este registro está vinculado a outros dados e não pode ser removido.'));
  }
  if (err?.code === 'ECONNREFUSED' || err?.code === 'ER_ACCESS_DENIED_ERROR') {
    return next(criarErro(503, 'Serviço de banco indisponível', 'Não foi possível conectar ao banco de dados MySQL.'));
  }
  return next(err);
}

export async function listarChamados(req, res, next) {
  try {
    const { status, prioridade, categoria, busca, usuarioId, perfil } = req.query;
    const chamados = await listarChamadosDb({
      status,
      prioridade,
      categoria,
      busca,
      usuarioId: usuarioId ? Number(usuarioId) : undefined,
      perfil
    });
    res.status(200).json(chamados);
  } catch (err) {
    traduzirErroBanco(err, next);
  }
}

export async function buscarChamadoPorId(req, res, next) {
  try {
    const id = validarId(req.params.id);
    const chamado = await buscarChamadoPorIdDb(id);

    if (!chamado) {
      throw criarErro(404, 'Recurso não encontrado', `Chamado com id ${id} não foi encontrado.`);
    }

    const interacoes = await listarInteracoesPorChamadoDb(id);
    res.status(200).json({ ...chamado, interacoes });
  } catch (err) {
    traduzirErroBanco(err, next);
  }
}

export async function criarChamado(req, res, next) {
  try {
    const dados = validarPayloadChamado(req.body, { parcial: false });

    const solicitante = await buscarUsuarioPorId(dados.solicitanteId);
    if (!solicitante) {
      throw criarErro(400, 'Solicitante inválido', `Usuário solicitante com id ${dados.solicitanteId} não encontrado.`);
    }

    const novoChamado = await criarChamadoDb(dados);
    res.status(201).json(novoChamado);
  } catch (err) {
    traduzirErroBanco(err, next);
  }
}

export async function substituirChamado(req, res, next) {
  try {
    const id = validarId(req.params.id);
    const dados = validarPayloadChamado(req.body, { parcial: false });
    const atualizado = await atualizarChamadoDb(id, dados);

    if (!atualizado) {
      throw criarErro(404, 'Recurso não encontrado', `Chamado com id ${id} não foi encontrado.`);
    }

    res.status(200).json(atualizado);
  } catch (err) {
    traduzirErroBanco(err, next);
  }
}

export async function atualizarParcialChamado(req, res, next) {
  try {
    const id = validarId(req.params.id);
    const dados = validarPayloadChamado(req.body, { parcial: true });
    const atualizado = await atualizarChamadoDb(id, dados);

    if (!atualizado) {
      throw criarErro(404, 'Recurso não encontrado', `Chamado com id ${id} não foi encontrado.`);
    }

    res.status(200).json(atualizado);
  } catch (err) {
    traduzirErroBanco(err, next);
  }
}

export async function removerChamado(req, res, next) {
  try {
    const id = validarId(req.params.id);
    const removido = await removerChamadoDb(id);

    if (!removido) {
      throw criarErro(404, 'Recurso não encontrado', `Chamado com id ${id} não foi encontrado.`);
    }

    res.status(200).json({
      mensagem: `Chamado #${id} removido com sucesso.`,
      chamado: removido
    });
  } catch (err) {
    traduzirErroBanco(err, next);
  }
}

export async function listarInteracoesChamado(req, res, next) {
  try {
    const id = validarId(req.params.id);
    const chamado = await buscarChamadoPorIdDb(id);

    if (!chamado) {
      throw criarErro(404, 'Recurso não encontrado', `Chamado com id ${id} não foi encontrado.`);
    }

    const interacoes = await listarInteracoesPorChamadoDb(id);
    res.status(200).json(interacoes);
  } catch (err) {
    traduzirErroBanco(err, next);
  }
}

export async function adicionarInteracaoChamado(req, res, next) {
  try {
    const id = validarId(req.params.id);
    const chamado = await buscarChamadoPorIdDb(id);

    if (!chamado) {
      throw criarErro(404, 'Recurso não encontrado', `Chamado com id ${id} não foi encontrado.`);
    }

    const { mensagem, autorId, autor_id } = req.body || {};
    const mensagemLimpa = String(mensagem || '').trim();
    const autorIdNum = Number(autorId ?? autor_id);

    if (!mensagemLimpa) {
      throw criarErro(400, 'Erro de validação', 'O campo "mensagem" é obrigatório.');
    }

    if (!Number.isInteger(autorIdNum) || autorIdNum <= 0) {
      throw criarErro(400, 'Erro de validação', 'O campo "autorId" deve ser um número inteiro positivo.');
    }

    const autor = await buscarUsuarioPorId(autorIdNum);
    if (!autor) {
      throw criarErro(400, 'Autor inválido', `Usuário autor com id ${autorIdNum} não encontrado.`);
    }

    const interacao = await criarInteracaoChamadoDb({
      chamadoId: id,
      autorId: autorIdNum,
      mensagem: mensagemLimpa
    });

    res.status(201).json(interacao);
  } catch (err) {
    traduzirErroBanco(err, next);
  }
}