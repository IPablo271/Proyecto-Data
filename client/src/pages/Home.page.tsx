// Importamos NavbarMinimal.tsx
import { useState } from 'react';
import { NavbarMinimal } from '../components/NavbarMinimal/NavbarMinimal';

// Importamos el ModeloUno.tsx y ModeloDos.tsx
import ModeloUno from '../components/ModeloUno/ModeloUno';
import ModeloDos from '../components/ModeloDos/ModeloDos';
import ModeloTres from '../components/ModeloTres/ModeloTres';

import { CardsCarousel } from '../components/CardsCarousel/CardsCarousel';

export function HomePage() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  let content;
  switch (selectedModel) {
    case 'Modelo 1':
      content = <ModeloUno />;
      break;
    case 'Modelo 2':
      content = <ModeloDos />;
      break;
    case 'Modelo 3':
      content = <ModeloTres />;
      break;
    case 'Graficas':
      content = <CardsCarousel />;
      break;
    default:
      content = <p>Seleccione un modelo o gráfica</p>;
  }

  const homeContainerStyle = {
    display: 'flex',
    alignItems: 'start',
    height: '100vh'
  };

  const contentContainerStyle = {
    flexGrow: 1,
    padding: '20px'
  };

  return (
    <div style={homeContainerStyle}>
      <NavbarMinimal onModelClick={(label) => setSelectedModel(label)} />
      <div style={contentContainerStyle}>
        {content}
      </div>
    </div>
  );
}
