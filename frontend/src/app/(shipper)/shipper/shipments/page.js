'use client';
import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiMapPin, FiEye } from 'react-icons/fi';
import Link from 'next/link';
import { shipmentAPI } from '@/lib/api';

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => { loadShipments(); }, [filter]);

  const loadShipments = async () => {
    try {
      const res = await shipmentAPI.list({ status: filter || undefined, search, limit: 50 });
      setShipments(res.data.shipments);
    } catch {
      setShipments([
        { id:'1', tracking_id:'TIQ4KF2M', pickup_city:'Mumbai', drop_city:'Delhi', status:'in_transit', estimated_fare:24500, vehicle_type_required:'hcv', weight_kg:8000, created_at:new Date().toISOString() },
        { id:'2', tracking_id:'TIQ5LG3N', pickup_city:'Bangalore', drop_city:'Chennai', status:'delivered', estimated_fare:12800, vehicle_type_required:'lcv', weight_kg:3200, created_at:new Date(Date.now()-86400000).toISOString() },
        { id:'3', tracking_id:'TIQ6MH4P', pickup_city:'Pune', drop_city:'Hyderabad', status:'pending', estimated_fare:18200, vehicle_type_required:'hcv', weight_kg:6500, created_at:new Date(Date.now()-172800000).toISOString() },
        { id:'4', tracking_id:'TIQ7NI5Q', pickup_city:'Jaipur', drop_city:'Ahmedabad', status:'assigned', estimated_fare:9600, vehicle_type_required:'mini_truck', weight_kg:1500, created_at:new Date(Date.now()-259200000).toISOString() },
        { id:'5', tracking_id:'TIQ8OJ6R', pickup_city:'Kolkata', drop_city:'Patna', status:'delivered', estimated_fare:7400, vehicle_type_required:'lcv', weight_kg:2800, created_at:new Date(Date.now()-345600000).toISOString() },
      ]);
    }
  };

  const statuses = ['', 'pending', 'assigned', 'in_transit', 'delivered', 'cancelled'];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Shipments</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative group flex-1">
          <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
            <FiSearch className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && loadShipments()}
            className="input-field" 
            style={{ paddingLeft: '4rem' }}
            placeholder="Search by tracking ID, city, or route..." 
          />
        </div>
        <div className="relative group">
          <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
            <FiFilter className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value)} 
            className="input-field w-full sm:w-auto min-w-[180px] cursor-pointer"
            style={{ paddingLeft: '4rem' }}
          >
            <option value="">All Statuses</option>
            {statuses.slice(1).map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              {['Tracking ID','Route','Vehicle','Weight','Fare','Status','Action'].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {shipments.map(s=>(
                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono font-semibold text-indigo-600">#{s.tracking_id}</td>
                  <td className="px-4 py-3"><div className="text-sm font-medium text-gray-900">{s.pickup_city} → {s.drop_city}</div></td>
                  <td className="px-4 py-3 text-sm text-gray-600 capitalize">{s.vehicle_type_required?.replace('_',' ')}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.weight_kg?.toLocaleString()} kg</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">₹{(s.estimated_fare||0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3"><span className={`badge badge-${s.status}`}>{s.status?.replace('_',' ')}</span></td>
                  <td className="px-4 py-3"><Link href={`/shipper/tracking?id=${s.id}`} className="text-indigo-600 hover:text-indigo-800"><FiEye /></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
