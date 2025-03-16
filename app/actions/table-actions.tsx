"use server";
import { createClient } from '../utils/supabase';
import { revalidatePath } from 'next/cache';

// Type definitions
interface TableData {
  table_number: string;
}

interface OrderItem {
  order_item_id: number;
  order_id: number;
  product_id: number;
  urun_id?: number;
  quantity: number;
  urun_fiyat?: number;
  urun_ad?: string;
  [key: string]: any; // For any additional properties
}

interface Order {
  order_id: number;
  table_id: string;
  status: string;
  orderTime?: string;
  created_at?: string;
  items?: OrderItem[];
  [key: string]: any; // For any additional properties
}

interface Product {
  id: number;           // menu tablosunda id olarak geliyor
  product_id?: number;  // Farklı formatta da gelebilir
  urun_ad: string;
  urun_fiyat: number;
  [key: string]: any;   // For any additional properties
}

interface ProductMap {
  [key: number]: Product;
}

interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function addTable(formData: { table_number: string }): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    
    // FormData'dan değerleri alma
    const table_number = formData.table_number;
    
    if (!table_number) {
      return { success: false, error: "Eksik veya hatalı veri" };
    }
    
    const { data, error } = await supabase
      .from('tables')
      .insert([{ table_number }])
      .select();
    
    if (error) {
      console.error("Supabase Hatası:", error);
      return { success: false, error: error.message };
    }
    
    console.log("Eklenen Veri:", data);

    revalidatePath('/tables'); // Menü sayfanızın yolu
    return { success: true, data };
  } catch (error: any) {
    console.error("Hata:", error);
    return { success: false, error: error.message || "Bir hata oluştu" };
  }
}

export async function getOrdersForTable(tableId: string): Promise<Order[]> {
  const supabase = await createClient();
  try {
    console.log('Sorgulanan table_id:', tableId);
    
    // Masaya ait siparişleri getir
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('table_id', tableId);

    if (ordersError) {
      console.error('Siparişler alınırken hata oluştu:', ordersError);
      return [];
    }

    console.log('Alınan siparişler:', orders);

    // Tüm menu verilerini bir kerede çek (daha verimli)
    const { data: allProducts, error: productsError } = await supabase
      .from('menu')
      .select('*');
      
    if (productsError) {
      console.error('Menu verileri alınırken hata oluştu:', productsError);
      return [];
    }
    
    // Hızlı erişim için ürün haritası oluştur
    const productMap: ProductMap = {};
    if (allProducts && allProducts.length > 0) {
      allProducts.forEach((product: Product) => {
        // Hem id hem de product_id ile erişilebilir olmasını sağla
        productMap[product.id] = product;
        if (product.product_id) {
          productMap[product.product_id] = product;
        }
      });
    }
    
    console.log('Ürün haritası oluşturuldu:', Object.keys(productMap).length, 'ürün bulundu');
    
    // Her sipariş için ilgili ürünleri getir ve birleştir
    const ordersWithItems: Order[] = await Promise.all(
      orders.map(async (order: Order) => {
        // Sipariş ürünlerini getir
        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.order_id);

        if (itemsError) {
          console.error(`Sipariş #${order.order_id} için ürünler alınırken hata:`, itemsError);
          order.items = [];
          return order;
        }
        
        console.log(`Sipariş #${order.order_id} için ${items.length} ürün bulundu`);
        
        // Ürün bilgilerini ekle
        const itemsWithProductDetails: OrderItem[] = items.map((item: OrderItem) => {
          // Ürün ID'sini belirle (product_id veya urun_id olabilir)
          const productId = item.product_id || item.urun_id;
          
          if (!productId) {
            console.warn(`Ürün ID'si bulunamadı, item:`, item);
            return {
              ...item,
              urun_ad: "Bilinmeyen Ürün",
              urun_fiyat: undefined
            };
          }
          
          // Ürün bilgilerini haritadan bul
          const product = productMap[productId];
          
          if (!product) {
            console.warn(`Ürün bulunamadı, ID: ${productId}`);
            return {
              ...item,
              urun_ad: `Ürün #${productId}`,
              urun_fiyat: undefined
            };
          }
          
          console.log(`Ürün bulundu:`, product);
          
          // Ürün bilgilerini sipariş öğesine ekle
          return {
            ...item,
            urun_ad: product.urun_ad || "İsimsiz Ürün",
            urun_fiyat: product.urun_fiyat,
            // price alanını da ekle (frontend'in iki formattan birini kullanabilmesi için)
            price: product.urun_fiyat
          };
        });

        // Ürün detaylarını içeren sipariş
        order.items = itemsWithProductDetails;
        return order;
      })
    );

    console.log('Tüm siparişler işlendi, döndürülüyor...');
    return ordersWithItems;

  } catch (error) {
    console.error('Veri çekme sırasında bir hata oluştu:', error);
    return [];
  }
}

export async function getTables(): Promise<ActionResponse<TableData[]>> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('tables')
      .select('table_number');
      
    if (error) {
      throw new Error(error.message);
    }
    
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}