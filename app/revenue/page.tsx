"use client"
import React from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

const revenueData = [
  { month: "Ocak", income: 5000, expense: 3000 },
  { month: "Şubat", income: 7000, expense: 4000 },
  { month: "Mart", income: 8000, expense: 5000 },
];
const ordersData = [
  { day: "Pzt", orders: 120 },
  { day: "Sal", orders: 150 },
  { day: "Çrş", orders: 130 },
  { day: "Prş", orders: 170 },
  { day: "Cum", orders: 200 },
  { day: "Cmt", orders: 300 },
  { day: "Pzr", orders: 250 },
];

const customersData = [
  { name: "Yeni", value: 200 },
  { name: "Sadık", value: 350 },
  { name: "Kampanya", value: 150 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const CafeDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Gelir-Gider Çizgi Grafiği */}
      <div className="bg-white p-4 shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">Gelir & Gider</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#82ca9d" />
            <Line type="monotone" dataKey="expense" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Sipariş Sayısı Çubuk Grafiği */}
      <div className="bg-white p-4 shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">Günlük Sipariş Sayısı</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ordersData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="orders" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Müşteri Dağılımı Pasta Grafiği */}
      <div className="bg-white p-4 shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">Müşteri Dağılımı</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={customersData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
              {customersData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CafeDashboard;
