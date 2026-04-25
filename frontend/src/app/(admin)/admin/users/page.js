'use client';
import { useState } from 'react';
import { FiSearch, FiUserCheck, FiUserX, FiEye } from 'react-icons/fi';

export default function AdminUsersPage() {
  const [filter, setFilter] = useState('');
  const users = [
    { id: '1', first_name: 'Rajesh', last_name: 'Kumar', phone: '9876543210', email: 'rajesh@gmail.com', role: 'driver', kyc_status: 'verified', is_active: true, created_at: '2024-01-15' },
    { id: '2', first_name: 'Priya', last_name: 'Sharma', phone: '9876543211', email: 'priya@acme.com', role: 'shipper', kyc_status: 'pending', is_active: true, created_at: '2024-02-20' },
    { id: '3', first_name: 'Suresh', last_name: 'Patel', phone: '9876543212', email: 'suresh@srlogistics.in', role: 'transporter', kyc_status: 'verified', is_active: true, created_at: '2024-01-10' },
    { id: '4', first_name: 'Amit', last_name: 'Yadav', phone: '9876543213', email: 'amit@gmail.com', role: 'driver', kyc_status: 'submitted', is_active: true, created_at: '2024-03-01' },
    { id: '5', first_name: 'Neha', last_name: 'Gupta', phone: '9876543214', email: 'neha@fastship.com', role: 'shipper', kyc_status: 'pending', is_active: false, created_at: '2024-02-28' },
  ];

  const roleColors = { shipper: 'bg-blue-100 text-blue-700', transporter: 'bg-emerald-100 text-emerald-700', driver: 'bg-amber-100 text-amber-700', admin: 'bg-purple-100 text-purple-700' };
  const kycColors = { verified: 'bg-emerald-100 text-emerald-700', submitted: 'bg-amber-100 text-amber-700', pending: 'bg-gray-100 text-gray-600', rejected: 'bg-red-100 text-red-700' };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input-field pl-10" placeholder="Search by name, phone, email..." />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="input-field w-auto">
          <option value="">All Roles</option>
          <option value="shipper">Shippers</option>
          <option value="transporter">Transporters</option>
          <option value="driver">Drivers</option>
        </select>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-gray-50 border-b border-gray-100">
            {['Name', 'Phone', 'Role', 'KYC', 'Status', 'Joined', 'Actions'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
            ))}
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3"><div className="font-semibold text-sm text-gray-900">{u.first_name} {u.last_name}</div><div className="text-xs text-gray-400">{u.email}</div></td>
                <td className="px-4 py-3 text-sm text-gray-600">{u.phone}</td>
                <td className="px-4 py-3"><span className={`badge ${roleColors[u.role]}`}>{u.role}</span></td>
                <td className="px-4 py-3"><span className={`badge ${kycColors[u.kyc_status]}`}>{u.kyc_status}</span></td>
                <td className="px-4 py-3">{u.is_active ? <span className="text-emerald-600 text-sm font-medium">Active</span> : <span className="text-red-500 text-sm font-medium">Inactive</span>}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{u.created_at}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button className="text-indigo-600 hover:text-indigo-800"><FiEye /></button>
                  {u.is_active ? <button className="text-red-500 hover:text-red-700"><FiUserX /></button> : <button className="text-emerald-600 hover:text-emerald-800"><FiUserCheck /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
