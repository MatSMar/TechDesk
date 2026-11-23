import { buscarChamadoPorId, atualizarChamado } from './services/api.js';

document.addEventListener('DOMContentLoaded', async () => {
  const formComentario = document.querySelector('form.details-form') || document.querySelector('form');
  const textareaComentario = document.getElementById('comentario');
  const timeline = document.querySelector('.timeline');
  const selectStatus = document.getElementById('alterar-status');
  const badgeStatus = document.querySelector('.badge-status');

  const tituloEl = document.querySelector('.form-header h2') || document.querySelector('.detalhes-header h2') || document.querySelector('h1');
  const descricaoEl = document.getElementById('detalhe-descricao') || document.querySelector('.detalhes-descricao p');
  const categoriaEl = document.getElementById('detalhe-categoria') || document.querySelector('.detalhes-meta span:nth-child(1)');
  const prioridadeEl = document.getElementById('detalhe-prioridade') || document.querySelector('.detalhes-meta span:nth-child(2)');

  //pega o id da url e carrega os dados servidor
  const urlParams = new URLSearchParams(window.location.search);
  const chamadoId = urlParams.get('id');

  if (chamadoId) {
    //estado login
    if (tituloEl) tituloEl.innerText = 'Carregando detalhes do chamado...';

    const resultado = await buscarChamadoPorId(chamadoId);

    if (resultado.sucesso) {
      //estado sucesso: preenche a tela com os dados vindos do servidor
      const chamado = resultado.dados;

      if (tituloEl) tituloEl.innerText = `#${chamado.id} — ${chamado.titulo}`;
      if (descricaoEl) descricaoEl.innerText = chamado.descricao;
      if (categoriaEl && chamado.categoria) categoriaEl.innerText = chamado.categoria;
      if (prioridadeEl && chamado.prioridade) prioridadeEl.innerText = chamado.prioridade;

      if (badgeStatus) {
        badgeStatus.innerText = chamado.status;
        badgeStatus.className = `badge-status ${formatarClasseStatus(chamado.status)}`;
      }

      if (selectStatus) {
        selectStatus.value = formatarValorSelect(chamado.status);
      }
    } else {
      //estado erro
      if (tituloEl) tituloEl.innerText = 'Erro ao carregar o chamado';
      if (descricaoEl) descricaoEl.innerText = resultado.mensagem;
    }
  }

  //auxiliares para o status visual
  function formatarClasseStatus(status) {
    const s = String(status || '').toLowerCase();
    if (s.includes('aberto')) return 'aberto';
    if (s.includes('andamento') || s.includes('atendimento')) return 'andamento'; 
    return 'concluido';
  }

  function formatarValorSelect(status) {
    const s = String(status || '').toLowerCase();
    if (s.includes('aberto')) return 'aberto';
    if (s.includes('andamento') || s.includes('atendimento')) return 'andamento';
    return 'concluido';
  }

  //converte valor do select para o status esperado pela api
  function mapearStatusApi(valorSelect) {
    if (valorSelect === 'aberto') return 'Aberto';
    if (valorSelect === 'andamento') return 'Em Atendimento';
    return 'Resolvido';
  }

  //funções feedback visual de erro no formulário
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

  //atualização do status na interface e na api
  if (selectStatus && badgeStatus) {
    selectStatus.addEventListener('change', async () => {
      const novoStatusSelect = selectStatus.value;
      const statusApi = mapearStatusApi(novoStatusSelect);

      badgeStatus.classList.remove('aberto', 'andamento', 'concluido');
      badgeStatus.textContent = statusApi;
      badgeStatus.classList.add(formatarClasseStatus(statusApi));

      if (!chamadoId) return;

      const resultado = await atualizarChamado(chamadoId, { status: statusApi });
      if (!resultado.sucesso) {
        mostrarErro(selectStatus, resultado.mensagem || 'Não foi possível atualizar o status.');
      } else {
        removerErro(selectStatus);
      }
    });
  }

  //adição dinâmica de parecer técnico com validação
  if (formComentario && textareaComentario && timeline) {
    textareaComentario.addEventListener('input', () => removerErro(textareaComentario));

    formComentario.addEventListener('submit', (event) => {
      event.preventDefault();

      const textoComentario = textareaComentario.value.trim();

      if (textoComentario === '') {
        mostrarErro(textareaComentario, 'Por favor, digite um parecer técnico antes de enviar.');
        textareaComentario.focus();
        return;
      }

      removerErro(textareaComentario);

      const agora = new Date();
      const horas = String(agora.getHours()).padStart(2, '0');
      const minutos = String(agora.getMinutes()).padStart(2, '0');
      const horaFormatada = `${horas}:${minutos}`;

      const novoItemTimeline = document.createElement('article');
      novoItemTimeline.className = 'timeline-item';
      novoItemTimeline.innerHTML = `
        <div class="timeline-meta">
          <strong>Técnico de TI (Você)</strong>
          <span>Hoje às ${horaFormatada}</span>
        </div>
        <p>${textoComentario}</p>
      `;

      timeline.appendChild(novoItemTimeline);
      textareaComentario.value = '';
    });
  }
});