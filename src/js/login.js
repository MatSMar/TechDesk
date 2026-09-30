document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.querySelector('form');
  const inputEmail = document.getElementById('email') || document.querySelector('input[type="email"]');
  const inputSenha = document.getElementById('senha') || document.querySelector('input[type="password"]');

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

  if (formLogin) {
    formLogin.addEventListener('submit', (event) => {
      let valido = true;

      // Validação do E-mail
      if (inputEmail) {
        const emailVal = inputEmail.value.trim();
        if (emailVal === '') {
          mostrarErro(inputEmail, 'O e-mail é obrigatório.');
          valido = false;
        } else if (!emailVal.includes('@') || !emailVal.includes('.')) {
          mostrarErro(inputEmail, 'Por favor, insira um e-mail válido.');
          valido = false;
        } else {
          removerErro(inputEmail);
        }
      }

      // Validação da Senha
      if (inputSenha) {
        if (inputSenha.value.trim() === '') {
          mostrarErro(inputSenha, 'A senha é obrigatória.');
          valido = false;
        } else {
          removerErro(inputSenha);
        }
      }

      // Se houver erros, impede o redirecionamento
      if (!valido) {
        event.preventDefault();
      }
    });

    // Limpa erros ao digitar
    [inputEmail, inputSenha].forEach((campo) => {
      if (campo) {
        campo.addEventListener('input', () => removerErro(campo));
      }
    });
  }
});