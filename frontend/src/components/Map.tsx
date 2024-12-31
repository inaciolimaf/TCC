import React, { useEffect, useRef } from 'react';
import { GoogleMap, useLoadScript, Library } from '@react-google-maps/api';

interface MapProps {
  localizacao: {
    lat: number;
    lng: number;
  };
}

// Bibliotecas extras do Google Maps API
const libraries: Library[] = ['marker'];

const Map: React.FC<MapProps> = ({ localizacao }) => {
  // Carrega o script da API do Google Maps com a chave do .env.local
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '', // Variável de ambiente para chave da API
    libraries,
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      const map = mapRef.current;

      // Adiciona um marcador no mapa
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: localizacao.lat, lng: localizacao.lng },
        title: 'Localização',
      });

      // Limpa o marcador ao desmontar o componente
      return () => {
        marker.map = null;
      };
    }
  }, [isLoaded, localizacao]);

  // Mostra um texto de carregamento enquanto a API não está carregada
  if (!isLoaded) return <p>Carregando mapa...</p>;

  return (
    <div className="h-64">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={localizacao}
        zoom={15}
        options={{
          mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || '', // Variável de ambiente para o mapId
        }}
        onLoad={(map) => {
          mapRef.current = map;
        }}
        onUnmount={() => {
          mapRef.current = null;
        }}
      />
    </div>
  );
};

export default Map;