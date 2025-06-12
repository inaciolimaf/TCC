import React, { useEffect, useState } from 'react';
import axios from "axios";

interface DangerLabelProps {
    emPerigo: boolean;
}

const DangerLabel: React.FC<DangerLabelProps> = ({ emPerigo: propEmPerigo = false }) => {
    const [emPerigo, setEmPerigo] = useState(propEmPerigo);
    
    // Sincroniza o estado interno com a prop quando ela muda
    useEffect(() => {
        setEmPerigo(propEmPerigo);
    }, [propEmPerigo]);
    const desativarPerigo = async () => {
        const occurenceResponse = await axios.post(
            "http://localhost:3000/api/v1/occurrence/create",
            { isInDanger: false, reason: "FALL"},
        );
    };

    return (
        <div className="p-4 space-y-4">
            {emPerigo ? (
                <span className="px-4 py-2 font-bold text-white bg-red-500 rounded">
                    Usuário em Perigo
                </span>
            ) : (
                <span className="px-4 py-2 font-bold text-white bg-green-500 rounded">
                    Usuário Seguro
                </span>
            )}
            
            <div>
                <button 
                    onClick={desativarPerigo}
                    className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                >
                    Desativar Perigo
                </button>
            </div>
        </div>
    );
};

export default DangerLabel;

