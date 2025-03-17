'use client';

import React from 'react'
import { useState, useEffect } from 'react';
import Table from '../components/tables/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { addCategory } from '../actions/product-actions';

export default function ClientMenu({ categories, tableColumns  }: { categories: any, tableColumns: any, }) {

     const [formData, setFormData] = useState({
      category_name: "",
    });
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };
  
 
      const handleAddTable = async () => {
        if (FormData.name.trim() === "") {
          alert("Lütfen Kategori  giriniz.");
          return;
        }
        
        const result = await addCategory(formData);
        
        if (result.success) {
          // Reset form after successful addition
          setFormData({ category_name: "" });
        } else {
          alert(`Hata: ${result.error}`);
        }
      };
    
      
  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-end p-6 '>
      <div className=' max-w-3xl'>
        
            <div className="flex justify-end items-center pb-5">
              
          <input
            name="category_name"
            id="category_name"
            type="text"
            value={formData.category_name}
            onChange={handleInputChange}
            placeholder="Kategori İsmi"
            className="px-4 py-2  m-4 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button 
            onClick={handleAddTable}
            className="bg-green-500 ml-4 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
          >
            <FontAwesomeIcon icon={faPlus} style={{paddingRight:4}} />
            Kategori Ekle
          </button>
          </div>
            </div>
      <Table
        color="light"
        tableTitle="Kategori Listesi"
        tableColumns={tableColumns}
        tableRows={categories}
        
      />
    </div>
  )


}

