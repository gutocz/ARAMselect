import React, { useEffect, useState } from "react";
import axios from "axios";

const TeamComponent = () => {
    const [team, setTeam] = useState([]);

    // Fetch inicial do time
    useEffect(() => {
        axios
            .get("http://localhost:5000/team") // Substitua pelo seu endpoint
            .then((response) => {
                setTeam(response.data);
            })
            .catch((error) => {
                console.error("Erro ao buscar o time no backend:", error.message);
            });
    }, []);

    // Função para rolar o dado
    const handleRoll = (player) => {
        console.log(player.champion);
        axios
            .post("http://localhost:5000/roll", player)
            .then((response) => {
                const updatedPlayer = response.data;
                console.log("Jogador atualizado:", updatedPlayer.champion);

                // Atualiza o estado com o jogador atualizado
                setTeam((prevTeam) =>
                    prevTeam.map((p) =>
                        p.champion === updatedPlayer.champion ? updatedPlayer : p
                    )
                );
            })
            .catch((error) => {
                console.error("Erro ao rolar o dado no backend:", error.message);
            });
    };

    return (
        <div className="team-container">
            {team.map((player, index) => (
                <div key={index} className="champion-card">
                    <img src={player.image} alt={player.champion} />
                    <h3>{player.champion}</h3>
                    <button onClick={() => handleRoll(player)}>
                        🎲 {player.rolls}
                    </button>
                    <p>{index}</p>
                </div>
            ))}
        </div>
    );
};

export default TeamComponent;
