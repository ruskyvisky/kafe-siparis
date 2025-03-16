import React, { useState } from "react";
import DeleteModal from "../modals/delete-modal/modal";
import { deleteProduct } from "@/app/actions/product-actions";

interface TableColumn {
  title: string;
  field: string;
}

interface TableProps<T> {
  color?: "light" | "dark";
  tableTitle: string;
  tableColumns: TableColumn[];
  tableRows: T[];
  onDelete?: (id: number) => Promise<{ success: boolean, error?: string, data?: any }>;
  onAfterDelete?: () => void;
}

const Table = <T extends Record<string, any>>({
  color = "light",
  tableTitle,
  tableColumns,
  tableRows,
  onDelete,
  onAfterDelete,
}: TableProps<T>) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // İç içe alanlara erişmek için yardımcı fonksiyon
  const getNestedValue = (obj: any, path: string) => {
    // Eğer path içinde {} varsa, iç içe nesne yapısı olduğunu anlıyoruz
    if (path.includes('{') && path.includes('}')) {
      const [parentKey, childKey] = path.split('{');
      const cleanChildKey = childKey.replace('}', '');
      return obj[parentKey] ? obj[parentKey][cleanChildKey] : '';
    }
    // Normal alan ise doğrudan erişim
    return obj[path];
  };

  const handleDeleteClick = (id: number) => {
    setSelectedItemId(id);
    setShowDeleteModal(true);
  };
// sonra bakılcak silme çalışmıyor!
  const handleDelete = async () => {
    if (selectedItemId !== null && onDelete) {
      setIsDeleting(true);
      try {
        const result = await deleteProduct(selectedItemId);
        console.log("Silme işlemi sonucu:", selectedItemId);
        if (result.success) {
          if (onAfterDelete) {
            onAfterDelete();
          }
        } else {
          console.error("Silme işlemi başarısız:", result.error);
          alert(`Silme işlemi başarısız: ${result.error}`);
        }
      } catch (error) {
        console.error("Silme işlemi sırasında hata:", error);
        alert("Silme işlemi sırasında bir hata oluştu");
      } finally {
        setIsDeleting(false);
        setSelectedItemId(null);
      }
    }
  };

  return (
    <>
      <div
        className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${
          color === "light" ? "bg-white" : "bg-blueGray-700 text-white"
        }`}
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3
                className={`font-semibold text-lg ${
                  color === "light" ? "text-blueGray-700" : "text-white"
                }`}
              >
                {tableTitle}
              </h3>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Tablo */}
          <table className="items-center w-full bg-transparent border-collapse table-fixed">
            <thead>
              <tr>
                {tableColumns.map((column) => (
                  <th
                    key={column.field}
                    className={`p-4 border border-solid text-xs font-semibold text-center ${
                      color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-blueGray-600 text-blueGray-200 border-blueGray-500"
                    }`}
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, index) => (
                <tr key={index} className="text-center">
                  {tableColumns.map((column) => (
                    <td
                      key={column.field}
                      className="p-4 border-b-2 text-xs font-semibold text-center"
                    >
                      {column.field === "actions" ? (
                        <div className="flex justify-center gap-2 mt-1">
                          <button 
                            className="bg-red-600 text-white font-bold text-sm px-3 py-2 rounded-lg shadow-md hover:bg-red-800 transition-all duration-150"
                            onClick={() => handleDeleteClick(row.id)}
                            disabled={isDeleting}
                          >
                            {isDeleting && selectedItemId === row.id ? "Siliniyor..." : "Sil"}
                          </button>
                          
                          <button className="bg-blue-500 text-white font-bold text-sm px-3 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-150">
                            Düzenle
                          </button>
                        </div>
                      ) : (
                        getNestedValue(row, column.field)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={handleDelete}
      />
    </>
  );
};

export default Table;