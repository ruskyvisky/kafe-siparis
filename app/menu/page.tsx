import React from 'react'
import { createClient } from '../utils/supabase';
import ClientMenu from './client';
import { getProducts ,getCategory} from '../actions/product-actions';

export default async function MenuPage() {
 
  const { data: category } = await getCategory();

  const { data: urunler,  } = await getProducts();
  
console.log(urunler)
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
