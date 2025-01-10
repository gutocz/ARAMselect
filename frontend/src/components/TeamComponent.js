import React, { useEffect, useState } from "react";
import axios from "axios";

const TeamComponent = () => {
    const [team, setTeam] = useState([]); // Estado do time
    const [error, setError] = useState(null); // Estado para erros

    // URL base para imagens dos campeões
    const getChampionImageUrl = (champion) =>
        `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion}_0.jpg`;

    // Função para buscar o time inicial
    const fetchTeam = async () => {
        try {
            setError(null); // Limpa erros anteriores
            const response = await axios.get("http://localhost:5000/team");
            const updatedTeam = response.data.map((player) => ({
                ...player,
                image: getChampionImageUrl(player.champion),
            }));
            setTeam(updatedTeam);
        } catch (err) {
            setError("Erro ao carregar o time. Tente novamente mais tarde.");
            console.error("Erro ao buscar o time:", err.message);
        }
    };

    // Função para rolar um novo campeão para um jogador
    const handleRoll = async (playerIndex) => {
        try {
            setError(null); // Limpa erros anteriores
            const player = team[playerIndex];
            const response = await axios.post("http://localhost:5000/roll", player);
            const updatedPlayer = response.data;

            // Atualiza o jogador no estado
            setTeam((prevTeam) => {
                const newTeam = [...prevTeam];
                newTeam[playerIndex] = {
                    ...updatedPlayer,
                    image: getChampionImageUrl(updatedPlayer.champion),
                };
                return newTeam;
            });
        } catch (err) {
            setError("Erro ao rolar o campeão. Tente novamente.");
            console.error("Erro ao rolar o campeão:", err.message);
        }
    };

    // Busca o time na montagem do componente
    useEffect(() => {
        fetchTeam();
    }, []);

    return (
        <div className="team-container">
            <h2>Time Atual</h2>

            {/* Exibição de mensagens de erro */}
            {error && <p className="error-message">{error}</p>}

            {/* Renderização do time */}
            {team.map((player, index) => (
                <div key={index} className="champion-card">
                    <img src={player.image} alt={player.champion} />
                    <h3>{player.champion}</h3>
                    <button onClick={() => handleRoll(index)}>
                        🎲 {player.rolls}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default TeamComponent;
