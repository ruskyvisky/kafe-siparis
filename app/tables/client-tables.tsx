import Link from "next/link";

import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function TableList({ tables }: any) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-3xl">
        <div className="flex justify-end mb-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition">
          <FontAwesomeIcon icon={faPlus} style={{paddingRight:4}} />
          Masa Ekle
          </button>
        </div>
        {tables.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">Henüz eklenmiş bir masa bulunmamakta.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tables.map((table: any) => (
              <div key={table.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition flex justify-between items-center">
                <Link href={`/tables/${table.table_name}`} className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-700 text-center">{table.table_name}</h3>
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
