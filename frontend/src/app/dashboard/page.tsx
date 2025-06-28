// src/app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import DangerLabel from "../../components/DangerLabel";
import AudioPlayer from "../../components/AudioPlayer";
import RealTimeAudio from "../../components/RealTimeAudio";
import Map from "../../components/Map";
import { User } from "../../interfaces/User";
import HistoricoOcorrencias from "@/components/HistóricoOccurence";
import { Occurence } from "@/interfaces/Occurence";
import Tabs from "@/components/Tabs";


const Dashboard: React.FC = () => {
    const [usuario, setUsuario] = useState<User | null>(null);
    const [occurences, setOccurences] = useState<Occurence[] | null>(null);
    const [token, setToken] = useState<string>("");

    useEffect(() => {
        // Obter token do localStorage
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        if (!token) return;

        const fetchUsuario = async () => {
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
                        emPerigo: occurenceResponse.data[0]?.isInDanger || false,
                        localizacao: {
                            lat: gpsResponse.data[0]?.latitude || -23.550520,
                            lng: gpsResponse.data[0]?.longitude || -46.633309,
                        },
                    };
                    setUsuario(usuario);
                }
            } catch (error) {
                console.error("Erro ao obter usuário:", error);
            }
        };

        fetchUsuario();

        // Atualizar dados a cada 5 segundos (exceto áudio que é em tempo real)
        const interval = setInterval(fetchUsuario, 1000);
        return () => clearInterval(interval);
    }, [token]);

    if (!usuario) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span>Carregando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header nomeUsuario={usuario.nome} />
            
            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Status do usuário */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800">Mapa de localizações do usuário</h2>
                        <DangerLabel emPerigo={usuario.emPerigo} />
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-4">
                        <Map localizacao={usuario.localizacao} />
                    </div>
                </div>

                {/* Menu de abas para Áudio em tempo real e Histórico de Ocorrências */}
                <Tabs token={token} ocorrencias={occurences ?? []} />
            </div>
        </div>
    );
};

export default Dashboard;