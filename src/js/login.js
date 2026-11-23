import { autenticarUsuario } from './services/api.js';

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
    formLogin.addEventListener('submit', async (event) => { 
      event.preventDefault(); 

      let valido = true;
      const emailVal = inputEmail ? inputEmail.value.trim() : '';
      const senhaVal = inputSenha ? inputSenha.value.trim() : '';

      //validação do email
      if (inputEmail) {
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

      //validação da senha
      if (inputSenha) {
        if (senhaVal === '') {
          mostrarErro(inputSenha, 'A senha é obrigatória.');
          valido = false;
        } else {
          removerErro(inputSenha);
        }
      }

      if (!valido) return;

      const botaoSubmit = formLogin.querySelector('button[type="submit"]') || formLogin.querySelector('.btn-submit');
      const textoOriginal = botaoSubmit ? botaoSubmit.innerText : 'Entrar';

      if (botaoSubmit) {
        botaoSubmit.disabled = true;
        botaoSubmit.innerText = 'Entrando...';
      }
      //valida credenciais no servidor
      const resultado = await autenticarUsuario(emailVal, senhaVal); 

      if (resultado.sucesso) {
        //guarda sessão simples do usuário
        localStorage.setItem('techdesk_usuario', JSON.stringify(resultado.dados.usuario)); 
        window.location.href = 'dashboard.html';
      } else {
        if (inputSenha) {
          //exibe erro retornado pela API
          mostrarErro(inputSenha, resultado.mensagem || 'E-mail ou senha inválidos.'); 
        }
        if (botaoSubmit) {
          botaoSubmit.disabled = false;
          botaoSubmit.innerText = textoOriginal;
        }
      }
    });

    //limpa erros ao digitar
    [inputEmail, inputSenha].forEach((campo) => {
      if (campo) {
        campo.addEventListener('input', () => removerErro(campo));
      }
    });
  }
});