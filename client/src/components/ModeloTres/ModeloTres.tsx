import React, { useState } from 'react';
import { InputWithButton } from "../InputWithButton/InputWithButton";
import { InfoStack } from "../InfoStack/InfoStack";

export default function ModeloUno() {
    const [artistas, setArtistas] = useState<string[][]>([]);

    const handleSearch = async (value: string) => {
        const url = "http://127.0.0.1:5001/modelo3";

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre: value })
            });

            if (response.ok) {
                const data = await response.json();
                setArtistas(data.artistas);
            } else {
                console.error("Error en la petición:", response.statusText);
            }
        } catch (error) {
            console.error("Error al hacer la petición:", error);
        }
    };

    return (
        <div>
            <h1>Utilizando el Modelo 3</h1>
            <InputWithButton onSearch={handleSearch} />
            <InfoStack
                artistas={artistas.map(([nombre, cancion]) => ({ nombre, cancion }))}
            />
        </div>
    )
}
