//retorna 404 quando nenhuma rota corresponde a requisição
export function notFoundHandler(req, res) {
  res.status(404).json({
    erro: 'Rota não encontrada',
    mensagem: `Não existe o endpoint ${req.method} ${req.originalUrl}`
  });
}

//middleware para formatar e enviar respostas de erro
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const resposta = {
    erro: err.name || 'Erro interno do servidor',
    mensagem: err.message || 'Ocorreu um erro inesperado ao processar a requisição.'
  };

  //inclui detalhes de validação disponíveis
  if (err.detalhes) {
    resposta.detalhes = err.detalhes;
  }

  //registra no console apenas falhas internas do servidor
  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json(resposta);
}