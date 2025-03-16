"use client"

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getOrdersForTable } from '../../actions/table-actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import QRModal from '../../components/modals/qr-modal/qr-modal';
// Tip Tanımlamaları
interface OrderItem {
  order_item_id: number;
  order_id: number;
  product_id: number;
  urun_id?: number;
  urun_ad: string;
  quantity: number;
  urun_fiyat?: number;
  [key: string]: any; // Diğer olası alanlar için
}

interface Product {
  id: number;
  urun_ad: string;
  urun_fiyat: number;
  [key: string]: any;
}

interface Order {
  order_id: number;
  orderTime?: string;
  created_at?: string; // Veritabanında orderTime yerine created_at olabilir
  status: string;
  items: OrderItem[];
  [key: string]: any; // Diğer olası alanlar için
}

const Page = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // URL'den masa numarasını al
  const pathname = usePathname();
  // URL formatı: /masa/Masa-1, /masa/Masa-2, vs. olarak kabul ediyoruz
  const tableIdMatch = pathname.match(/Masa-(\d+)$/);
  const tableId = tableIdMatch ? tableIdMatch[1] : "1"; // Varsayılan olarak 1
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Konsola debugging bilgisi
        console.log('Masa ID ile sorgu yapılıyor:', tableId);
        
        // Backend'den siparişleri al
        const data = await getOrdersForTable(tableId);
        
        // Veriyi detaylı inceleyin
        console.log('Siparişler ham veri:', JSON.stringify(data, null, 2));
        
        // Veriyi kontrol et ve dönüştür
        const formattedOrders = data.map((order: any) => {
          // Eğer created_at varsa ve orderTime yoksa, created_at'i orderTime olarak kullan
          if (!order.orderTime && order.created_at) {
            order.orderTime = new Date(order.created_at).toLocaleString('tr-TR');
          }
          
          // items dizisini kontrol et
          if (!order.items || !Array.isArray(order.items)) {
            order.items = [];
          }
          
          // Her öğeyi incele ve fiyat bilgisini ekle
          order.items = order.items.map((item: any) => {
            console.log('İşlenen ürün verisi:', item);
            
            // Ürün nesnesini kontrol et
            // 'menu' tablosundan gelen bilgiler olabilir
            const product = item.product || {};
            
            return {
              ...item,
              urun_ad: item.urun_ad || product.urun_ad || 'Bilinmiyor',
              // Fiyat bilgisi için önce product.urun_fiyat'ı kontrol et
              urun_fiyat: product.urun_fiyat  || 50 // Varsayılan fiyat
            };
          });
          
          return order as Order;
        });
        
        console.log('Düzenlenmiş siparişler:', formattedOrders);
        setOrders(formattedOrders);
      } catch (err) {
        console.error('Siparişler alınırken hata:', err);
        setError('Siparişler alınırken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    
    if (tableId) {
      fetchOrders();
    }
  }, [tableId]);

  // Tarih formatını düzeltmek için yardımcı fonksiyon
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Belirtilmemiş';
    
    try {
      return new Date(dateString).toLocaleString('tr-TR');
    } catch (e) {
      return dateString;
    }
  };
  
  // Tek bir sipariş için toplam tutarı hesapla
  const calculateOrderTotal = (order: Order) => {
    let total = 0;
    order.items.forEach(item => {
      console.log("fiyat" ,order.items)
      // Fiyat bilgisini al
      const price = item.price || 50  // Varsayılan 50 TL
      total += price * item.quantity;
    });
    return total.toFixed(2);
  };
  
  // Tüm siparişler için toplam tutarı hesapla
  const calculateTotal = () => {
    let total = 0;
    orders.forEach(order => {
      order.items.forEach(item => {
        const price = item.price || 50;
        total += price * item.quantity;
      });
    });
    return total.toFixed(2);
  };
  
  // Tek bir sipariş için ödeme işlemi
  const handleOrderPayment = (order: Order) => {
    const orderTotal = calculateOrderTotal(order);
    alert(`Sipariş #${order.order_id} için toplam tutar: ${orderTotal} TL. Ödeme işlemi başlatılıyor...`);
    // Gerçek bir uygulamada burada backend'e ödeme isteği gönderilir
  };

  // Tüm siparişler için ödeme işlemi
  const handlePayment = () => {
    alert(`Toplam Tutar: ${calculateTotal()} TL. Tüm siparişler için ödeme işlemi başlatılıyor...`);
    // Gerçek bir uygulamada burada backend'e ödeme isteği gönderilir
  };
  const [showQRModal, setShowQRModal] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <div className='flex justify-between items-center'>
        
      <h1 className="text-xl font-bold mb-4">Masa {tableId} Siparişleri</h1>
      <button
                    className=" bg-blue-500 hover:bg-blue-600 text-white font-medium p-3 rounded transition-colors my-4"
                    onClick={() => setShowQRModal(true)}
                  >
                    <FontAwesomeIcon icon={faQrcode} className="mr-2" />
                    QR Görüntüle
                  </button>
                  <QRModal
        tableId={"Masa-"+tableId}
        qrValue={`https://kafe-yonetim.vercel.app/customer-menu/Masa-${tableId}`}
        showModal={showQRModal}
        setShowModal={setShowQRModal}
   
      />
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <p className="text-gray-600">Yükleniyor...</p>
      ) : (
        <div className="orders-list space-y-4">
          {orders.length === 0 ? (
            <p className="text-gray-600">Henüz sipariş alınmamış.</p>
          ) : (
            <>
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="font-medium">Masa {tableId}</p>
                <p className="text-sm text-gray-600">Toplam {orders.length} aktif sipariş</p>
              </div>
              
              {orders.map((order) => (
                <div key={order.order_id} className="order-card bg-white shadow-md rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold">Sipariş #{order.order_id}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Sipariş Zamanı:</strong> {formatDate(order.orderTime || order.created_at)}
                  </p>
                  
                  <div className="mt-3">
                    <h3 className="font-medium mb-2">Sipariş Detayları:</h3>
                    <ul className="divide-y divide-gray-200">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item) => (
                          <li key={item.order_item_id} className="py-2 flex justify-between">
                            <span>{item.urun_ad}</span>
                            <span className="flex items-center">
                              <span className="mr-2">{item.quantity} Adet</span>
                            </span>
                          </li>
                        ))
                      ) : (
                        <li className="py-2 text-gray-500">Ürün bilgisi bulunamadı.</li>
                      )}
                    </ul>
                  </div>

                  <div className="mt-4 border-t pt-3">
                    <div className="flex justify-between font-medium">
                      <span>Sipariş Toplamı:</span>
                      <span>{calculateOrderTotal(order)} TL</span>
                    </div>
                    
                    <div className="mt-3 flex gap-2">
                      <button
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded text-sm transition-colors"
                        onClick={() => handleOrderPayment(order)}
                      >
                        Bu Siparişi Öde
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-6 bg-white shadow-md rounded-lg p-4 border border-gray-200">
                <h2 className="font-bold text-lg mb-2">Toplam Hesap Özeti</h2>
                <div className="flex justify-between border-b pb-2 mb-2">
                  <span>Tüm Siparişler Toplamı:</span>
                  <span className="font-bold">{calculateTotal()} TL</span>
                </div>
                
                <div className="flex gap-3 mt-4">
                  <button
                    className="w-1/2 bg-green-500 hover:bg-green-600 text-white font-medium p-3 rounded transition-colors"
                    onClick={handlePayment}
                  >
                    Tümünü Öde
                  </button>
                  
                  
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;