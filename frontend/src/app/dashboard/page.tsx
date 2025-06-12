"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import DangerLabel from "../../components/DangerLabel";
import AudioPlayer from "../../components/AudioPlayer";
import Map from "../../components/Map";
import { User } from "../../interfaces/User";
import HistoricoOcorrencias from "@/components/HistóricoOccurence";
import { Occurence } from "@/interfaces/Occurence";

const Dashboard: React.FC = () => {
    const [usuario, setUsuario] = useState<User | null>(null);
    const [occurences, setOccurences] = useState<Occurence[] | null>(null);

    useEffect(() => {
        const fetchUsuario = async () => {
            const token = localStorage.getItem("token");

            try {
                const userResponse = await axios.get(
                    "http://localhost:3000/api/v1/user/show",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const gpsResponse = await axios.get(
                    "http://localhost:3000/api/v1/gps/list",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const occurenceResponse = await axios.get(
                    "http://localhost:3000/api/v1/occurrence/list",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setOccurences(occurenceResponse.data);
                
                console.log(gpsResponse.data);
                console.log(occurenceResponse.data[0]);
                
                if (userResponse.status === 200) {
                    const usuario: User = {
                        id: userResponse.data.id,
                        nome: userResponse.data.name,
                        emPerigo: occurenceResponse.data[0].isInDanger,
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
            <HistoricoOcorrencias ocorrencias={occurences ?? []}/>
        </div>
    );
};

export default Dashboard;
