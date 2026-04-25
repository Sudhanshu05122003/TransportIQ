'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPackage, FiTruck, FiDollarSign, FiClock, FiArrowRight, FiTrendingUp, FiMapPin } from 'react-icons/fi';
import { shipmentAPI } from '@/lib/api';

export default function ShipperDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, in_transit: 0, delivered: 0 });
  const [recentShipments, setRecentShipments] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, shipmentsRes] = await Promise.all([
        shipmentAPI.getStats(),
        shipmentAPI.list({ limit: 5 })
      ]);
      setStats(statsRes.data);
      setRecentShipments(shipmentsRes.data.shipments);
    } catch (err) {
      // Demo data for preview
      setStats({ total: 47, pending: 5, in_transit: 8, delivered: 34 });
      setRecentShipments([
        { id: '1', tracking_id: 'TIQ4KF2M', pickup_city: 'Mumbai', drop_city: 'Delhi', status: 'in_transit', estimated_fare: 24500, created_at: new Date().toISOString() },
        { id: '2', tracking_id: 'TIQ5LG3N', pickup_city: 'Bangalore', drop_city: 'Chennai', status: 'delivered', estimated_fare: 12800, created_at: new Date().toISOString() },
        { id: '3', tracking_id: 'TIQ6MH4P', pickup_city: 'Pune', drop_city: 'Hyderabad', status: 'pending', estimated_fare: 18200, created_at: new Date().toISOString() },
        { id: '4', tracking_id: 'TIQ7NI5Q', pickup_city: 'Jaipur', drop_city: 'Ahmedabad', status: 'assigned', estimated_fare: 9600, created_at: new Date().toISOString() },
      ]);
    }
  };

  const statCards = [
    { label: 'Total Shipments', value: stats.total, icon: FiPackage, color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50' },
    { label: 'In Transit', value: stats.in_transit, icon: FiTruck, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending', value: stats.pending, icon: FiClock, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50' },
    { label: 'Delivered', value: stats.delivered, icon: FiTrendingUp, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of your shipping activity</p>
        </div>
        <Link href="/shipper/book" className="btn-primary flex items-center gap-2">
          <FiPackage /> Book Shipment
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={s.label} className={`card-stat animate-slide-up stagger-${i+1}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`text-lg bg-gradient-to-r ${s.color} bg-clip-text text-transparent`} style={{color: s.color.includes('indigo')?'#6366f1':s.color.includes('emerald')?'#10b981':s.color.includes('amber')?'#f59e0b':'#a855f7'}} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 animate-counter">{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Shipments */}
      <div className="card">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Shipments</h2>
          <Link href="/shipper/shipments" className="text-indigo-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View All <FiArrowRight />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentShipments.map(s => (
            <div key={s.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <FiMapPin className="text-indigo-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{s.pickup_city} → {s.drop_city}</div>
                  <div className="text-xs text-gray-400 mt-0.5">#{s.tracking_id}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-semibold text-gray-900">₹{(s.estimated_fare || 0).toLocaleString('en-IN')}</div>
                </div>
                <span className={`badge badge-${s.status}`}>{s.status?.replace('_', ' ')}</span>
              </div>
            </div>
          ))}
          {recentShipments.length === 0 && (
            <div className="p-12 text-center">
              <FiPackage className="mx-auto text-4xl text-gray-300 mb-3" />
              <p className="text-gray-500">No shipments yet. Book your first shipment!</p>
              <Link href="/shipper/book" className="btn-primary inline-flex items-center gap-2 mt-4">Book Now <FiArrowRight /></Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
