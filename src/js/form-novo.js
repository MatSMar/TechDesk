import { criarChamado } from './services/api.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const inputTitulo = document.getElementById('titulo');
  const selectCategoria = document.getElementById('categoria');
  const selectPrioridade = document.getElementById('prioridade');
  const textareaDescricao = document.getElementById('descricao');

  //mapas para padronizar valores vindos do html
  const mapaCategorias = {
    hardware: 'Hardware',
    software: 'Software',
    rede: 'Rede',
    acesso: 'Acesso',
    outros: 'Outros',
    geral: 'Outros'
  };

  const mapaPrioridades = {
    baixa: 'Baixa',
    média: 'Média',
    media: 'Média',
    alta: 'Alta',
    crítica: 'Crítica',
    critica: 'Crítica'
  };

  //normaliza categoria para o padrão da api
  function normalizarCategoria(valor) {
    const chave = String(valor || '').trim().toLowerCase();
    return mapaCategorias[chave] || String(valor || '').trim();
  }

  //normaliza prioridade para o padrão da api
  function normalizarPrioridade(valor) {
    const chave = String(valor || '').trim().toLowerCase();
    return mapaPrioridades[chave] || String(valor || '').trim();
  }

  //funções exibir mensagem de erro abaixo do campo
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

  //remover mensagem de erro do campo
  function removerErro(campo) {
    campo.classList.remove('input-error');
    const spanExistente = campo.parentElement.querySelector('.error-message');
    if (spanExistente) {
      spanExistente.remove();
    }
  }

  //envio do formulário
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    let formValido = true;

    //validação do título
    const tituloVal = inputTitulo ? inputTitulo.value.trim() : '';
    if (tituloVal === '') {
      mostrarErro(inputTitulo, 'O título do chamado é obrigatório.');
      formValido = false;
    } else if (tituloVal.length < 5) {
      mostrarErro(inputTitulo, 'O título deve ter pelo menos 5 caracteres.');
      formValido = false;
    } else {
      removerErro(inputTitulo);
    }

    //validação da categoria
    if (selectCategoria && selectCategoria.value === '') {
      mostrarErro(selectCategoria, 'Por favor, selecione uma categoria.');
      formValido = false;
    } else {
      removerErro(selectCategoria);
    }

    //validação da descrição
    const descricaoVal = textareaDescricao ? textareaDescricao.value.trim() : '';
    if (descricaoVal === '') {
      mostrarErro(textareaDescricao, 'A descrição detalhada é obrigatória.');
      formValido = false;
    } else if (descricaoVal.length < 10) {
      mostrarErro(textareaDescricao, 'A descrição deve ter pelo menos 10 caracteres.');
      formValido = false;
    } else {
      removerErro(textareaDescricao);
    }

    //interrompe o envio se houver erros
    if (!formValido) return;

    //montagem do objeto do chamado
    const novoChamado = {
      titulo: tituloVal,
      categoria: selectCategoria ? normalizarCategoria(selectCategoria.value) : 'Outros', 
      prioridade: selectPrioridade ? normalizarPrioridade(selectPrioridade.value) : 'Média',
      status: 'Aberto',
      descricao: descricaoVal
    };

    //feedback visual de carregamento
    const botaoSubmit = form.querySelector('button[type="submit"]') || form.querySelector('.btn-submit');
    const textoOriginal = botaoSubmit ? botaoSubmit.innerText : 'Salvar';

    if (botaoSubmit) {
      botaoSubmit.disabled = true;
      botaoSubmit.innerText = 'Salvando no servidor...';
    }

    //post para o servidor
    const resultado = await criarChamado(novoChamado);

    if (resultado.sucesso) {
      alert('Chamado cadastrado com sucesso!');
      window.location.href = 'dashboard.html';
    } else {
      alert(`Erro ao salvar no servidor: ${resultado.mensagem}`);
      if (botaoSubmit) {
        botaoSubmit.disabled = false;
        botaoSubmit.innerText = textoOriginal;
      }
    }
  });

  //limpa mensagens de erro conforme o usuário digita ou altera os campos
  [inputTitulo, selectCategoria, selectPrioridade, textareaDescricao].forEach((campo) => {
    if (campo) {
      campo.addEventListener('input', () => removerErro(campo));
      campo.addEventListener('change', () => removerErro(campo));
    }
  });
});