import React from 'react'
import { getProducts} from '../../actions/product-actions';
import CustomerMenu from './client';
export default async function ClientMenuPage() {
 

  const { data: urunler,  } = await getProducts();
  
 

  return <div>
{ urunler && <CustomerMenu products={urunler} />}
  </div>}
 // {JSON.stringify(category,null,2)}
