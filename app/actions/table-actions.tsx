"use server";
import { createClient } from '../utils/supabase';
import { revalidatePath } from 'next/cache';

export async function addTable(formData:any) {


}

export async function getTables() {
    const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('tables')
      .select('table_name')
     
      
    if (error) {
      throw new Error(error.message);
    }
    
    return { success: true, data };
  } catch (error:any ) {
    return { success: false, error: error.message };
  }
}