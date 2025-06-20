export interface User {
    id: string;
    nome: string;
    emPerigo: boolean;
    urlAudio?: string; 
    localizacao: {
        lat: number;
        lng: number;
    };
}
