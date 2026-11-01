import { buscarChamados } from './services/api.js';

document.addEventListener('DOMContentLoaded', async () => {
  const tbodyTabela = document.querySelector('tbody');
  const inputBusca = document.getElementById('busca');
  const selectVisao = document.getElementById('filtro-visao');

  let listaChamadosGlobal = [];

  //carrega os chamados na tabela e trata busca vazia
  function renderizarTabela(chamados) {
    if (!tbodyTabela) return;

    tbodyTabela.innerHTML = '';

    if (chamados.length === 0) {
      tbodyTabela.innerHTML = `
        <tr id="no-results-row">
          <td colspan="6" style="text-align: center; padding: 2rem; color: var(--color-text-muted, #666);">
            Nenhum chamado encontrado para os filtros aplicados.
          </td>
        </tr>
      `;
      return;
    }

    chamados.forEach((chamado) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>#${chamado.id}</td>
        <td><strong>${chamado.titulo}</strong></td>
        <td>${chamado.categoria}</td>
        <td>${chamado.prioridade}</td>
        <td><span class="badge-status ${formatarClasseStatus(chamado.status)}">${chamado.status}</span></td>
        <td>
          <a href="detalhes_chamado.html?id=${chamado.id}" class="btn-detalhes">Ver Detalhes</a>
        </td>
      `;
      tbodyTabela.appendChild(tr);
    });
  }

  //muda o badge conforme o status
  function formatarClasseStatus(status) {
    const s = status.toLowerCase();
    if (s.includes('aberto')) return 'aberto';
    if (s.includes('andamento')) return 'andamento';
    return 'concluido';
  }

  //função de filtro combinada - busca por texto + status
  function filtrarTabela() {
    const termoBusca = inputBusca ? inputBusca.value.toLowerCase().trim() : '';
    const statusFiltro = selectVisao ? selectVisao.value.toLowerCase().trim() : '';

    const chamadosFiltrados = listaChamadosGlobal.filter((chamado) => {
      //texto da linha engloba ID, título, categoria e status
      const textoCompleto = `${chamado.id} ${chamado.titulo} ${chamado.categoria} ${chamado.status}`.toLowerCase();

      const bateComBusca = termoBusca === '' || textoCompleto.includes(termoBusca);
      const bateComStatus = statusFiltro === '' || statusFiltro === 'todos' || chamado.status.toLowerCase().includes(statusFiltro);

      return bateComBusca && bateComStatus;
    });

    renderizarTabela(chamadosFiltrados);
  }

  //carregar dados do servidor
  async function carregarDadosDaAPI() {
    if (!tbodyTabela) return;

    //estado logiin
    tbodyTabela.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2rem; color: #555;">
          Carregando chamados do servidor...
        </td>
      </tr>
    `;

    const resultado = await buscarChamados();

    if (resultado.sucesso) {
      //estado sucesso
      listaChamadosGlobal = resultado.dados;
      renderizarTabela(listaChamadosGlobal);
    } else {
      //estado erro
      tbodyTabela.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 2rem; color: #d32f2f;">
            <strong>Erro de Comunicação:</strong> ${resultado.mensagem}
          </td>
        </tr>
      `;
    }
  }

  //listeners para os filtros
  if (inputBusca) {
    inputBusca.addEventListener('input', filtrarTabela);
  }
  if (selectVisao) {
    selectVisao.addEventListener('change', filtrarTabela);
  }

  //carregamento inicial ao abrir a página
  await carregarDadosDaAPI();
});