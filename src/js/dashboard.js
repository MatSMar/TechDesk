document.addEventListener('DOMContentLoaded', () => {
  const inputBusca = document.getElementById('busca');
  const selectVisao = document.getElementById('filtro-visao');
  const tabela = document.querySelector('.tickets-table');

  if (!tabela) return;

  const tbody = tabela.querySelector('tbody');
  const linhas = tbody.querySelectorAll('tr');

  // Criação da mensagem de registro não encontrado
  const linhaVazia = document.createElement('tr');
  linhaVazia.id = 'no-results-row';
  linhaVazia.style.display = 'none';
  linhaVazia.innerHTML = `
    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--color-text-muted);">
      Nenhum chamado encontrado para os filtros aplicados.
    </td>
  `;
  tbody.appendChild(linhaVazia);

  // Função principal de filtragem
  function filtrarTabela() {
    const termoBusca = inputBusca ? inputBusca.value.toLowerCase().trim() : '';
    const statusFiltro = selectVisao ? selectVisao.value.toLowerCase().trim() : '';

    let visiveisCount = 0;
    
    linhas.forEach((linha) => {
        
      // Ignora a linha de mensagem vazia   
      if (linha.id === 'no-results-row') return;

      const textoLinha = linha.textContent.toLowerCase();

      // Captura a coluna do status (assumindo que a classe ou badge de status está na linha)
      const badgeStatus = linha.querySelector('.badge-status');
      const textoStatus = badgeStatus ? badgeStatus.textContent.toLowerCase().trim() : '';

      // Regras de correspondência
      const bateComBusca = termoBusca === '' || textoLinha.includes(termoBusca);
      const bateComStatus = statusFiltro === '' || statusFiltro === 'todos' || textoStatus.includes(statusFiltro);

      if (bateComBusca && bateComStatus) {
        // Exibe a linha
        linha.style.display = '';
        visiveisCount++;
      } else {
        // Oculta a linha
        linha.style.display = 'none';
      }
    });

    // Exibe a mensagem de "Nenhum resultado" se nenhuma linha estiver visível
    linhaVazia.style.display = visiveisCount === 0 ? '' : 'none';
  }

  // Eventos para acionar a filtragem em tempo real
  if (inputBusca) {
    inputBusca.addEventListener('input', filtrarTabela);
  }

  if (selectVisao) {
    selectVisao.addEventListener('change', filtrarTabela);
  }
});