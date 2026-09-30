document.addEventListener('DOMContentLoaded', () => {
  const formComentario = document.querySelector('form.details-form') || document.querySelector('form');
  const textareaComentario = document.getElementById('comentario');
  const timeline = document.querySelector('.timeline');
  const selectStatus = document.getElementById('alterar-status');
  const badgeStatus = document.querySelector('.badge-status');

  // Funções auxiliares para feedback visual de erro
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

  // 1. Atualização Dinâmica do Status na Interface
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

  // 2. Adição Dinâmica de Parecer Técnico com Validação
  if (formComentario && textareaComentario && timeline) {
    // Remove o erro assim que o usuário começa a digitar
    textareaComentario.addEventListener('input', () => removerErro(textareaComentario));

    formComentario.addEventListener('submit', (event) => {
      event.preventDefault();

      const textoComentario = textareaComentario.value.trim();

      // Validação de entrada inválida (campo vazio ou apenas espaços)
      if (textoComentario === '') {
        mostrarErro(textareaComentario, 'Por favor, digite um parecer técnico antes de enviar.');
        textareaComentario.focus();
        return;
      }

      // Se passou na validação, garante a remoção de mensagens de erro
      removerErro(textareaComentario);

      // Formatação de data e hora
      const agora = new Date();
      const horas = String(agora.getHours()).padStart(2, '0');
      const minutos = String(agora.getMinutes()).padStart(2, '0');
      const horaFormatada = `${horas}:${minutos}`;

      // Manipulação do DOM para criar o card do histórico
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

      // Limpa a caixa de texto
      textareaComentario.value = '';
    });
  }
});