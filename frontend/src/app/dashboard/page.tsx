"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import DangerLabel from "../../components/DangerLabel";
import AudioPlayer from "../../components/AudioPlayer";
import Map from "../../components/Map";
import { User } from "../../interfaces/User";

const Dashboard: React.FC = () => {
    const [usuario, setUsuario] = useState<User | null>(null);

    useEffect(() => {
        const fetchUsuario = async () => {
            const token = localStorage.getItem("token");

            try {
                const userResponse = await axios.get(
                    "http://localhost:3001/api/v1/user/show",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const gpsResponse = await axios.get(
                    "http://localhost:3001/api/v1/gps/list",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                
                if (userResponse.status === 200) {
                    const usuario: User = {
                        nome: userResponse.data.name,
                        emPerigo: true,
                        urlAudio: "https://exemplo.com/audio.mp3",
                        localizacao: {
                            lat: gpsResponse.data[0].latitude,
                            lng: gpsResponse.data[0].longitude,
                        },
                    };
                    setUsuario(usuario);
                }
            } catch (error) {
                console.error("Erro ao obter usuário:", error);
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
