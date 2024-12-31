interface DangerLabelProps {
    emPerigo: boolean;
}

const DangerLabel: React.FC<DangerLabelProps> = ({ emPerigo }) => {
    return (
        <div className="p-4">
            {emPerigo ? (
                <span className="px-4 py-2 font-bold text-white bg-red-500 rounded">
                    Usuário em Perigo
                </span>
            ) : (
                <span className="px-4 py-2 font-bold text-white bg-green-500 rounded">
                    Usuário Seguro
                </span>
            )}
        </div>
    );
};

export default DangerLabel;
