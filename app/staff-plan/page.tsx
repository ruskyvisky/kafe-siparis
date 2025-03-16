// pages/index.tsx
"use client"
import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRef } from 'react';
import Head from 'next/head';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

// Tip tanımlamaları
interface Employee {
  id: string;
  name: string;
}

interface ScheduleItem {
  id: string;         // Benzersiz kimlik
  type: 'employee' | 'break' | 'leave';
  employeeId: string; // Çalışan ID'si
  name: string;       // Görüntülenecek isim
}

interface ScheduleCell {
  items: ScheduleItem[];
}

interface ScheduleData {
  [key: string]: ScheduleCell;
}

interface EmployeeItemProps {
  id: string;
  name: string;
  color: string;
}

interface TimeSlotCellProps {
  day: string;
  time: string;
  scheduleData: ScheduleData;
  onDrop: (itemType: string, employeeId: string, employeeName: string, day: string, time: string) => void;
  onItemRemove: (day: string, time: string, itemId: string) => void;
}

// Saat dilimleri (30 dakikalık aralıklarla)
const timeSlots: string[] = [];
for (let hour = 8; hour <= 18; hour++) {
  timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
}

// Renkler
const itemColors: {[key: string]: string} = {
  'employee': '#BBDEFB', // Mavi
  'break': '#FFECB3',    // Sarı
  'leave': '#FFCDD2'     // Kırmızı
};

// Çalışan kartı bileşeni
const EmployeeItem: React.FC<EmployeeItemProps> = ({ id, name, color }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: color,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 mb-2 rounded shadow cursor-move border border-gray-200"
    >
      {name}
    </div>
  );
};

// Her bir zaman dilimi hücresi
const TimeSlotCell: React.FC<TimeSlotCellProps> = ({ day, time, scheduleData, onDrop, onItemRemove }) => {
  const cellKey = `${day}-${time}`;
  const cell = scheduleData[cellKey] || { items: [] };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const itemType = e.dataTransfer.getData('itemType');
    const employeeId = e.dataTransfer.getData('employeeId');
    const employeeName = e.dataTransfer.getData('employeeName');
    onDrop(itemType, employeeId, employeeName, day, time);
  };
  
  const handleItemRemove = (itemId: string) => {
    onItemRemove(day, time, itemId);
  };
  
  return (
    <div
    className="border border-gray-200 p-1 min-h-12 bg-white"
    onDragOver={handleDragOver}
    onDrop={handleDrop}
    >
      {cell.items.length > 0 && (
        <div className="flex flex-col gap-1">
          {cell.items.map((item) => (
            <div 
            key={item.id} 
            className="text-xs p-1 rounded truncate flex justify-between items-center"
            style={{ backgroundColor: itemColors[item.type] }}
            >
              <span className="truncate flex-grow">{item.name}</span>
              <button 
                onClick={() => handleItemRemove(item.id)}
                className="text-gray-500 hover:text-red-500 ml-1"
                >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Ana sayfa bileşeni
const Home: React.FC = () => {
  const days: string[] = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  
  // Çizelge için bir ref oluştur
  const scheduleRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  
  // Çalışanlar listesi
  const [employees] = useState<Employee[]>([
    { id: 'employee-1', name: 'Ahmet Çelik' },
    { id: 'employee-2', name: 'Ayşe Yılmaz' },
    { id: 'employee-3', name: 'Mehmet Kaya' },
    { id: 'employee-4', name: 'Zeynep Demir' },
    { id: 'employee-5', name: 'Can Şahin' },
  ]);

  // Takvim verisi - {gün-saat: {items: [öğeler]} formatında
  const [scheduleData, setScheduleData] = useState<ScheduleData>({});

  // DnD sensörleri
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Takvime öğe ekleme
  const handleDrop = (itemType: string, employeeId: string, employeeName: string, day: string, time: string): void => {
    const cellKey = `${day}-${time}`;
    const existingCell = scheduleData[cellKey] || { items: [] };
    
    // Benzersiz ID oluştur
    const uniqueId = `${itemType}-${employeeId}-${Date.now()}`;
    
    // Yeni öğeyi ekle - Mola veya İzin ise çalışan adı ekle
    let displayName = employeeName;
    if (itemType === 'break') {
      displayName = `${employeeName} - Mola`;
    } else if (itemType === 'leave') {
      displayName = `${employeeName} - İzin`;
    }
    
    const newItem: ScheduleItem = {
      id: uniqueId,
      type: itemType as 'employee' | 'break' | 'leave',
      employeeId: employeeId,
      name: displayName
    };
    
    // Varolan hücreye öğeyi ekle
    const updatedItems = [...existingCell.items, newItem];
    
    setScheduleData({
      ...scheduleData,
      [cellKey]: { items: updatedItems }
    });
  };

  // Takvimden öğe kaldırma
  const handleItemRemove = (day: string, time: string, itemId: string): void => {
    const cellKey = `${day}-${time}`;
    const cell = scheduleData[cellKey];
    
    if (cell && cell.items.length) {
      const updatedItems = cell.items.filter(item => item.id !== itemId);
      
      const updatedScheduleData = { ...scheduleData };
      
      if (updatedItems.length === 0) {
        // Hücre boşsa tamamen kaldır
        delete updatedScheduleData[cellKey];
      } else {
        // Değilse öğeleri güncelle
        updatedScheduleData[cellKey] = { items: updatedItems };
      }
      
      setScheduleData(updatedScheduleData);
    }
  };

  // PDF indirme fonksiyonu
  const downloadPDF = async () => {
    setIsGeneratingPDF(true);
    console.log("PDF indirme başlatıldı");
    
    // Referans kontrolü
    if (!scheduleRef.current) {
      console.error("Çizelge referansı bulunamadı!");
      alert("Çizelge referansı bulunamadı. Lütfen sayfayı yenileyin.");
      setIsGeneratingPDF(false);
      return;
    }
    
    try {
      // Kullanıcıya bilgi ver
      alert("PDF hazırlanıyor. Bu işlem biraz zaman alabilir.");
      console.log("Canvas oluşturuluyor...");
      
      // HTML2Canvas ile çizelgeyi görüntüye dönüştürme
      const canvas = await html2canvas(scheduleRef.current, {
        scale: 3, // Daha yüksek kalite
        useCORS: true,
        logging: true, // Hata ayıklama için logları etkinleştir
        backgroundColor: '#ffffff',
        scrollX: 0,
        allowTaint: true,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,

      });
      
      console.log("Canvas oluşturuldu, PDF hazırlanıyor...");
      
      // Canvas boyutları
      const imgWidth = 210; // A4 genişliği (mm)
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      // PDF oluşturma
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // PDF'e başlık ekle
      pdf.setFontSize(14);
      pdf.text('Hafta Plan', 105, 15, { align: 'center' ,  });
      const today = new Date();
      pdf.setFontSize(10);
      pdf.text(`Olusturulma Tarihi: ${today.toLocaleDateString('tr-TR')}`, 10, 10);

      // PDF'e görüntü ekleme
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 20, imgWidth, imgHeight);
      
      
      console.log("PDF oluşturuldu, indirme başlatılıyor...");
      
      // PDF'i indirme
      pdf.save('calisan-cizelgesi.pdf');
      
      console.log("PDF indirme tamamlandı");
    } catch (error) {
      console.error("PDF oluşturma hatası:", error);
      alert("PDF oluşturulurken bir hata oluştu: " + (error as Error).message);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Çalışan Zaman Çizelgesi</title>
        <meta name="description" content="Çalışanların zaman çizelgesi planlaması" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main  className="container mx-auto py-6 px-4">
        
        <h1 className="text-3xl font-bold text-center mb-8">Çalışan Haftalık Çizelgesi</h1>
            <div className='flex justify-end mb-4'>
            <button 
            onClick={downloadPDF}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded shadow-sm transition"
          >
            <FontAwesomeIcon icon={faFilePdf} style={{paddingRight:8}}/>
            PDF İndir
          </button>
          </div>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Çalışanlar listesi - Sol tarafta */}
          <div className="text-right mb-4">
      
        </div>
          <div className=" lg:w-64 bg-white p-4 rounded shadow">
            
            <h2 className="text-xl font-semibold mb-4">Çalışanlar</h2>
            
            {/* Çalışanlar */}
            <DndContext 
            
              sensors={sensors}
              collisionDetection={closestCenter}
            >
              <SortableContext
                items={employees.map(e => e.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2 mb-6" >
                  {employees.map((employee) => (
                    <div key={employee.id} className="employee-card">
                      <div 
                        draggable 
                        onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
                          e.dataTransfer.setData('itemType', 'employee');
                          e.dataTransfer.setData('employeeId', employee.id);
                          e.dataTransfer.setData('employeeName', employee.name);
                        }}
                        className="p-2 bg-white border border-gray-200 rounded shadow cursor-move hover:bg-gray-50"
                        style={{ backgroundColor: itemColors['employee'] }}
                      >
                        {employee.name}
                      </div>
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {/* Özel durum kartları */}
            <h2 className="text-xl font-semibold mb-4 mt-6">Eylemler</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Önce bir çalışan seçin, sonra eylem ekleyin:</p>
              
              <div className="grid grid-cols-1 gap-y-4 mt-4" >
                {employees.map(employee => (
                  <div key={`actions-${employee.id}`} className="space-y-2">
                    <div className="p-2 bg-gray-100 rounded font-medium">{employee.name}</div>
                    <div className="flex gap-2">
                      <div 
                        draggable 
                        onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
                          e.dataTransfer.setData('itemType', 'break');
                          e.dataTransfer.setData('employeeId', employee.id);
                          e.dataTransfer.setData('employeeName', employee.name);
                        }}
                        className="p-2 rounded shadow cursor-move border border-gray-200 flex-1 text-center"
                        style={{ backgroundColor: itemColors['break'] }}
                      >
                        Mola
                      </div>
                      <div 
                        draggable 
                        onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
                          e.dataTransfer.setData('itemType', 'leave');
                          e.dataTransfer.setData('employeeId', employee.id);
                          e.dataTransfer.setData('employeeName', employee.name);
                        }}
                        className="p-2 rounded shadow cursor-move border border-gray-200 flex-1 text-center"
                        style={{ backgroundColor: itemColors['leave'] }}
                      >
                        İzin
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-3 bg-gray-100 rounded">
              <p className="text-sm text-gray-700">Çalışanları ve eylemleri takvime sürükleyip bırakabilirsiniz.</p>
              <p className="text-sm text-gray-700 mt-2">Bir zaman diliminde birden fazla çalışan veya eylem olabilir.</p>
            </div>
          </div>

          {/* Haftalık program - Sağ tarafta (büyük alan) */}
          <div className="flex-grow overflow-x-auto" ref={scheduleRef}  >
            <div className="min-w-max" >
              {/* Günler başlıkları */}
              <div className="grid grid-cols-8 gap-1" >
                <div className="w-24"></div> {/* Saat sütunu için boş hücre */}
                {days.map(day => (
                  <div  key={day} className="text-center font-medium p-2 bg-blue-100 rounded">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Zaman çizelgesi */}
              {timeSlots.map(time => (
                <div key={time} className="grid grid-cols-8 gap-1" >
                  <div className="w-24 text-right pr-2 py-1 font-medium" >{time}</div>
                  {days.map(day => (
                    <TimeSlotCell 
                    
                      key={`${day}-${time}`} 
                      day={day} 
                      time={time} 
                      
                      scheduleData={scheduleData}
                      onDrop={handleDrop}
                      onItemRemove={handleItemRemove}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;