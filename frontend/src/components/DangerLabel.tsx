import React, { useEffect, useState } from 'react';
import axios from "axios";
import { FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

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
        <div className={`w-full max-w-xs p-2 rounded-lg shadow flex flex-col items-center gap-3 border ${emPerigo ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}`}>
            <div className="flex flex-col items-center gap-1">
                {emPerigo ? (
                    <>
                        <FaExclamationTriangle className="text-red-500 text-3xl animate-pulse" />
                        <span className="text-base font-bold text-red-700">Usuário em Perigo</span>
                    </>
                ) : (
                    <>
                        <FaCheckCircle className="text-green-500 text-3xl" />
                        <span className="text-base font-bold text-green-700">Usuário Seguro</span>
                    </>
                )}
            </div>
            {emPerigo && (
                <button 
                    onClick={desativarPerigo}
                    className="px-4 py-1 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors shadow"
                >
                    Desativar Perigo
                </button>
            )}
        </div>
    );
};

export default DangerLabel;

