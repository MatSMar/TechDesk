import { buscarChamadoPorId } from './services/api.js';

document.addEventListener('DOMContentLoaded', async () => {
  const formComentario = document.querySelector('form.details-form') || document.querySelector('form');
  const textareaComentario = document.getElementById('comentario');
  const timeline = document.querySelector('.timeline');
  const selectStatus = document.getElementById('alterar-status');
  const badgeStatus = document.querySelector('.badge-status');

  const tituloEl = document.querySelector('.detalhes-header h2') || document.querySelector('h1');
  const descricaoEl = document.querySelector('.detalhes-descricao p');
  const categoriaEl = document.querySelector('.detalhes-meta span:nth-child(1)');
  const prioridadeEl = document.querySelector('.detalhes-meta span:nth-child(2)');

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
      if (categoriaEl && chamado.categoria) categoriaEl.innerText = `Categoria: ${chamado.categoria}`;
      if (prioridadeEl && chamado.prioridade) prioridadeEl.innerText = `Prioridade: ${chamado.prioridade}`;

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
    const s = status.toLowerCase();
    if (s.includes('aberto')) return 'aberto';
    if (s.includes('andamento')) return 'andamento';
    return 'concluido';
  }

  function formatarValorSelect(status) {
    const s = status.toLowerCase();
    if (s.includes('aberto')) return 'aberto';
    if (s.includes('andamento')) return 'andamento';
    return 'concluido';
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

  //atualização do status na interface
  if (selectStatus && badgeStatus) {
    selectStatus.addEventListener('change', () => {
      const novoStatus = selectStatus.value;
      
      badgeStatus.classList.remove('aberto', 'andamento', 'concluido');

      if (novoStatus === 'aberto') {
        badgeStatus.textContent = 'Aberto';
        badgeStatus.classList.add('aberto');
      } else if (novoStatus === 'andamento') {
        badgeStatus.textContent = 'Em Atendimento';
        badgeStatus.classList.add('andamento');
      } else if (novoStatus === 'concluido') {
        badgeStatus.textContent = 'Concluído';
        badgeStatus.classList.add('concluido');
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