"use client"
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Table from "../components/tables/table"
import WorkerModal from "../components/modals/staff-add-modal/modal"
import StaffModal from '../components/modals/staff-add-modal/modal'
const WorkerList = () => {

  const tableColumns = [
    { title: 'İsim', field: 'name' },
    { title: 'Soyisim', field: 'surname' },
    { title: 'Görevi', field: 'job' },
    { title: 'Maaşı', field: 'salary' },
    { title: 'İşlemler', field: 'actions' },
  ]

  const tableRowData = [
    { name: "Ahmet", surname:"test",job:"Şef",salary: "$1,800 USD",},
    { name: "Mehmet", surname:"test",job:"Aşçı",salary: "$1,500 USD",},
    { name: "Ayşe", surname:"test",job:"Garson",salary: "$1,200 USD",},
  ]

    const [showModal, setShowModal] = React.useState(false);

    const openModal = () =>{
      setShowModal(true)
    }

  

  return (
    <div className="p-5">
    {/* Başlık */}
    <div className="flex justify-end items-center pb-5">
      <button onClick={openModal} className="bg-emerald-500 text-white font-bold text-sm px-3 py-2  rounded-lg shadow-md hover:bg-emerald-600 flex items-center gap-2 transition-all duration-150">
        <FontAwesomeIcon icon={faPlus} /> Personel Ekle
      </button>
      <StaffModal setShowModal={setShowModal} showModal={showModal}/>
    </div>

    {/* Personel Listesi Tablosu */}
   <Table color='light' tableTitle='Personel Listesi' tableColumns={tableColumns} tableRows={tableRowData}/>
  </div>
  )
}

export default WorkerList