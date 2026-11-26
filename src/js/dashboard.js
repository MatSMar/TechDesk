import { buscarChamados } from './services/api.js';

const STORAGE_USUARIO_KEY = 'techdesk_usuario';

function obterUsuarioLogado() {
  try {
    const bruto = localStorage.getItem(STORAGE_USUARIO_KEY);
    return bruto ? JSON.parse(bruto) : null;
  } catch {
    return null;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const usuario = obterUsuarioLogado();
  if (!usuario || !usuario.id) {
    window.location.href = 'index.html';
    return;
  }

  const ehTecnico = usuario.perfil === 'tecnico';
  const colspanTabela = ehTecnico ? 7 : 6;

  const infoUsuarioEl = document.getElementById('info-usuario-logado');
  const tituloVisaoEl = document.getElementById('titulo-visao-chamados');
  const thSolicitanteEl = document.getElementById('th-solicitante');
  const btnSair = document.getElementById('btn-sair');

  const tbodyTabela = document.querySelector('tbody');
  const inputBusca = document.getElementById('busca');
  const selectVisao = document.getElementById('filtro-visao');
  const valoresEstatisticas = document.querySelectorAll('.stats-grid .stat-value');

  if (infoUsuarioEl) {
    const rotuloPerfil = ehTecnico ? 'Técnico' : 'Funcionário';
    infoUsuarioEl.textContent = `${usuario.nome} (${rotuloPerfil})`;
  }

  if (tituloVisaoEl) {
    tituloVisaoEl.textContent = ehTecnico
      ? 'Visão Geral de Chamados (Fila Completa)'
      : 'Meus Chamados Solicitados';
  }

  // Para funcionário, oculta a coluna Solicitante já que todos os chamados exibidos são dele
  if (!ehTecnico && thSolicitanteEl) {
    thSolicitanteEl.style.display = 'none';
  }

  if (btnSair) {
    btnSair.addEventListener('click', (event) => {
      event.preventDefault();
      localStorage.removeItem(STORAGE_USUARIO_KEY);
      window.location.href = 'index.html';
    });
  }

  let listaChamadosGlobal = [];

  function atualizarEstatisticas(chamados) {
    if (valoresEstatisticas.length < 4) return;

    const total = chamados.length;
    const abertos = chamados.filter((c) => String(c.status || '').toLowerCase().includes('aberto')).length;
    const emAtendimento = chamados.filter((c) => {
      const s = String(c.status || '').toLowerCase();
      return s.includes('atendimento') || s.includes('andamento');
    }).length;
    const resolvidos = chamados.filter((c) => {
      const s = String(c.status || '').toLowerCase();
      return s.includes('resolvido') || s.includes('concluido') || s.includes('fechado');
    }).length;

    valoresEstatisticas[0].textContent = total;
    valoresEstatisticas[1].textContent = abertos;
    valoresEstatisticas[2].textContent = emAtendimento;
    valoresEstatisticas[3].textContent = resolvidos;
  }

  function formatarClasseStatus(status) {
    const s = String(status || '').toLowerCase();
    if (s.includes('aberto')) return 'aberto';
    if (s.includes('atendimento') || s.includes('andamento')) return 'andamento';
    return 'concluido';
  }

  function renderizarTabela(chamados) {
    if (!tbodyTabela) return;

    tbodyTabela.innerHTML = '';

    if (chamados.length === 0) {
      tbodyTabela.innerHTML = `
        <tr id="no-results-row">
          <td colspan="${colspanTabela}" style="text-align: center; padding: 2rem; color: var(--color-text-muted, #666);">
            Nenhum chamado encontrado para os filtros aplicados.
          </td>
        </tr>
      `;
      return;
    }

    chamados.forEach((chamado) => {
      const tr = document.createElement('tr');
      const colunaSolicitante = ehTecnico
        ? `<td>${chamado.solicitante_nome || '—'}</td>`
        : '';

      tr.innerHTML = `
        <td>#${chamado.id}</td>
        <td><strong>${chamado.titulo}</strong></td>
        ${colunaSolicitante}
        <td>${chamado.categoria}</td>
        <td>${chamado.prioridade}</td>
        <td><span class="badge-status ${formatarClasseStatus(chamado.status)}">${chamado.status}</span></td>
        <td>
          <a href="detalhes_chamado.html?id=${chamado.id}" class="ticket-link">Ver Detalhes</a>
        </td>
      `;
      tbodyTabela.appendChild(tr);
    });
  }

  function filtrarTabela() {
    const termoBusca = inputBusca ? inputBusca.value.toLowerCase().trim() : '';
    const statusFiltro = selectVisao ? selectVisao.value.toLowerCase().trim() : '';

    const chamadosFiltrados = listaChamadosGlobal.filter((chamado) => {
      const solicitanteTexto = chamado.solicitante_nome || '';
      const textoCompleto = `${chamado.id} ${chamado.titulo} ${solicitanteTexto} ${chamado.categoria} ${chamado.status}`.toLowerCase();

      const bateComBusca = termoBusca === '' || textoCompleto.includes(termoBusca);
      const bateComStatus =
        statusFiltro === '' ||
        statusFiltro === 'todos' ||
        String(chamado.status || '').toLowerCase().includes(statusFiltro);

      return bateComBusca && bateComStatus;
    });

    renderizarTabela(chamadosFiltrados);
  }

  async function carregarDadosDaAPI() {
    if (!tbodyTabela) return;

    tbodyTabela.innerHTML = `
      <tr>
        <td colspan="${colspanTabela}" style="text-align: center; padding: 2rem; color: #555;">
          Carregando chamados do servidor...
        </td>
      </tr>
    `;

    const resultado = await buscarChamados({
      usuarioId: usuario.id,
      perfil: usuario.perfil
    });

    if (resultado.sucesso) {
      listaChamadosGlobal = resultado.dados;
      atualizarEstatisticas(listaChamadosGlobal);
      renderizarTabela(listaChamadosGlobal);
    } else {
      tbodyTabela.innerHTML = `
        <tr>
          <td colspan="${colspanTabela}" style="text-align: center; padding: 2rem; color: #d32f2f;">
            <strong>Erro de Comunicação:</strong> ${resultado.mensagem}
          </td>
        </tr>
      `;
    }
  }

  if (inputBusca) {
    inputBusca.addEventListener('input', filtrarTabela);
  }
  if (selectVisao) {
    selectVisao.addEventListener('change', filtrarTabela);
  }

  await carregarDadosDaAPI();
});