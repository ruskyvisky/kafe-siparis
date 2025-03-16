import React from 'react'
import { createClient } from '../utils/supabase';
import ClientMenu from './client';

export default async function MenuPage() {
  const supabase = await createClient();
  const { data: urunler, error } = await supabase
  .from('menu')
  .select('urun_ad, urun_fiyat, kategory_id(category_name)');   
  
  const { data: category, error: categoryError } = await supabase
  .from('category')
  .select('id, category_name');

  

  console.log(category)
  const tableColumns = [
    { title: 'Ürün Adı', field: 'urun_ad' },
    {title:"Fiyat", field:"urun_fiyat"},
  { title: 'Kategori', field: 'kategory_id{category_name}' },  // Bu field artık bir string içerecek
    { title: 'İşlemler', field: 'actions' },
  ]

  return <div>
   <ClientMenu urunler={urunler} tableColumns={tableColumns}  category={category}/>;
  </div>
}
 // {JSON.stringify(category,null,2)}
