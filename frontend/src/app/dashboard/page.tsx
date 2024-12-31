"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import DangerLabel from '../../components/DangerLabel';
import AudioPlayer from '../../components/AudioPlayer';
import Map from '../../components/Map';
import { User } from '../../interfaces/User';

const Dashboard: React.FC = () => {
  const [usuario, setUsuario] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('http://localhost:3001/api/v1/user/show', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const usuario: User = {
            nome: "João Silva",
            emPerigo: true,
            urlAudio: "https://exemplo.com/audio.mp3",
            localizacao: {
                lat: -3.596265,
                lng: -40.775259
            }
        };
          setUsuario(usuario);
        }
      } catch (error) {
        console.error('Erro ao obter usuário:', error);
      }
    };

    fetchUsuario();

    const interval = setInterval(fetchUsuario, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!usuario) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <Header nomeUsuario={usuario.nome} />
      <DangerLabel emPerigo={usuario.emPerigo} />
      <AudioPlayer urlAudio={usuario.urlAudio} />
      <Map localizacao={usuario.localizacao} />
    </div>
  );
};

export default Dashboard;