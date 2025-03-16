"use server";

import { createClient } from '../utils/supabase';
import { revalidatePath } from 'next/cache';


export async function addProduct(formData : any) {
     const supabase = await createClient();
    
  // Form verilerini alın
  const name = formData.get('name');
  const price = parseFloat(formData.get('price'));
  const description = formData.get('description');
  
  try {
    // Supabase'e veri ekleyin
    const { data, error } = await supabase
      .from('menu')
      .insert([{ name, price, description }]);
    
    if (error) {
      throw new Error(error.message);
    }
    
    // Sayfayı yeniden doğrulayın (cache'i temizleyin)
    revalidatePath('/menu');
    
    return { success: true, data };
  } catch (error:any) {
    return { success: false, error: error.message };
  }
}

export async function getProducts() {
    const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('menu')
      .select('*')
     
      
    if (error) {
      throw new Error(error.message);
    }
    
    return { success: true, data };
  } catch (error:any ) {
    return { success: false, error: error.message };
  }
}
