const Player = require('../model/player');
const express = require('express');
const router = express.Router();
const axios = require('axios');
const WebSocket = require("ws");

const lolChamps = "https://ddragon.leagueoflegends.com/cdn/14.24.1/data/pt_BR/champion.json";
const imgBaseUrl = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/";

const wss = new WebSocket.Server({ port: 8080 });

// Lista para armazenar os campeões sorteados
let sortedChampionsList = [];

let allSortedChampionsList = [];

/**
 * Envia a lista de sortedChampionsList para todos os clientes conectados
 */
function broadcastSortedChampions() {
    const data = JSON.stringify(sortedChampionsList);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

/**
 * Reseta a lista de campeões sorteados automaticamente ao iniciar uma conexão
 */
wss.on("connection", () => {
    sortedChampionsList = []; // Esvazia a lista ao estabelecer conexão
    allSortedChampionsList = [];
    //console.log("Conexão estabelecida. Lista de campeões sorteados resetada.");
});

/**
 * Obtém todos os nomes dos campeões a partir da API externa
 */
async function getChampionNames() {
    try {
        const response = await axios.get(lolChamps);
        return Object.keys(response.data.data);
    } catch (error) {
        console.error("Erro ao buscar os nomes dos campeões:", error.message);
        throw new Error("Erro ao buscar os dados dos campeões.");
    }
}

/**
 * Obtém a URL da imagem de um campeão
 */
function getChampionImage(championName) {
    return `${imgBaseUrl}${championName}_0.jpg`;
}

/**
 * Sorteia um campeão aleatório
 */
async function sortChampion() {
    const championNames = await getChampionNames();
    return championNames[Math.floor(Math.random() * championNames.length)];
}

/**
 * Cria um time com 5 jogadores com campeões aleatórios
 */
async function createTeam() {
    const championNames = await getChampionNames();
    const team = [];
    const usedChampions = new Set(); // Evitar duplicações

    while (team.length < 5) {
        const champion = championNames[Math.floor(Math.random() * championNames.length)];
        if (!usedChampions.has(champion)) {
            usedChampions.add(champion);
            //const img = getChampionImage(champion);
            team.push(new Player(champion, 2));
            allSortedChampionsList.push(champion);
        }
    }
    return team;
}

/**
 * Atualiza o campeão de um jogador
 */
async function rollChampion(player) {
    if (player.rolls <= 0) return player;

    let newChampion;
    do {
        newChampion = await sortChampion();
    } while (newChampion === player.champion || allSortedChampionsList.includes(newChampion));

    const img = getChampionImage(player.champion);
    sortedChampionsList.push({ name: player.champion, image: img });
    allSortedChampionsList.push(player.champion);
    player.champion = newChampion;
    player.rolls -= 1;
    return player;
}

// Rota raiz API
router.get('/', async (req, res) => {
    try {
        const response = "API Working!";
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota que retorna um time aleatório
router.get('/team', async (req, res) => {
    try {
        const team = await createTeam();
        res.json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para atualizar um campeão de um jogador
router.post('/roll', async (req, res) => {
    try {
        const player = req.body;
        const updatedPlayer = await rollChampion(player);
        broadcastSortedChampions();
        res.json(updatedPlayer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para obter os campeões sorteados
router.get('/sortedChampions', (req, res) => {
    res.json(sortedChampionsList);
});

// Rota para resetar a lista de campeões sorteados
router.post('/resetSortedChampions', (req, res) => {
    sortedChampionsList = [];
    allSortedChampionsList = [];
    res.status(200).send("Lista de campeões sorteados resetada.");
});

module.exports = router;
