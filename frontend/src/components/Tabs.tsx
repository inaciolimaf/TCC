import React, { useState } from "react";
import RealTimeAudio from "./RealTimeAudio";
import HistoricoOcorrencias from "./HistóricoOccurence";
import { Occurence } from "@/interfaces/Occurence";

interface TabsProps {
  token: string;
  ocorrencias: Occurence[];
}

const Tabs: React.FC<TabsProps> = ({ token, ocorrencias }) => {
  const [activeTab, setActiveTab] = useState("audio");

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mt-6">
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 font-semibold focus:outline-none ${activeTab === "audio" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("audio")}
        >
          Áudio em tempo real
        </button>
        <button
          className={`ml-4 px-4 py-2 font-semibold focus:outline-none ${activeTab === "historico" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("historico")}
        >
          Histórico de ocorrências
        </button>
      </div>
      <div>
        {activeTab === "audio" && token && <RealTimeAudio token={token} />}
        {activeTab === "historico" && <HistoricoOcorrencias ocorrencias={ocorrencias} />}
      </div>
    </div>
  );
};

export default Tabs;
