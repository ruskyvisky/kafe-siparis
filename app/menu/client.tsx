'use client';

import React from 'react'
import { useState, useEffect } from 'react';
import Table from '../components/tables/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import ProductAdd from '../components/modals/product-add-modal/modal';

export default function ClientMenu({ urunler, tableColumns , category }: { urunler: any, tableColumns: any, category: any }) {

     const [showModal, setShowModal] = useState(false);
    
        const openModal = () =>{
          setShowModal(true)
        }
    
      
  return (
    <div className='p-5'>
            <div className="flex justify-end items-center pb-5">
              <button onClick={openModal} className="bg-emerald-500 text-white font-bold text-sm px-3 py-2  rounded-lg shadow-md hover:bg-emerald-600 flex items-center gap-2 transition-all duration-150">
                <FontAwesomeIcon icon={faPlus} /> Ürün Ekle
              </button>
              <ProductAdd showModal={showModal} setShowModal={setShowModal} categories={category} />
            </div>
      <Table
        color="light"
        tableTitle="Ürün Listesi"
        tableColumns={tableColumns}
        tableRows={urunler}
      />
    </div>
  )


}

