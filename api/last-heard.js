const axios = require('axios');

module.exports = async (req, res) => {
    const url = 'https://dmr-portugal.org/lh/lh.json';

    try {
        const response = await axios.get(url);
        const jsonData = response.data;
        
        // Devolve os dados JSON diretamente ao cliente
        res.status(200).json(jsonData);

    } catch (error) {
        // Se houver um erro, envia uma mensagem de erro
        res.status(500).json({ error: 'Erro ao obter dados do JSON: ' + error.message });
    }
};
