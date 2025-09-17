const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    const url = 'https://dmr-portugal.org/bm268/bm2682/heard.htm';

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const lastHeardData = [];
        const table = $('table').first(); // Seleciona a primeira tabela que aparece

        // Encontra as linhas da tabela (td)
        table.find('tr').each((i, element) => {
            const columns = $(element).find('td');

            if (columns.length > 0) {
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

        // Remove a linha de cabeçalho, se existir
        lastHeardData.shift();

        // Envia a resposta JSON
        res.status(200).json(lastHeardData);

    } catch (error) {
        // Se houver um erro, envia uma mensagem de erro
        res.status(500).json({ error: 'Erro ao obter dados.' });
    }
};
