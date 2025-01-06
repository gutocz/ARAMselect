import React, { useEffect, useState } from 'react';
import axios from 'axios';
const ImageComponent = () => {
    const [imageUrls, setImageUrls] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const rolls = 2;

    useEffect(() => {
        const fetchImageUrls = async () => {
            try {
                setIsLoading(true); // Inicia o estado de carregamento
                const response = await axios.get('http://localhost:5000/image-urls');
                console.log('Dados recebidos no frontend:', response.data);
                setImageUrls(response.data.imageUrls); // Atualiza o estado com as URLs recebidas
            } catch (error) {
                console.error('Erro ao carregar as imagens:', error);
            } finally {
                setIsLoading(false); // Finaliza o estado de carregamento
            }
        };

        fetchImageUrls();
    }, []); // Executa apenas na montagem

    return (
        <div>
            {isLoading ? (
                <p>Carregando as imagens...</p>
            ) : (
                imageUrls.map((url, index) => (
                    <div class="container">
                        <img key={index} src={url} alt={`Imagem ${index + 1}`} />
                        <button onClick={null}>🎲{rolls}</button>
                    </div>
                ))
            )}

        </div>
    );
}

export default ImageComponent;
