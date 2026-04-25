'use client';
import { useState } from 'react';
import { FiTruck, FiUsers, FiDollarSign, FiActivity, FiPlus, FiMapPin } from 'react-icons/fi';
import Link from 'next/link';

export default function TransporterDashboard() {
  const stats = [
    { label: 'Total Vehicles', value: 24, icon: FiTruck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Active Drivers', value: 18, icon: FiUsers, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Trips', value: 12, icon: FiActivity, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Revenue (MTD)', value: '₹4.8L', icon: FiDollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const vehicles = [
    { id: '1', reg: 'MH 12 AB 3456', type: 'HCV', driver: 'Rajesh Kumar', status: 'active', location: 'Mumbai-Delhi Highway' },
    { id: '2', reg: 'MH 04 CD 7890', type: 'LCV', driver: 'Suresh Singh', status: 'active', location: 'Pune-Hyderabad' },
    { id: '3', reg: 'MH 01 EF 1234', type: 'Mini Truck', driver: null, status: 'idle', location: 'Depot' },
    { id: '4', reg: 'KA 05 GH 5678', type: 'Trailer', driver: 'Amit Yadav', status: 'maintenance', location: 'Service Center' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Fleet Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your vehicles and drivers</p></div>
        <Link href="/transporter/fleet" className="btn-primary flex items-center gap-2"><FiPlus /> Add Vehicle</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={s.label} className={`card-stat animate-slide-up stagger-${i+1}`}>
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}><s.icon className={`text-lg ${s.color}`} /></div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="p-6 border-b border-gray-100"><h2 className="text-lg font-bold text-gray-900">Vehicle Status</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              {['Registration', 'Type', 'Driver', 'Location', 'Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {vehicles.map(v => (
                <tr key={v.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-mono font-semibold text-sm text-gray-900">{v.reg}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{v.type}</td>
                  <td className="px-4 py-3 text-sm">{v.driver || <span className="text-gray-400 italic">Unassigned</span>}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 flex items-center gap-1"><FiMapPin className="text-xs" />{v.location}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${v.status === 'active' ? 'badge-in_transit' : v.status === 'idle' ? 'badge-pending' : 'badge-cancelled'}`}>{v.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
