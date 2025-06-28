import React from 'react';
import { Occurence } from '@/interfaces/Occurence';


interface HistoricoOcorrenciasProps {
    ocorrencias: Occurence[];
    loading?: boolean;
}

const HistoricoOcorrencias: React.FC<HistoricoOcorrenciasProps> = ({ 
    ocorrencias = [], 
    loading = false 
}) => {
    const formatarData = (timestamp: string) => {
        try {
            const data = new Date(timestamp);
            return data.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return 'Data inválida';
        }
    };

    const formatarMotivo = (reason: string) => {
        const motivos: { [key: string]: string } = {
            'FALL': 'Queda detectada',
            'PANIC_BUTTON': 'Botão de pânico',
            'MANUAL': 'Ativação manual',
            'HEALTH': 'Emergência médica',
            'OTHER': 'Outro motivo'
        };
        return motivos[reason] || reason;
    };

    // Ordenar por data mais recente primeiro
    const ocorrenciasOrdenadas = ocorrencias

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">Carregando histórico...</span>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                🕒 Histórico de Ocorrências
            </h2>

            {ocorrenciasOrdenadas.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-6xl text-gray-400 mb-4">🛡️</div>
                    <p className="text-gray-500 text-lg">Nenhuma ocorrência registrada</p>
                </div>
            ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {ocorrenciasOrdenadas.map((ocorrencia, index) => (
                        <div
                            key={ocorrencia.id || index}
                            className={`p-4 border-l-4 rounded-r-lg ${
                                ocorrencia.isInDanger
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-green-500 bg-green-50'
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className="text-xl">
                                        {ocorrencia.isInDanger ? '⚠️' : '✅'}
                                    </span>
                                    <div>
                                        <p className={`font-semibold ${
                                            ocorrencia.isInDanger ? 'text-red-700' : 'text-green-700'
                                        }`}>
                                            {ocorrencia.isInDanger ? 'Situação de Perigo' : 'Situação Resolvida'}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Motivo: {formatarMotivo(ocorrencia.reason)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoricoOcorrencias;