import {
  buscarChamadoPorId,
  atualizarChamado,
  criarInteracaoChamado
} from './services/api.js';

const STORAGE_USUARIO_KEY = 'techdesk_usuario';

function obterUsuarioLogado() {
  try {
    const bruto = localStorage.getItem(STORAGE_USUARIO_KEY);
    return bruto ? JSON.parse(bruto) : null;
  } catch {
    return null;
  }
}

function formatarDataHora(isoOuData) {
  if (!isoOuData) return '—';
  const data = new Date(isoOuData);
  if (Number.isNaN(data.getTime())) return String(isoOuData);
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function escaparHtml(texto) {
  return String(texto || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

document.addEventListener('DOMContentLoaded', async () => {
  const usuario = obterUsuarioLogado();
  if (!usuario || !usuario.id) {
    window.location.href = 'index.html';
    return;
  }

  const ehTecnico = usuario.perfil === 'tecnico';

  const infoUsuarioEl = document.getElementById('info-usuario-logado');
  const btnSair = document.getElementById('btn-sair');

  if (infoUsuarioEl) {
    infoUsuarioEl.textContent = `${usuario.nome} (${ehTecnico ? 'Técnico' : 'Funcionário'})`;
  }

  if (btnSair) {
    btnSair.addEventListener('click', (event) => {
      event.preventDefault();
      localStorage.removeItem(STORAGE_USUARIO_KEY);
      window.location.href = 'index.html';
    });
  }

  const formComentario = document.querySelector('form.details-form') || document.querySelector('form');
  const textareaComentario = document.getElementById('comentario');
  const listaInteracoesEl = document.getElementById('lista-interacoes') || document.querySelector('.timeline');
  const boxAlterarStatus = document.getElementById('box-alterar-status');
  const selectStatus = document.getElementById('alterar-status');
  const badgeStatus = document.querySelector('.badge-status');

  const tituloEl = document.querySelector('.form-header h2') || document.querySelector('h1');
  const descricaoEl = document.getElementById('detalhe-descricao');
  const categoriaEl = document.getElementById('detalhe-categoria');
  const prioridadeEl = document.getElementById('detalhe-prioridade');
  const solicitanteEl = document.getElementById('detalhe-solicitante');
  const dataEl = document.getElementById('detalhe-data');

  // Exibe controle de status apenas para técnico
  if (boxAlterarStatus) {
    boxAlterarStatus.style.display = ehTecnico ? 'flex' : 'none';
  }
  if (selectStatus) {
    selectStatus.disabled = !ehTecnico;
  }

  function formatarClasseStatus(status) {
    const s = String(status || '').toLowerCase();
    if (s.includes('aberto')) return 'aberto';
    if (s.includes('atendimento') || s.includes('andamento') || s.includes('aguardando')) return 'andamento';
    return 'concluido';
  }

  function mostrarErro(campo, mensagem) {
    removerErro(campo);
    campo.classList.add('input-error');

    const spanErro = document.createElement('span');
    spanErro.className = 'error-message';
    spanErro.style.color = '#d32f2f';
    spanErro.style.fontSize = '0.8rem';
    spanErro.style.marginTop = '0.25rem';
    spanErro.style.display = 'block';
    spanErro.innerText = mensagem;

    campo.parentElement.appendChild(spanErro);
  }

  function removerErro(campo) {
    campo.classList.remove('input-error');
    const spanExistente = campo.parentElement.querySelector('.error-message');
    if (spanExistente) {
      spanExistente.remove();
    }
  }

  function criarElementoInteracao(interacao) {
    const autorNome = escaparHtml(interacao.autor_nome || 'Usuário');
    const rotuloPapel = interacao.autor_perfil === 'tecnico' ? 'Técnico de TI' : 'Solicitante';
    const dataFormatada = escaparHtml(formatarDataHora(interacao.criado_em));
    const mensagemSegura = escaparHtml(interacao.mensagem);

    const article = document.createElement('article');
    article.className = 'timeline-item';
    if (interacao.autor_perfil === 'tecnico') {
      article.style.borderLeftColor = 'var(--color-primary)';
    }

    article.innerHTML = `
      <div class="timeline-meta">
        <strong>${autorNome} (${rotuloPapel})</strong>
        <span>${dataFormatada}</span>
      </div>
      <p>${mensagemSegura}</p>
    `;
    return article;
  }

  function renderizarInteracoes(interacoes = []) {
    if (!listaInteracoesEl) return;
    listaInteracoesEl.innerHTML = '';

    if (!Array.isArray(interacoes) || interacoes.length === 0) {
      listaInteracoesEl.innerHTML = `
        <p style="font-size: 0.9rem; color: var(--color-text-muted);">
          Nenhuma mensagem registrada neste chamado ainda.
        </p>
      `;
      return;
    }

    interacoes.forEach((item) => {
      listaInteracoesEl.appendChild(criarElementoInteracao(item));
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const chamadoId = urlParams.get('id');

  if (!chamadoId) {
    if (tituloEl) tituloEl.innerText = 'Chamado não informado';
    if (descricaoEl) descricaoEl.innerText = 'Volte à Dashboard e selecione um chamado para visualizar os detalhes.';
    return;
  }

  if (tituloEl) tituloEl.innerText = 'Carregando detalhes do chamado...';
  const resultado = await buscarChamadoPorId(chamadoId);

  if (!resultado.sucesso) {
    if (tituloEl) tituloEl.innerText = 'Erro ao carregar o chamado';
    if (descricaoEl) descricaoEl.innerText = resultado.mensagem;
    return;
  }

  const chamado = resultado.dados;

  // Bloqueia acesso direto pela URL se for funcionário tentando abrir chamado de outro usuário
  if (!ehTecnico && Number(chamado.solicitante_id) !== Number(usuario.id)) {
    alert('Você só pode visualizar os chamados abertos por você.');
    window.location.href = 'dashboard.html';
    return;
  }

  document.title = `TechDesk - Chamado #${chamado.id}`;
  if (tituloEl) tituloEl.innerText = `#${chamado.id} — ${chamado.titulo}`;
  if (descricaoEl) descricaoEl.innerText = chamado.descricao;
  if (categoriaEl && chamado.categoria) categoriaEl.innerText = chamado.categoria;
  if (prioridadeEl && chamado.prioridade) prioridadeEl.innerText = chamado.prioridade;
  if (solicitanteEl) solicitanteEl.innerText = chamado.solicitante_nome || '—';
  if (dataEl) dataEl.innerText = formatarDataHora(chamado.criado_em);

  if (badgeStatus) {
    badgeStatus.innerText = chamado.status;
    badgeStatus.className = `badge-status ${formatarClasseStatus(chamado.status)}`;
  }

  if (selectStatus) {
    selectStatus.value = chamado.status;
  }

  renderizarInteracoes(chamado.interacoes);

  // Atualização de status exclusiva do técnico
  if (ehTecnico && selectStatus && badgeStatus) {
    selectStatus.addEventListener('change', async () => {
      const novoStatus = selectStatus.value;
      const statusAnterior = badgeStatus.textContent;

      badgeStatus.className = `badge-status ${formatarClasseStatus(novoStatus)}`;
      badgeStatus.textContent = novoStatus;

      const payloadStatus = { status: novoStatus };
      if (!chamado.tecnico_id) {
        payloadStatus.tecnicoId = usuario.id;
      }

      const respStatus = await atualizarChamado(chamadoId, payloadStatus);
      if (!respStatus.sucesso) {
        badgeStatus.className = `badge-status ${formatarClasseStatus(statusAnterior)}`;
        badgeStatus.textContent = statusAnterior;
        mostrarErro(selectStatus, respStatus.mensagem || 'Não foi possível atualizar o status.');
      } else {
        removerErro(selectStatus);
        if (respStatus.dados?.tecnico_id) {
          chamado.tecnico_id = respStatus.dados.tecnico_id;
        }
      }
    });
  }

  // Envio de mensagem / parecer (disponível para técnico e solicitante do chamado)
  if (formComentario && textareaComentario && listaInteracoesEl) {
    textareaComentario.addEventListener('input', () => removerErro(textareaComentario));

    formComentario.addEventListener('submit', async (event) => {
      event.preventDefault();

      const textoMensagem = textareaComentario.value.trim();
      if (textoMensagem === '') {
        mostrarErro(textareaComentario, 'Por favor, escreva uma mensagem antes de enviar.');
        textareaComentario.focus();
        return;
      }

      removerErro(textareaComentario);

      const botaoEnviar = formComentario.querySelector('button[type="submit"]');
      const textoBotaoOriginal = botaoEnviar ? botaoEnviar.innerText : 'Enviar Mensagem';

      if (botaoEnviar) {
        botaoEnviar.disabled = true;
        botaoEnviar.innerText = 'Enviando...';
      }

      const respInteracao = await criarInteracaoChamado(chamadoId, {
        mensagem: textoMensagem,
        autorId: usuario.id
      });

      if (respInteracao.sucesso) {
        // Se havia mensagem de "nenhuma mensagem", limpa antes de anexar
        const vazioMsg = listaInteracoesEl.querySelector('p');
        if (vazioMsg && listaInteracoesEl.children.length === 1 && !vazioMsg.closest('.timeline-item')) {
          listaInteracoesEl.innerHTML = '';
        }

        listaInteracoesEl.appendChild(criarElementoInteracao(respInteracao.dados));
        textareaComentario.value = '';
      } else {
        mostrarErro(textareaComentario, respInteracao.mensagem || 'Não foi possível enviar a mensagem.');
      }

      if (botaoEnviar) {
        botaoEnviar.disabled = false;
        botaoEnviar.innerText = textoBotaoOriginal;
      }
    });
  }
});