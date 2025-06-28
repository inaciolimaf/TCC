// src/components/AudioPlayer.tsx
"use client";
import React from 'react';

interface AudioPlayerProps {
    urlAudio?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ urlAudio }) => {
    if (!urlAudio) {
        return (
            <div className="p-4">
                <h2 className="mb-2 text-lg font-semibold">Áudio</h2>
                <p className="text-gray-500">Nenhum áudio disponível no momento</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="mb-2 text-lg font-semibold">Áudio</h2>
            <audio controls src={urlAudio} className="w-full">
                Seu navegador não suporta o elemento de áudio.
            </audio>
        </div>
    );
};

export default AudioPlayer;