// src/components/RealTimeAudio.tsx
"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { socketService, AudioFileInfo } from '../services/socketService';
import { audioApiService } from '../services/audioService';

interface RealTimeAudioProps {
    token: string;
}

const RealTimeAudio: React.FC<RealTimeAudioProps> = ({ token }) => {
    const [audioFiles, setAudioFiles] = useState<AudioFileInfo[]>([]);
    const [latestAudio, setLatestAudio] = useState<AudioFileInfo | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [autoPlay, setAutoPlay] = useState(false);

    // Callback para novos áudios
    const handleNewAudio = useCallback((audioInfo: AudioFileInfo) => {
        console.log('Novo áudio disponível:', audioInfo);
        
        setLatestAudio(audioInfo);
        setAudioFiles(prev => [audioInfo, ...prev.slice(0, 9)]); // Manter apenas os 10 mais recentes
        
        // Auto-play se habilitado
        if (autoPlay) {
            const audio = new Audio(`http://localhost:3000${audioInfo.url}`);
            audio.play().catch(e => console.log('Erro ao reproduzir áudio automaticamente:', e));
        }
        
        // Notificação visual
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Novo áudio disponível', {
                body: `Arquivo: ${audioInfo.filename}`,
                icon: '/favicon.ico'
            });
        }
    }, [autoPlay]);

    // Solicitar permissão para notificações
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    // Conectar ao WebSocket
    useEffect(() => {
        const connectSocket = () => {
            socketService.connect();
            socketService.onNewAudio(handleNewAudio);
            
            // Simular conexão (você pode verificar o status real do socket se necessário)
            setTimeout(() => setIsConnected(true), 1000);
        };

        connectSocket();

        return () => {
            socketService.removeNewAudioListener(handleNewAudio);
            socketService.disconnect();
            setIsConnected(false);
        };
    }, [handleNewAudio]);

    // Carregar áudios existentes
    useEffect(() => {
        const loadAudioFiles = async () => {
            setIsLoading(true);
            try {
                const [files, latest] = await Promise.all([
                    audioApiService.getAudioFiles(token),
                    audioApiService.getLatestAudio(token)
                ]);
                
                setAudioFiles(files);
                if (latest) {
                    setLatestAudio(latest);
                }
            } catch (error) {
                console.error('Erro ao carregar arquivos de áudio:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            loadAudioFiles();
        }
    }, [token]);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (date: Date | string): string => {
        const d = new Date(date);
        return d.toLocaleString('pt-BR');
    };

    const handleDeleteFile = async (filename: string) => {
        if (confirm('Tem certeza que deseja deletar este arquivo?')) {
            const success = await audioApiService.deleteAudioFile(filename, token);
            if (success) {
                setAudioFiles(prev => prev.filter(file => file.filename !== filename));
                if (latestAudio?.filename === filename) {
                    setLatestAudio(audioFiles.find(file => file.filename !== filename) || null);
                }
            }
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <span>Carregando áudios...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3 flex-wrap">
                    <h2 className="text-2xl font-bold text-gray-800">🎵 Áudio em Tempo Real</h2>
                    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm text-gray-600">
                        {isConnected ? 'Conectado' : 'Desconectado'}
                    </span>
                </div>
                
            </div>

            {/* Último áudio */}
            {latestAudio && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">🔊 Último Áudio</h3>
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                            <strong>Arquivo:</strong> {latestAudio.filename}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Data:</strong> {formatDate(latestAudio.createdAt)}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Tamanho:</strong> {formatFileSize(latestAudio.size)}
                        </p>
                        <audio 
                            controls 
                            className="w-full mt-2"
                            src={`http://localhost:3000${latestAudio.url}`}
                        >
                            Seu navegador não suporta o elemento de áudio.
                        </audio>
                    </div>
                </div>
            )}

            {/* Lista de áudios */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">📂 Histórico de Áudios</h3>
                
                {audioFiles.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-6xl text-gray-400 mb-4">🎵</div>
                        <p className="text-gray-500">Nenhum arquivo de áudio encontrado</p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {audioFiles.map((audioFile, index) => (
                            <div 
                                key={audioFile.filename + index}
                                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 space-y-2">
                                        <h4 className="font-medium text-gray-800">
                                            {audioFile.filename}
                                        </h4>
                                        <div className="flex space-x-4 text-sm text-gray-600">
                                            <span>{formatDate(audioFile.createdAt)}</span>
                                            <span>{formatFileSize(audioFile.size)}</span>
                                        </div>
                                        <audio 
                                            controls 
                                            className="w-full"
                                            src={`http://localhost:3000${audioFile.url}`}
                                        >
                                            Seu navegador não suporta o elemento de áudio.
                                        </audio>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteFile(audioFile.filename)}
                                        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Deletar arquivo"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RealTimeAudio;