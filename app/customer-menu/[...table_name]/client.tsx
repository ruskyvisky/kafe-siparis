"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { addOrder } from "@/app/actions/order-actions";

interface Product {
  id: any;
  urun_ad: any;
  urun_fiyat: any;
  kategory_id: {
    category_name: any;
  };
}

interface ProductWithQuantity extends Product {
  quantity: any;
}

interface CustomerMenuProps {
  products: any;
}

export default function CustomerMenu({ products: initialProducts }: CustomerMenuProps) {
  const [products, setProducts] = useState<ProductWithQuantity[]>([]);
  const [orderStatus, setOrderStatus] = useState<{
    message: string;
    isError: boolean;
    isVisible: boolean;
  }>({
    message: "",
    isError: false,
    isVisible: false,
  });
  const pathname = usePathname();
  const masa = pathname?.split("/")[2]; // "Masa-1" gibi bir değer bekleniyor.

  useEffect(() => {
    if (!initialProducts || initialProducts.length === 0) {
      setProducts([]);
      return;
    }

    const productsWithQuantity = initialProducts.map((product: any) => ({
      ...product,
      quantity: 0,
    }));

    setProducts(productsWithQuantity);
  }, [initialProducts]);

  const increaseQuantity = (id: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, quantity: product.quantity + 1 } : product
      )
    );
  };

  const decreaseQuantity = (id: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id && product.quantity > 0
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )
    );
  };

  const totalItems = products.reduce((sum, product) => sum + product.quantity, 0);
  const totalPrice = products
    .reduce((sum, product) => {
      const price = parseFloat(product.urun_fiyat) || 0;
      return sum + price * product.quantity;
    }, 0)
    .toFixed(2);

  // FormData'yı hazırlama ve gönderme
  const handleSubmit = async () => {
    // Sepette ürün olup olmadığını kontrol et
    if (totalItems === 0) {
      setOrderStatus({
        message: "Lütfen sepete en az bir ürün ekleyin",
        isError: true,
        isVisible: true,
      });
      setTimeout(() => {
        setOrderStatus((prev) => ({ ...prev, isVisible: false }));
      }, 3000);
      return;
    }

    const formData = new FormData();

    // Masa bilgisi
    formData.append("table_id", masa || "Bilinmiyor");

    // Sepetteki her ürünü ekleyin
    const selectedProducts = products.filter((product) => product.quantity > 0);
    selectedProducts.forEach((product, index) => {
      formData.append(`menu_id_${index}`, product.id.toString());
      formData.append(`quantity_${index}`, product.quantity.toString());
    });

    // FormData'yı dökümleme (kontrol amaçlı)
    console.log("Form Data Entries:", [...formData.entries()]);

    // Veriyi API'ye gönderme
    try {
      const response = await addOrder(formData);
      console.log("Sipariş yanıtı:", response);
      
      if (response.success) {
        // Sipariş başarıyla gönderildi, ürün miktarlarını sıfırla
        setProducts((prevProducts) =>
          prevProducts.map((product) => ({ ...product, quantity: 0 }))
        );
        
        setOrderStatus({
          message: "Siparişiniz başarıyla alındı!",
          isError: false,
          isVisible: true,
        });
      } else {
        setOrderStatus({
          message: `Hata: ${response.error || "Sipariş gönderilemedi"}`,
          isError: true,
          isVisible: true,
        });
      }
      
      setTimeout(() => {
        setOrderStatus((prev) => ({ ...prev, isVisible: false }));
      }, 3000);
    } catch (error) {
      console.error("Sipariş gönderme hatası:", error);
      setOrderStatus({
        message: "Sipariş gönderme hatası oluştu",
        isError: true,
        isVisible: true,
      });
      setTimeout(() => {
        setOrderStatus((prev) => ({ ...prev, isVisible: false }));
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {orderStatus.isVisible && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
            orderStatus.isError ? "bg-red-500" : "bg-green-500"
          } text-white z-50`}
        >
          {orderStatus.message}
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Ürünlerimiz</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-4">
                <div className="w-full h-48 bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-500">
                  Ürün Görseli
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{product.urun_ad}</h2>
                <p className="text-gray-600 mt-2">
                  {product.kategory_id?.category_name || "Kategori bilgisi yok"}
                </p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">{product.urun_fiyat} TL</span>
                  <div className="flex items-center">
                    <button
                      onClick={() => decreaseQuantity(product.id)}
                      className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-l font-bold hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      -
                    </button>
                    <span className="w-12 h-8 inline-flex items-center justify-center bg-gray-100 text-gray-800 font-medium">
                      {product.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(product.id)}
                      className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-r font-bold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 shadow-md w-full sticky bottom-0 left-0 border-t border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Sepet Özeti</h2>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Masanız:</span>
          <span className="font-medium">{masa || "Bilinmiyor"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Toplam ürün:</span>
          <span className="font-medium">{totalItems} adet</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-600">Toplam tutar:</span>
          <span className="font-bold text-lg">{totalPrice} TL</span>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 "
          disabled={totalItems === 0}
        >
          Sepeti Onayla
        </button>
      </div>
    </div>
  );
}