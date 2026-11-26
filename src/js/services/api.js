const API_BASE_URL = 'http://localhost:3001';
const CHAMADOS_URL = `${API_BASE_URL}/chamados`;

// Busca chamados (suporta filtros e escopo por perfil/usuário)
export async function buscarChamados(filtros = {}) {
  try {
    const params = new URLSearchParams();
    if (filtros.status) params.set('status', filtros.status);
    if (filtros.prioridade) params.set('prioridade', filtros.prioridade);
    if (filtros.categoria) params.set('categoria', filtros.categoria);
    if (filtros.busca) params.set('busca', filtros.busca);
    if (filtros.usuarioId) params.set('usuarioId', filtros.usuarioId);
    if (filtros.perfil) params.set('perfil', filtros.perfil);

    const url = params.toString() ? `${CHAMADOS_URL}?${params.toString()}` : CHAMADOS_URL;
    const resposta = await fetch(url);

    if (!resposta.ok) {
      throw new Error(`Erro ao buscar dados (${resposta.status})`);
    }

    const dados = await resposta.json();
    return { sucesso: true, dados };
  } catch (error) {
    console.error('Erro na requisição GET /chamados:', error);
    return { sucesso: false, mensagem: 'Não foi possível carregar os chamados do servidor.' };
  }
}

// Cria um novo chamado no backend
export async function criarChamado(novoChamado) {
  try {
    const resposta = await fetch(CHAMADOS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoChamado)
    });

    const corpo = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
      const detalhe = Array.isArray(corpo.detalhes) ? corpo.detalhes.join(' ') : corpo.mensagem;
      throw new Error(detalhe || `Erro ao salvar (${resposta.status})`);
    }

    return { sucesso: true, dados: corpo };
  } catch (error) {
    console.error('Erro na requisição POST /chamados:', error);
    return { sucesso: false, mensagem: error.message || 'Não foi possível salvar o chamado.' };
  }
}

// Busca um chamado específico pelo ID (já inclui interações quando retornado pelo backend)
export async function buscarChamadoPorId(id) {
  try {
    const resposta = await fetch(`${CHAMADOS_URL}/${id}`);
    const corpo = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
      throw new Error(corpo.mensagem || `Erro ao buscar o chamado #${id}`);
    }

    return { sucesso: true, dados: corpo };
  } catch (error) {
    console.error('Erro na requisição GET /chamados/:id:', error);
    return { sucesso: false, mensagem: error.message || 'Não foi possível carregar os detalhes.' };
  }
}

// Atualiza parcialmente um chamado
export async function atualizarChamado(id, dadosAtualizados) {
  try {
    const resposta = await fetch(`${CHAMADOS_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosAtualizados)
    });

    const corpo = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
      const detalhe = Array.isArray(corpo.detalhes) ? corpo.detalhes.join(' ') : corpo.mensagem;
      throw new Error(detalhe || `Erro ao atualizar (${resposta.status})`);
    }

    return { sucesso: true, dados: corpo };
  } catch (error) {
    console.error('Erro na requisição PATCH /chamados/:id:', error);
    return { sucesso: false, mensagem: error.message || 'Não foi possível atualizar o chamado.' };
  }
}

// Lista interações / mensagens de um chamado
export async function buscarInteracoesChamado(chamadoId) {
  try {
    const resposta = await fetch(`${CHAMADOS_URL}/${chamadoId}/interacoes`);
    const corpo = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
      throw new Error(corpo.mensagem || 'Erro ao carregar o histórico de interações.');
    }

    return { sucesso: true, dados: corpo };
  } catch (error) {
    console.error('Erro na requisição GET /chamados/:id/interacoes:', error);
    return { sucesso: false, mensagem: error.message || 'Não foi possível carregar as interações.' };
  }
}

// Cria uma nova mensagem/interação em um chamado
export async function criarInteracaoChamado(chamadoId, { mensagem, autorId }) {
  try {
    const resposta = await fetch(`${CHAMADOS_URL}/${chamadoId}/interacoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensagem, autorId })
    });

    const corpo = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
      const detalhe = Array.isArray(corpo.detalhes) ? corpo.detalhes.join(' ') : corpo.mensagem;
      throw new Error(detalhe || `Erro ao enviar mensagem (${resposta.status})`);
    }

    return { sucesso: true, dados: corpo };
  } catch (error) {
    console.error('Erro na requisição POST /chamados/:id/interacoes:', error);
    return { sucesso: false, mensagem: error.message || 'Não foi possível enviar a mensagem.' };
  }
}

// Autentica usuário no backend
export async function autenticarUsuario(email, senha) {
  try {
    const resposta = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const corpo = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
      throw new Error(corpo.mensagem || 'Credenciais inválidas.');
    }

    return { sucesso: true, dados: corpo };
  } catch (error) {
    console.error('Erro na requisição POST /auth/login:', error);
    return { sucesso: false, mensagem: error.message || 'Falha ao conectar ao servidor de login.' };
  }
}