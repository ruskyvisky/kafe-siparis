"use client"

import React from 'react'
import QRCode from 'react-qr-code'
import { usePathname } from 'next/navigation'

const QRModal = ({
  showModal,
  setShowModal,
  tableId,
  qrValue: externalQrValue, // Dışarıdan QR değeri alabilmek için
}: {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  tableId: string | null;
  qrValue?: string; // İsteğe bağlı olarak dışarıdan değer alabilir
}) => {
  const pathname = usePathname()
  
  // QR değerini belirle - dışarıdan gelen değeri öncelikle kullan
  const qrValue = externalQrValue || (() => {
    // Eğer dışarıdan değer verilmemişse otomatik oluştur
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'kafe-yonetim.vercel.app';
    const extractedTableId = tableId || pathname?.split('/').pop();
    
    // Masa adını Masa-1 gibi kullanmak için, tableId ile masa adı oluşturuluyor
    const tableName = `Masa-${extractedTableId}`;
  
    return `${baseUrl}/customer-menu/${tableName}`;
  })();
  // QR kodu yazdırma işlevi
  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    
    // QR kodunu SVG olarak alabilmek için gerekli
    const svgElement = document.getElementById('qr-code-svg')
    let svgData = ''
    
    if (svgElement) {
      svgData = new XMLSerializer().serializeToString(svgElement)
      // SVG formatını veri url'e dönüştürme
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const svgUrl = URL.createObjectURL(svgBlob)
      
      const extractedTableId = tableId || pathname?.split('/').pop()
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Sipariş QR Kodu</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; }
            .container { margin: 20px auto; max-width: 400px; }
            img { max-width: 100%; height: auto; }
            .info { margin-top: 20px; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Menü QR Kodu</h2>
            <div>
              <img src="${svgUrl}" alt="QR Kod" width="200" height="200" />
            </div>
            <div class="info">
              <p>Masa: ${extractedTableId}</p>
              <p>Bu QR kodu okutarak menüye ulaşabilir ve sipariş verebilirsiniz.</p>
              <p>Tarih: ${new Date().toLocaleString('tr-TR')}</p>
            </div>
          </div>
        </body>
        </html>
      `
      
      printWindow.document.open()
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      
      setTimeout(() => {
        printWindow.print()
      }, 300)
    }
  }

  return (
    <>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div
              className="relative w-auto my-6 mx-auto max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-2xl font-semibold text-blue-600">
                    Sipariş QR Kodu
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto text-center">
                  <div className="my-4 mx-auto p-4 bg-white rounded-lg" style={{ maxWidth: "220px" }}>
                    {qrValue && (
                      <QRCode
                        id="qr-code-svg"
                        value={qrValue}
                        size={200}
                        level="H"
                        bgColor="#FFFFFF"
                        fgColor="#000000"
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      />
                    )}
                  </div>
                  <div className="mt-4 text-gray-600">
                    <p className="font-medium">Masa: {tableId || pathname?.split('/').pop()}</p>
                    <p className="text-sm mt-2">QR kodu okutarak menüye erişebilir ve sipariş verebilirsiniz</p>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-gray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Kapat
                  </button>
                  <button
                    className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={handlePrint}
                  >
                    Yazdır
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black" onClick={() => setShowModal(false)}></div>
        </>
      ) : null}
    </>
  )
}

export default QRModal