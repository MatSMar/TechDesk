import { buscarUsuarioPorEmail } from '../repositories/usuarios.repository.js';

export async function login(req, res, next) {
  try {
    const { email, senha } = req.body || {};

    const emailLimpo = String(email || '').trim().toLowerCase();
    const senhaLimpa = String(senha || '').trim();

    if (!emailLimpo || !senhaLimpa) {
      return res.status(400).json({
        erro: 'Dados inválidos',
        mensagem: 'E-mail e senha são obrigatórios.'
      });
    }

    const usuario = await buscarUsuarioPorEmail(emailLimpo);

    if (!usuario || usuario.senha !== senhaLimpa) {
      return res.status(401).json({
        erro: 'Não autorizado',
        mensagem: 'E-mail ou senha incorretos.'
      });
    }

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso.',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    });
  } catch (err) {
    next(err);
  }
}