"use server";
import { createClient } from '../utils/supabase';
import { revalidatePath } from 'next/cache';


export async function addProduct(formData:any) {
  console.log("Server action çalıştı");
  
  try {
    const supabase = await createClient();
    
    // FormData'dan değerleri alma
    const urun_ad = formData.urun_ad;
    const urun_fiyat = formData.urun_fiyat;
    const kategory_id = parseInt(formData.kategory_id);
    
    
    if (!urun_ad || !urun_fiyat || isNaN(kategory_id)) {
      return { success: false, error: "Eksik veya hatalı veri" };
    }
    
    const { data, error } = await supabase
      .from('menu')
      .insert([{ urun_ad, urun_fiyat, kategory_id }])
      .select();
    
    if (error) {
      console.error("Supabase Hatası:", error);
      return { success: false, error: error.message };
    }
    
    console.log("Eklenen Veri:", data);

    revalidatePath('/menu'); // Menü sayfanızın yolu
    return { success: true, data };
  } catch (error:any) {
    console.error("Hata:", error);
    return { success: false, error: error.message || "Bir hata oluştu" };
  }
}

export async function getProducts() {
    const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('menu')
      .select('id,urun_ad, urun_fiyat, kategory_id(category_name)')
     
      
    if (error) {
      throw new Error(error.message);
    }
    
    return { success: true, data };
  } catch (error:any ) {
    return { success: false, error: error.message };
  }
}


export async function getCategory() {
  const supabase = await createClient();
try {
  const { data, error } = await supabase
    .from('category')
    .select('*')
   
    
  if (error) {
    throw new Error(error.message);
  }
  
  return { success: true, data };
} catch (error:any ) {
  return { success: false, error: error.message };
}
}

export async function addCategory(formData:any) {
  console.log("Server action çalıştı");
  
  try {
    const supabase = await createClient();
    
    // FormData'dan değerleri alma
    const category_name = formData.category_name;
    
    if (!category_name) {
      return { success: false, error: "Eksik veya hatalı veri" };
    }
    
    const { data, error } = await supabase
      .from('category')
      .insert([{ category_name }])
      .select();
    
    if (error) {
      console.error("Supabase Hatası:", error);
      return { success: false, error: error.message };
    }
    
    console.log("Eklenen Veri:", data);

    revalidatePath('/category'); // Menü sayfanızın yolu
    return { success: true, data };
  } catch (error:any) {
    console.error("Hata:", error);
    return { success: false, error: error.message || "Bir hata oluştu" };
  }}

export async function deleteProduct(id:number){
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from('menu')
      .delete()
      .eq('id', id)
    
    if (error) {
      throw new Error(error.message);
    }
    
    return { success: true, data };
  } catch (error:any) {
    return { success: false, error: error.message };
  }
}




