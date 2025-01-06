const Player = require('../model/player');
const express = require('express');
const router = express.Router();
const axios = require('axios');

const lolChamps = "https://ddragon.leagueoflegends.com/cdn/14.24.1/data/pt_BR/champion.json";
const imgBaseUrl = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/";

// Rota raiz API
router.get('/', async (req, res) => {
    try {
        const response = await createTeam();
        console.log(response);
        response[3] = await rollChampion(response[3]);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message }); // Envia o erro caso algo dê errado
    }
});

// Rota que retorna um time aleatório
router.get('/team', async (req, res) => {
    try {
        const response = await createTeam();
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message }); // Envia o erro caso algo dê errado
    }
});

router.post('/roll', async (req, res) => {
    try {
        const player = req.body; // Obtem o jogador do corpo da requisição

        // Processa a rolagem
        const updatedPlayer = await rollChampion(player);

        // Se estiver usando banco de dados, salve aqui, exemplo:
        // await PlayerModel.findByIdAndUpdate(player.id, updatedPlayer);

        res.json(updatedPlayer); // Retorna o jogador atualizado
    } catch (error) {
        res.status(500).json({ error: error.message }); // Envia o erro caso algo dê errado
    }
});

// Função que retorna TODOS os dados de um campeão
async function getChampion(championName) {
    return axios.get(`https://ddragon.leagueoflegends.com/cdn/14.24.1/data/pt_BR/champion/${championName}.json`);
}

// Função que retorna a imagem de um campeão
async function getChampionImage(championName) {
    const url = imgBaseUrl + championName + "_1.jpg";
    return url;
}

// Função que retorna os nomes de todos os campeões
async function getChampionNames() {
    try {
        const response = await axios.get(lolChamps); // Aguarda a resposta
        const championNames = [];

        // Percorre os campeões e coleta seus nomes
        for (let champion in response.data.data) {
            championNames.push(champion);
        }

        return championNames; // Retorna a lista de nomes dos campeões
    } catch (error) {
        console.error("Erro ao buscar o JSON no backend:", error.message);
        throw new Error("Erro ao buscar os dados.");
    }
}

// Função que retorna um campeão aleatório
async function sortChampion(){
    const championNames = await getChampionNames();
    // retorna um nome aleatório dentre os que foram obtidos
    return championNames[Math.floor(Math.random() * championNames.length)];
}

// Função que cria um time com 5 players com campeões aleatórios
async function createTeam(){
    const champions = await sortTeam();
    const team = [];
    for (let i = 0; i < 5; i++) {
        team.push(new Player(champions[i], 2));
    }
    return team;
}

// Função que sorteia 5 campeões aleatórios
async function sortTeam(){
    const championNames = await getChampionNames();
    const team = [];
    // Adiciona 5 campeões aleatórios à lista
    for (let i = 0; i < 5; i++) {
        let champion = championNames[Math.floor(Math.random() * championNames.length)];
        if (!team.includes(champion)) {
            team.push(champion);
        } else {
            i--;
        }
    }
    return team;
}

// Função que sorteia um novo campeão para um jogador
async function rollChampion(player) {
    if (player.rolls <= 0) {
        return player; // Retorna o player inalterado
    } else {
        const newChampion = await sortChampion();

        if (newChampion === player.champion) {
            // Tenta novamente se o campeão for o mesmo
            return rollChampion(player);
        }

        // Atualiza o jogador
        player.champion = newChampion;
        player.rolls -= 1;

        return player; // Retorna o jogador atualizado
    }
}


module.exports = router;
