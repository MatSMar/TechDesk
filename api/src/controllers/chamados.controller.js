import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

//resolve o caminho do arquivo json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.resolve(__dirname, '../data/chamados.json');

//valores permitidos pros campos
const CATEGORIAS_VALIDAS = ['Hardware', 'Software', 'Rede', 'Acesso', 'Outros'];
const PRIORIDADES_VALIDAS = ['Baixa', 'Média', 'Alta', 'Crítica'];
const STATUS_VALIDOS = ['Aberto', 'Em Atendimento', 'Aguardando Usuário', 'Resolvido', 'Fechado'];

//cria objeto de erro
function criarErro(statusCode, erro, mensagem, detalhes = null) {
  const err = new Error(mensagem);
  err.statusCode = statusCode;
  err.name = erro;
  if (detalhes) err.detalhes = detalhes;
  return err;
}

//le os chamados salvos no json
async function lerChamados() {
  const conteudo = await fs.readFile(DATA_PATH, 'utf-8');
  const dados = JSON.parse(conteudo);
  return Array.isArray(dados.chamados) ? dados.chamados : [];
}

//grava a lista atualizada de chamados no json
async function salvarChamados(chamados) {
  await fs.writeFile(DATA_PATH, JSON.stringify({ chamados }, null, 2), 'utf-8');
}

//verifica se o id informado na url é inteiro positivo
function validarId(idParam) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    throw criarErro(400, 'ID inválido', 'O parâmetro id deve ser um número inteiro positivo.');
  }
  return id;
}

//valida campos obrigatórios ou parciais do chamado
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

  if (parcial && Object.keys(dadosValidados).length === 0 && erros.length === 0) {
    erros.push('Envie ao menos um campo válido para atualização (titulo, categoria, prioridade, status ou descricao).');
  }

  if (erros.length > 0) {
    throw criarErro(400, 'Erro de validação', 'Os dados enviados são inválidos.', erros);
  }

  return dadosValidados;
}

//lista chamados com filtros
export async function listarChamados(req, res, next) {
  try {
    let chamados = await lerChamados();

    const { status, prioridade, categoria, busca } = req.query;

    if (status) {
      chamados = chamados.filter((c) => c.status.toLowerCase() === String(status).toLowerCase());
    }
    if (prioridade) {
      chamados = chamados.filter((c) => c.prioridade.toLowerCase() === String(prioridade).toLowerCase());
    }
    if (categoria) {
      chamados = chamados.filter((c) => c.categoria.toLowerCase() === String(categoria).toLowerCase());
    }
    if (busca) {
      const termo = String(busca).toLowerCase().trim();
      chamados = chamados.filter(
        (c) =>
          c.titulo.toLowerCase().includes(termo) ||
          c.descricao.toLowerCase().includes(termo) ||
          String(c.id).includes(termo)
      );
    }

    res.status(200).json(chamados);
  } catch (err) {
    next(err);
  }
}

//busca um chamado pelo id
export async function buscarChamadoPorId(req, res, next) {
  try {
    const id = validarId(req.params.id);
    const chamados = await lerChamados();
    const chamado = chamados.find((c) => Number(c.id) === id);

    if (!chamado) {
      throw criarErro(404, 'Recurso não encontrado', `Chamado com id ${id} não foi encontrado.`);
    }

    res.status(200).json(chamado);
  } catch (err) {
    next(err);
  }
}

//cria um novo chamado e persiste no json
export async function criarChamado(req, res, next) {
  try {
    const dados = validarPayloadChamado(req.body, { parcial: false });
    const chamados = await lerChamados();

    const maiorId = chamados.reduce((max, item) => Math.max(max, Number(item.id) || 0), 100);
    const novoChamado = {
      id: maiorId + 1,
      ...dados,
      dataCriacao: new Date().toISOString()
    };

    chamados.push(novoChamado);
    await salvarChamados(chamados);

    res.status(201).json(novoChamado);
  } catch (err) {
    next(err);
  }
}

//substitui todos os campos editáveis de um chamado existente
export async function substituirChamado(req, res, next) {
  try {
    const id = validarId(req.params.id);
    const dados = validarPayloadChamado(req.body, { parcial: false });
    const chamados = await lerChamados();
    const indice = chamados.findIndex((c) => Number(c.id) === id);

    if (indice === -1) {
      throw criarErro(404, 'Recurso não encontrado', `Chamado com id ${id} não foi encontrado.`);
    }

    const atualizado = {
      id: chamados[indice].id,
      ...dados,
      dataCriacao: chamados[indice].dataCriacao
    };

    chamados[indice] = atualizado;
    await salvarChamados(chamados);

    res.status(200).json(atualizado);
  } catch (err) {
    next(err);
  }
}

//atualiza apenas os campos enviados no corpo da requisição
export async function atualizarParcialChamado(req, res, next) {
  try {
    const id = validarId(req.params.id);
    const dados = validarPayloadChamado(req.body, { parcial: true });
    const chamados = await lerChamados();
    const indice = chamados.findIndex((c) => Number(c.id) === id);

    if (indice === -1) {
      throw criarErro(404, 'Recurso não encontrado', `Chamado com id ${id} não foi encontrado.`);
    }

    const atualizado = {
      ...chamados[indice],
      ...dados
    };

    chamados[indice] = atualizado;
    await salvarChamados(chamados);

    res.status(200).json(atualizado);
  } catch (err) {
    next(err);
  }
}

//remove um chamado pelo ID
export async function removerChamado(req, res, next) {
  try {
    const id = validarId(req.params.id);
    const chamados = await lerChamados();
    const indice = chamados.findIndex((c) => Number(c.id) === id);

    if (indice === -1) {
      throw criarErro(404, 'Recurso não encontrado', `Chamado com id ${id} não foi encontrado.`);
    }

    const [removido] = chamados.splice(indice, 1);
    await salvarChamados(chamados);

    res.status(200).json({
      mensagem: `Chamado #${id} removido com sucesso.`,
      chamado: removido
    });
  } catch (err) {
    next(err);
  }
}