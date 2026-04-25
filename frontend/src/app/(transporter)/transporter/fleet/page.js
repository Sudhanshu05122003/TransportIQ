'use client';
import { useState } from 'react';
import { FiPlus, FiTruck, FiEdit, FiTrash2, FiUserPlus } from 'react-icons/fi';

const vehicleTypes = ['mini_truck', 'lcv', 'hcv', 'trailer', 'container', 'tanker', 'refrigerated'];

export default function FleetPage() {
  const [showModal, setShowModal] = useState(false);
  const vehicles = [
    { id: '1', registration_number: 'MH 12 AB 3456', vehicle_type: 'hcv', make: 'Tata', model: 'Prima', capacity_tons: 16, driver: 'Rajesh Kumar', is_active: true },
    { id: '2', registration_number: 'MH 04 CD 7890', vehicle_type: 'lcv', make: 'Ashok Leyland', model: 'Dost', capacity_tons: 3.5, driver: 'Suresh Singh', is_active: true },
    { id: '3', registration_number: 'MH 01 EF 1234', vehicle_type: 'mini_truck', make: 'Mahindra', model: 'Bolero Pikup', capacity_tons: 1.5, driver: null, is_active: true },
    { id: '4', registration_number: 'KA 05 GH 5678', vehicle_type: 'trailer', make: 'BharatBenz', model: '4928T', capacity_tons: 25, driver: 'Amit Yadav', is_active: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Fleet Management</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2"><FiPlus /> Add Vehicle</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map(v => (
          <div key={v.id} className={`card p-5 ${!v.is_active ? 'opacity-60' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono font-bold text-gray-900">{v.registration_number}</span>
              <span className={`badge ${v.is_active ? 'badge-in_transit' : 'badge-cancelled'}`}>{v.is_active ? 'Active' : 'Inactive'}</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="font-medium capitalize">{v.vehicle_type.replace('_', ' ')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Make/Model</span><span className="font-medium">{v.make} {v.model}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Capacity</span><span className="font-medium">{v.capacity_tons} Tons</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Driver</span><span className="font-medium">{v.driver || <span className="text-gray-400 italic">Unassigned</span>}</span></div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="btn-secondary flex-1 text-xs py-2"><FiEdit className="inline mr-1" />Edit</button>
              {!v.driver && <button className="btn-primary flex-1 text-xs py-2"><FiUserPlus className="inline mr-1" />Assign</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
