'use client';
import { useState } from 'react';
import { FiDollarSign, FiTruck, FiMapPin, FiToggleLeft, FiToggleRight, FiCheckCircle, FiNavigation } from 'react-icons/fi';

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTrip] = useState({
    id: 't1', tracking_id: 'TIQ4KF2M', status: 'in_transit',
    pickup: 'Mumbai, Maharashtra', drop: 'Delhi, NCR',
    fare: 24500, distance: '1398 km', eta: '6h 45m',
    shipper: { name: 'Acme Industries', phone: '+91 98765 43210' }
  });

  const todayEarnings = 3200;
  const weekEarnings = 18500;
  const totalTrips = 156;

  return (
    <div className="space-y-6">
      {/* Online Toggle */}
      <div className="card p-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Driver Dashboard</h1>
          <p className="text-sm text-gray-500">{isOnline ? '🟢 You are online — accepting trips' : '🔴 You are offline'}</p>
        </div>
        <button onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${isOnline ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
          {isOnline ? <><FiToggleRight className="text-lg" /> Online</> : <><FiToggleLeft className="text-lg" /> Offline</>}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card-stat text-center">
          <FiDollarSign className="mx-auto text-2xl text-emerald-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900">₹{todayEarnings.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Today</div>
        </div>
        <div className="card-stat text-center">
          <FiDollarSign className="mx-auto text-2xl text-indigo-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900">₹{weekEarnings.toLocaleString()}</div>
          <div className="text-xs text-gray-500">This Week</div>
        </div>
        <div className="card-stat text-center">
          <FiTruck className="mx-auto text-2xl text-purple-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{totalTrips}</div>
          <div className="text-xs text-gray-500">Total Trips</div>
        </div>
      </div>

      {/* Active Trip */}
      {activeTrip && (
        <div className="card border-2 border-indigo-200">
          <div className="p-5 bg-indigo-50 border-b border-indigo-100">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-indigo-900 flex items-center gap-2"><FiNavigation /> Active Trip</h2>
              <span className="badge badge-in_transit">In Transit</span>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="space-y-3 flex-1">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1 ring-4 ring-emerald-100" />
                  <div><div className="text-xs text-gray-400">Pickup</div><div className="font-medium text-gray-900">{activeTrip.pickup}</div></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 mt-1 ring-4 ring-red-100" />
                  <div><div className="text-xs text-gray-400">Drop</div><div className="font-medium text-gray-900">{activeTrip.drop}</div></div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">₹{activeTrip.fare.toLocaleString()}</div>
                <div className="text-sm text-gray-500">{activeTrip.distance}</div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="btn-primary flex-1 flex items-center justify-center gap-2"><FiNavigation /> Navigate</button>
              <button className="btn-secondary flex-1 flex items-center justify-center gap-2"><FiCheckCircle /> Mark Delivered</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
