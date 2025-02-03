import React, { useEffect, useState } from "react";

const SortedChampions = () => {
    const [sortedChampions, setSortedChampions] = useState([]); // Estado para campeões sorteados

    // Conectar ao WebSocket e escutar as atualizações
    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080/");

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setSortedChampions(data);
                console.log("Campeões sorteados atualizados:", data);
            } catch (error) {
                console.error("Erro ao processar os dados recebidos do WebSocket:", error.message);
            }
        };

        return () => socket.close(); // Fecha o socket ao desmontar o componente
    }, []);

    return (
        <div className="sorted-champions">
            <h2>Campeões Sorteados</h2>

            {/* Renderização da lista de campeões sorteados */}
            <div className="sorted-champions-list">
                {sortedChampions.length > 0 ? (
                    sortedChampions.map((champion, index) => (
                        <div key={index} className="champion-card-sorted">
                            <img src={champion.image} alt={champion.name} />
                            <h3>{champion.name}</h3>
                        </div>
                    ))
                ) : (
                    <p className="no-champions">Nenhum campeão sorteado ainda.</p>
                )}
            </div>
        </div>
    );
};

export default SortedChampions;
