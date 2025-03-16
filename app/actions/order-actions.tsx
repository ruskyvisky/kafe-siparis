"use server";

import { createClient } from "../utils/supabase";
import { revalidatePath } from "next/cache";

export async function addOrder(formData: FormData) {
  console.log("Server action çalıştı");

  try {
    const supabase = await createClient();

    // FormData'dan değerleri alma
    const tableIdRaw = formData.get("table_id") as string;
    // "Masa-1" formatından sayısal değeri çıkarma
    const tableNumber = tableIdRaw.split("-")[1];
    const table_id = parseInt(tableNumber);

    // Eksik veya hatalı veri kontrolü
    if (isNaN(table_id)) {
      console.error("Geçersiz masa ID'si:", tableIdRaw);
      return { success: false, error: "Eksik veya hatalı masa ID'si" };
    }

    console.log("Table ID:", table_id);

    // FormData'dan tüm girdileri alıyoruz ve işlenecek ürünleri belirliyoruz
    const formEntries = Array.from(formData.entries());
    const productEntries = [];
    
    for (const [key, value] of formEntries) {
      if (key.startsWith("menu_id_")) {
        const index = key.split("_")[2]; // Doğru index'i alıyoruz
        const product_id = parseInt(value as string);
        const quantity = parseInt(formData.get(`quantity_${index}`) as string);

        if (!isNaN(product_id) && !isNaN(quantity) && quantity > 0) {
          productEntries.push({ product_id, quantity });
        }
      }
    }

    if (productEntries.length === 0) {
      console.error("Eklenecek ürün bulunamadı");
      return { success: false, error: "Eklenecek ürün bulunamadı" };
    }

    console.log("Eklenecek ürünler:", productEntries);

    // 1. Önce yeni sipariş oluştur ve order_id değerini al
    const { data: newOrder, error: orderError } = await supabase
      .from("orders")
      .insert([{ table_id, status: true }])
      .select()
      .single();

    if (orderError) {
      console.error("Sipariş oluşturma hatası:", orderError);
      return { success: false, error: orderError.message };
    }

    if (!newOrder || !newOrder.order_id) {
      console.error("Sipariş ID'si alınamadı");
      return { success: false, error: "Sipariş ID'si alınamadı" };
    }

    console.log("Yeni Sipariş:", newOrder);

    // 2. Sipariş ID'sini kullanarak sipariş öğelerini ekle
    const order_id = newOrder.order_id;
    
    const itemsToInsert = productEntries.map(item => ({
      order_id: order_id,
      product_id: item.product_id,
      quantity: item.quantity
    }));

    console.log("Eklenecek sipariş öğeleri:", itemsToInsert);

    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsToInsert)
      .select();

    if (itemsError) {
      console.error("Sipariş kalemi ekleme hatası:", itemsError);
      return { success: false, error: itemsError.message };
    }

    console.log("Eklenen Sipariş Kalemleri:", orderItems);

    // Siparişler sayfasının önbelleğini temizle
    revalidatePath("/orders");

    return { success: true, data: { order: newOrder, items: orderItems } };
  } catch (error: any) {
    console.error("Hata:", error);
    return { success: false, error: error.message || "Bir hata oluştu" };
  }
}