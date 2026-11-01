//endereço do json server local
const API_URL = 'http://localhost:3000/chamados';

//consulta todos os chamados - get
export async function buscarChamados() {
  try {
    const resposta = await fetch(API_URL);
    
    if (!resposta.ok) {
      throw new Error(`Erro ao buscar dados: ${resposta.statusText}`);
    }
    
    const dados = await resposta.json();
    return { sucesso: true, dados };
  } catch (error) {
    console.error('Erro na requisição GET:', error);
    return { sucesso: false, mensagem: 'Não foi possível carregar os chamados do servidor.' };
  }
}

//cadastra um novo chamado - post
export async function criarChamado(novoChamado) {
  try {
    const resposta = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novoChamado),
    });

    if (!resposta.ok) {
      throw new Error(`Erro ao salvar: ${resposta.statusText}`);
    }

    const dadoCriado = await resposta.json();
    return { sucesso: true, dados: dadoCriado };
  } catch (error) {
    console.error('Erro na requisição POST:', error);
    return { sucesso: false, mensagem: 'Não foi possível salvar o chamado no servidor.' };
  }
}

//consulta o chamado pelo id - get
export async function buscarChamadoPorId(id) {
  try {
    const resposta = await fetch(`${API_URL}/${id}`);
    
    if (!resposta.ok) {
      throw new Error(`Erro ao buscar o chamado #${id}`);
    }
    
    const dados = await resposta.json();
    return { sucesso: true, dados };
  } catch (error) {
    console.error('Erro na requisição GET por ID:', error);
    return { sucesso: false, mensagem: 'Não foi possível carregar os detalhes do chamado.' };
  }
}