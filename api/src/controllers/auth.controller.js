//usuários de exemplo em memória para validação real nesta etapa
const USUARIOS = [
  {
    id: 1,
    nome: 'Carlos Técnico',
    email: 'carlos@techdesk.local',
    senha: '123',
    perfil: 'tecnico'
  },
  {
    id: 2,
    nome: 'Ana Solicitante',
    email: 'ana@techdesk.local',
    senha: '123',
    perfil: 'usuario'
  }
];

export function login(req, res) {
  const { email, senha } = req.body || {};

  const emailLimpo = String(email || '').trim().toLowerCase();
  const senhaLimpa = String(senha || '').trim();

  if (!emailLimpo || !senhaLimpa) {
    return res.status(400).json({
      erro: 'Dados inválidos',
      mensagem: 'E-mail e senha são obrigatórios.'
    });
  }

  const usuario = USUARIOS.find(
    (u) => u.email.toLowerCase() === emailLimpo && u.senha === senhaLimpa
  );

  if (!usuario) {
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
}