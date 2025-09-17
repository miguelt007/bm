// api/proxy.js

// O URL base da API da BrandMeister
const BRANDMEISTER_API_BASE = 'https://brandmeister.network';

// Esta é a função principal que o Vercel executa
export default async function handler(request, response) {
  try {
    // Constrói o URL completo da API usando a 'query' (parâmetros) do pedido original
    // Por exemplo, se o seu pedido for '/api/proxy?page=lh&DestinationID=268'
    // A URL da API será 'https://brandmeister.network/?page=lh&DestinationID=268'
    const fullUrl = `${BRANDMEISTER_API_BASE}${request.url.replace('/api/proxy', '')}`;

    // Faz o pedido para a BrandMeister
    const apiResponse = await fetch(fullUrl);

    // Verifica se a resposta foi bem-sucedida
    if (!apiResponse.ok) {
      throw new Error(`Falha ao buscar dados: ${apiResponse.status} ${apiResponse.statusText}`);
    }

    // Lê a resposta como texto (HTML), uma vez que a página não é uma API JSON
    const data = await apiResponse.text();

    // ADICIONADO PARA DEBUG: Mostra o conteúdo recebido nos logs do Vercel
    console.log('Conteúdo HTML recebido do BrandMeister:', data); 

    // Define os cabeçalhos para que o seu navegador possa aceitar a resposta
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Envia os dados (HTML) de volta para a sua página web
    response.status(200).send(data);

  } catch (error) {
    console.error('Erro na função de proxy:', error.message);
    response.status(500).json({ error: 'Erro interno no servidor' });
  }
}
