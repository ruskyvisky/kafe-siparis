import React from 'react';
import TableList from './client-tables';
import { getTables } from '../actions/table-actions';

export default async function TablesPage() {
  // Her iki veriyi de alıyoruz
  const { data: tables, error: tablesError } = await getTables();
 

  return (
    <div>
      <TableList tables={tables} />
    </div>
  );
}