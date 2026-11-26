import { autenticarUsuario } from './services/api.js';

const STORAGE_EMAIL_KEY = 'techdesk_email_lembrado';
const STORAGE_USUARIO_KEY = 'techdesk_usuario';

document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.querySelector('form');
  const inputEmail = document.getElementById('email') || document.querySelector('input[type="email"]');
  const inputSenha = document.getElementById('senha') || document.querySelector('input[type="password"]');
  const checkboxLembrar = document.getElementById('lembrar') || document.querySelector('input[name="lembrar"]');
  const linkEsqueceuSenha = document.getElementById('esqueceu-senha');
  const avisoRecuperacao = document.getElementById('aviso-recuperacao');

  // Preenche o e-mail caso "Lembrar de mim" tenha sido usado anteriormente
  const emailSalvo = localStorage.getItem(STORAGE_EMAIL_KEY);
  if (emailSalvo && inputEmail) {
    inputEmail.value = emailSalvo;
    if (checkboxLembrar) {
      checkboxLembrar.checked = true;
    }
  }

  if (linkEsqueceuSenha && avisoRecuperacao) {
    linkEsqueceuSenha.addEventListener('click', (event) => {
      event.preventDefault();
      avisoRecuperacao.textContent =
        'A recuperação automática de senha não está disponível nesta versão. Procure a equipe de TI para redefinir seu acesso.';
      avisoRecuperacao.style.display = 'block';
    });
  }

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

      const resultado = await autenticarUsuario(emailVal, senhaVal);

      if (resultado.sucesso) {
        if (checkboxLembrar && checkboxLembrar.checked) {
          localStorage.setItem(STORAGE_EMAIL_KEY, emailVal);
        } else {
          localStorage.removeItem(STORAGE_EMAIL_KEY);
        }

        localStorage.setItem(STORAGE_USUARIO_KEY, JSON.stringify(resultado.dados.usuario));
        window.location.href = 'dashboard.html';
      } else {
        if (inputSenha) {
          mostrarErro(inputSenha, resultado.mensagem || 'E-mail ou senha inválidos.');
        }
        if (botaoSubmit) {
          botaoSubmit.disabled = false;
          botaoSubmit.innerText = textoOriginal;
        }
      }
    });

    [inputEmail, inputSenha].forEach((campo) => {
      if (campo) {
        campo.addEventListener('input', () => removerErro(campo));
      }
    });
  }
});