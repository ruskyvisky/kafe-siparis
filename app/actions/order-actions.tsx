"use server";

import { createClient } from "../utils/supabase";
import { revalidatePath } from "next/cache";

export async function addOrder(formData: any) {
  console.log("Server action çalıştı");

  try {
    const supabase = await createClient();

    // FormData'dan değerleri alma
    const table_id = parseInt(formData.table_id);
    const menu_id = parseInt(formData.menu_id);
    const quantity = parseInt(formData.quantity);

    // Eksik veya hatalı veri kontrolü
    if (isNaN(table_id) || isNaN(menu_id) || isNaN(quantity) || quantity <= 0) {
      return { success: false, error: "Eksik veya hatalı veri" };
    }

    // 1️⃣ **Masanın açık bir siparişi var mı?**
    let { data: existingOrder, error: orderCheckError } = await supabase
      .from("orders")
      .select("id")
      .eq("table_id", table_id)
      .eq("status", "active")
      .single();

    if (orderCheckError && orderCheckError.code !== "PGRST116") {
      // "PGRST116" => Sonuç bulunamadığında dönen hata
      console.error("Sipariş sorgu hatası:", orderCheckError);
      return { success: false, error: orderCheckError.message };
    }

    let order_id;

    // 2️⃣ **Eğer açık sipariş yoksa, yeni sipariş oluştur**
    if (!existingOrder) {
      const { data: newOrder, error: newOrderError } = await supabase
        .from("orders")
        .insert([{ table_id }])
        .select()
        .single();

      if (newOrderError) {
        console.error("Yeni sipariş oluşturma hatası:", newOrderError);
        return { success: false, error: newOrderError.message };
      }

      order_id = newOrder.id;
    } else {
      order_id = existingOrder.id;
    }

    // 3️⃣ **Sipariş kalemlerini `order_items` tablosuna ekle**
    const { data, error } = await supabase
      .from("order_items")
      .insert([{ order_id, menu_id, quantity }])
      .select();

    if (error) {
      console.error("Sipariş kalemi ekleme hatası:", error);
      return { success: false, error: error.message };
    }

    console.log("Eklenen Sipariş Kalemi:", data);

    // Siparişler sayfasının önbelleğini temizle
    revalidatePath("/orders");

    return { success: true, data };
  } catch (error: any) {
    console.error("Hata:", error);
    return { success: false, error: error.message || "Bir hata oluştu" };
  }
}
