"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();
  
  // Masa bilgisini URL'den almak (örneğin customer-menu/Masa-1)
  const masa = pathname?.split("/")[2]; // "Masa-1" gibi bir değer bekleniyor.

  useEffect(() => {
    if (!initialProducts || initialProducts.length === 0) {
      setProducts([]);
      return;
    }
    
    const productsWithQuantity = initialProducts.map((product: any) => ({
      ...product,
      quantity: 0
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
  const totalPrice = products.reduce((sum, product) => {
    const price = parseFloat(product.urun_fiyat) || 0;
    return sum + price * product.quantity;
  }, 0).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Ürünlerimiz</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
        {/* Masa bilgisini burada gösteriyoruz */}
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
        <button className="w-full mt-4 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Sepeti Onayla
        </button>
      </div>
    </div>
  );
}
