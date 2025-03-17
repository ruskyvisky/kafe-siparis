import React from "react";
import { Coffee, Loader } from "lucide-react";

const UnderConstruction = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-brown-100 text-brown-900">
      <div className="bg-brown-200 p-6 rounded-2xl shadow-lg flex flex-col items-center">
        <Coffee size={64} className="text-brown-700 mb-4" />
        <h1 className="text-3xl font-bold">Bu ekran hala tasarımdadır</h1>
        <p className="mt-2 text-lg">Yakında sizlerle olacak. Bir kahve eşliğinde bekleyin!</p>
        <Loader size={48} className="animate-spin mt-4 text-brown-600" />
      </div>
    </div>
  );
};

export default UnderConstruction;
