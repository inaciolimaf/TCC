export interface User {
    nome: string;
    emPerigo: boolean;
    urlAudio: string;
    localizacao: {
        lat: number;
        lng: number;
    };
}
