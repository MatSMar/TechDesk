document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const inputTitulo = document.getElementById('titulo');
  const selectCategoria = document.getElementById('categoria');
  const selectPrioridade = document.getElementById('prioridade');
  const textareaDescricao = document.getElementById('descricao');

  // Função auxiliar para exibir mensagem de erro abaixo do campo
  function mostrarErro(campo, mensagem) {
    // Limpa erro anterior se existir
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

  // Função auxiliar para remover mensagem de erro do campo
  function removerErro(campo) {
    campo.classList.remove('input-error');
    const spanExistente = campo.parentElement.querySelector('.error-message');
    if (spanExistente) {
      spanExistente.remove();
    }
  }

  // Evento de envio do formulário
  form.addEventListener('submit', (event) => {
    // Impede o envio padrão
    event.preventDefault(); 

    let formValido = true;

    // 1. Validação do Título
    const tituloVal = inputTitulo.value.trim();
    if (tituloVal === '') {
      mostrarErro(inputTitulo, 'O título do chamado é obrigatório.');
      formValido = false;
    } else if (tituloVal.length < 5) {
      mostrarErro(inputTitulo, 'O título deve ter pelo menos 5 caracteres.');
      formValido = false;
    } else {
      removerErro(inputTitulo);
    }

    // 2. Validação da Categoria
    if (selectCategoria.value === '') {
      mostrarErro(selectCategoria, 'Por favor, selecione uma categoria.');
      formValido = false;
    } else {
      removerErro(selectCategoria);
    }

    // 3. Validação da Descrição
    const descricaoVal = textareaDescricao.value.trim();
    if (descricaoVal === '') {
      mostrarErro(textareaDescricao, 'A descrição detalhada é obrigatória.');
      formValido = false;
    } else if (descricaoVal.length < 10) {
      mostrarErro(textareaDescricao, 'A descrição deve ter pelo menos 10 caracteres.');
      formValido = false;
    } else {
      removerErro(textareaDescricao);
    }

    // Se todos os campos forem válidos
    if (formValido) {
      // Criação de objeto com os dados (demonstração de estrutura de dados)
      const novoChamado = {
        titulo: tituloVal,
        categoria: selectCategoria.value,
        prioridade: selectPrioridade.value,
        descricao: descricaoVal,
        dataCriacao: new Date().toISOString()
      };

      console.log('Novo chamado criado:', novoChamado);

      // Feedback dinâmico ao usuário
      alert('Chamado cadastrado com sucesso!');
      window.location.href = 'dashboard.html';
    }
  });

  // Limpa mensagens de erro conforme o usuário digita nos campos
  [inputTitulo, selectCategoria, textareaDescricao].forEach((campo) => {
    campo.addEventListener('input', () => removerErro(campo));
  });
});