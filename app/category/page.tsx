import React from 'react'
import { getCategory } from '../actions/product-actions'
import Clientmenu from './client-side'

export default async function  ()  {
const {data:category} = await getCategory()

  const tableColumns = [
    { title: 'Kategori Adı', field: 'category_name' },
    {title:"İşlemler", field:"actions"},
  ]
  return (
    <div>
       <Clientmenu  tableColumns={tableColumns} categories={category} />;
       </div>
  )
}
