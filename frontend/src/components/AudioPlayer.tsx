interface AudioPlayerProps {
    urlAudio: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ urlAudio }) => {
    return (
        <div className="p-4">
            <h2 className="mb-2 text-lg font-semibold">Áudio em Tempo Real</h2>
            <audio controls src={urlAudio} className="w-full">
                Seu navegador não suporta o elemento de áudio.
            </audio>
        </div>
    );
};

export default AudioPlayer;
