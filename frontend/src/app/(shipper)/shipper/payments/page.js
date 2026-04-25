'use client';
import { useState } from 'react';
import { FiDollarSign, FiDownload, FiCreditCard } from 'react-icons/fi';

export default function PaymentsPage() {
  const payments = [
    { id:'1', tracking_id:'TIQ4KF2M', route:'Mumbai → Delhi', amount:24500, method:'UPI', status:'captured', date:'2026-03-15', invoice:'INV-20260315-1234' },
    { id:'2', tracking_id:'TIQ5LG3N', route:'Bangalore → Chennai', amount:12800, method:'Card', status:'captured', date:'2026-03-14', invoice:'INV-20260314-5678' },
    { id:'3', tracking_id:'TIQ6MH4P', route:'Pune → Hyderabad', amount:18200, method:'COD', status:'pending', date:'2026-03-13', invoice:null },
    { id:'4', tracking_id:'TIQ7NI5Q', route:'Jaipur → Ahmedabad', amount:9600, method:'UPI', status:'captured', date:'2026-03-12', invoice:'INV-20260312-9012' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="card-stat text-center"><FiDollarSign className="mx-auto text-2xl text-emerald-500 mb-2" /><div className="text-2xl font-bold">₹65,100</div><div className="text-xs text-gray-500">Total Paid</div></div>
        <div className="card-stat text-center"><FiCreditCard className="mx-auto text-2xl text-amber-500 mb-2" /><div className="text-2xl font-bold">₹18,200</div><div className="text-xs text-gray-500">Pending</div></div>
        <div className="card-stat text-center"><FiDownload className="mx-auto text-2xl text-indigo-500 mb-2" /><div className="text-2xl font-bold">3</div><div className="text-xs text-gray-500">Invoices</div></div>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-gray-50 border-b border-gray-100">
            {['Shipment','Route','Amount','Method','Status','Invoice'].map(h=>(<th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>))}
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {payments.map(p=>(
              <tr key={p.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3 font-mono text-sm font-semibold text-indigo-600">#{p.tracking_id}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{p.route}</td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">₹{p.amount.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{p.method}</td>
                <td className="px-4 py-3"><span className={`badge ${p.status==='captured'?'badge-delivered':'badge-pending'}`}>{p.status}</span></td>
                <td className="px-4 py-3">{p.invoice?<button className="text-indigo-600 text-sm flex items-center gap-1"><FiDownload/>{p.invoice}</button>:<span className="text-gray-400 text-sm">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
