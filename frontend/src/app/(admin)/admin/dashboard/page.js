'use client';
import { useState } from 'react';
import { FiUsers, FiTruck, FiPackage, FiDollarSign, FiActivity, FiTrendingUp, FiMapPin, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import dynamic from 'next/dynamic';

const RevenueChart = dynamic(() => import('@/components/charts/RevenueChart'), { ssr: false });

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Users', value: '12,458', change: '+12%', up: true, icon: FiUsers, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Active Shipments', value: '342', change: '+8%', up: true, icon: FiPackage, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Online Drivers', value: '1,847', change: '-3%', up: false, icon: FiActivity, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Revenue (MTD)', value: '₹24.8L', change: '+18%', up: true, icon: FiDollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Vehicles', value: '3,241', change: '+5%', up: true, icon: FiTruck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Cities Covered', value: '512', change: '+2%', up: true, icon: FiMapPin, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const recentActivity = [
    { type: 'shipment', text: 'New shipment TIQ4KF2M created — Mumbai to Delhi', time: '2 min ago' },
    { type: 'driver', text: 'Driver Rajesh Kumar went online', time: '5 min ago' },
    { type: 'payment', text: 'Payment ₹24,500 received for TIQ3JE1L', time: '12 min ago' },
    { type: 'user', text: 'New transporter registered — SR Logistics', time: '25 min ago' },
    { type: 'delivery', text: 'Shipment TIQ2ID0K delivered in Bangalore', time: '45 min ago' },
  ];

  const topRoutes = [
    { route: 'Mumbai → Delhi', count: 1240, revenue: '₹3.2Cr' },
    { route: 'Bangalore → Chennai', count: 890, revenue: '₹1.8Cr' },
    { route: 'Delhi → Jaipur', count: 756, revenue: '₹1.4Cr' },
    { route: 'Pune → Hyderabad', count: 623, revenue: '₹1.2Cr' },
    { route: 'Kolkata → Patna', count: 512, revenue: '₹82L' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Platform overview and analytics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div key={s.label} className={`card-stat animate-slide-up stagger-${(i%4)+1}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}><s.icon className={`text-lg ${s.color}`} /></div>
              <span className={`text-xs font-semibold flex items-center gap-0.5 ${s.up ? 'text-emerald-600' : 'text-red-500'}`}>
                {s.up ? <FiArrowUp /> : <FiArrowDown />}{s.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><FiTrendingUp className="text-indigo-500" /> Revenue Trend</h2>
          <RevenueChart />
        </div>

        {/* Top Routes */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top Routes</h2>
          <div className="space-y-3">
            {topRoutes.map((r, i) => (
              <div key={r.route} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <div><div className="text-sm font-semibold text-gray-900">{r.route}</div><div className="text-xs text-gray-400">{r.count} shipments</div></div>
                </div>
                <span className="text-sm font-semibold text-emerald-600">{r.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="p-6 border-b border-gray-100"><h2 className="text-lg font-bold text-gray-900">Recent Activity</h2></div>
        <div className="divide-y divide-gray-50">
          {recentActivity.map((a, i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${a.type === 'shipment' ? 'bg-indigo-500' : a.type === 'payment' ? 'bg-emerald-500' : a.type === 'delivery' ? 'bg-purple-500' : 'bg-amber-500'}`}></div>
                <span className="text-sm text-gray-700">{a.text}</span>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
