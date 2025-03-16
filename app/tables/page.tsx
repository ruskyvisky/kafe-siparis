import React from 'react'
import TableList from './client-tables'
import { getTables } from '../actions/table-actions'
export default async function TablesPage()   {

  const { data: tables, error } = await getTables()
  return (
<div>

  <TableList tables={tables} />
</div>


  )
}
