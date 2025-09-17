const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    const url = 'https://dmr-portugal.org/bm268/bm2682/heard.htm';

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const lastHeardData = [];

        // A tabela parece estar dentro de um elemento com a classe "container"
        const table = $('.container table').first(); 
        
        // Verifica se a tabela foi encontrada
        if (table.length === 0) {
            return res.status(500).json({ error: 'Tabela não encontrada na página.' });
        }

        // Seleciona todas as linhas da tabela (<tr>)
        table.find('tr').each((i, element) => {
            const columns = $(element).find('td');

            // Verifica se a linha tem as 9 colunas esperadas
            if (columns.length === 9) {
                const row = {
                    hora: $(columns[0]).text().trim(),
                    indicativo: $(columns[1]).text().trim(),
                    nome: $(columns[2]).text().trim(),
                    local: $(columns[3]).text().trim(),
                    tg: $(columns[4]).text().trim(),
                    slot: $(columns[5]).text().trim(),
                    servidor: $(columns[6]).text().trim(),
                    rssi: $(columns[7]).text().trim(),
                    loss: $(columns[8]).text().trim()
                };
                lastHeardData.push(row);
            }
        });

        // A primeira linha pode ser o cabeçalho, se tiver dados, o slice remove a primeira
        if (lastHeardData.length > 0) {
            lastHeardData.shift(); 
        }

        res.status(200).json(lastHeardData);

    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter dados: ' + error.message });
    }
};
