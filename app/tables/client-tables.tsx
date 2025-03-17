"use client"
import Link from "next/link";
import { useState } from "react";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addTable } from "../actions/table-actions";

export default function TableList({ tables }: any) {
  const [formData, setFormData] = useState({
    table_number: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddTable = async () => {
    if (formData.table_number.trim() === "") {
      alert("Lütfen masa numarası giriniz.");
      return;
    }
    
    const result = await addTable(formData);
    
    if (result.success) {
      // Reset form after successful addition
      setFormData({ table_number: "" });
    } else {
      alert(`Hata: ${result.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="max-w-3xl">
        <div className="flex items-center justify-end mb-4">
          <input
            name="table_number"
            id="table_number"
            type="text"
            value={formData.table_number}
            onChange={handleInputChange}
            placeholder="Masa Numarası"
            className="px-4 py-2 m-4 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button 
            onClick={handleAddTable}
            className="bg-green-500 ml-4 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
          >
            <FontAwesomeIcon icon={faPlus} style={{paddingRight:4}} />
            Masa Ekle
          </button>
        </div>
        {tables.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">Henüz eklenmiş bir masa bulunmamakta.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {tables.map((table: any) => (
              <div key={table.table_id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition flex justify-between items-center">
                <Link href={`/tables/${table.table_number}`} className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-700 text-center">{table.table_number}</h3>
                </Link>
                <div className="flex gap-2">
                  <button className="text-blue-500 hover:text-blue-700">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}