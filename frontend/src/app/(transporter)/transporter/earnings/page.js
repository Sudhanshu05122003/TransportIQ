'use client';
import { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp, FiArrowUpRight, FiCalendar, FiBriefcase } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TransporterEarningsPage() {
  const [mounted, setMounted] = useState(false);

  const weeklyData = [
    { day: 'Mon', amount: 15200 },
    { day: 'Tue', amount: 24800 },
    { day: 'Wed', amount: 19500 },
    { day: 'Thu', amount: 32000 },
    { day: 'Fri', amount: 28000 },
    { day: 'Sat', amount: 14000 },
    { day: 'Sun', amount: 5000 },
  ];

  const transactions = [
    { id: 'tx1', tripId: 'TIQ4KF2M', date: 'Jun 15, 2026', route: 'Mumbai ➔ Delhi', amount: 24500, status: 'credited', commission: 2450 },
    { id: 'tx2', tripId: 'TIQ7H2LA', date: 'Jun 12, 2026', route: 'Pune ➔ Bangalore', amount: 18200, status: 'credited', commission: 1820 },
    { id: 'tx3', tripId: 'TIQ9B1XS', date: 'Jun 08, 2026', route: 'Nagpur ➔ Mumbai', amount: 12400, status: 'credited', commission: 1240 },
  ];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
        <p className="text-gray-500 text-sm">Monitor fleet revenue, payouts, and commission logs</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 bg-white shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-semibold uppercase">Revenue (MTD)</div>
            <div className="text-2xl font-black text-gray-900 mt-1">₹4.8L</div>
            <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><FiTrendingUp /> +18% vs last month</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">₹</div>
        </div>

        <div className="card p-5 bg-white shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-semibold uppercase">This Week</div>
            <div className="text-2xl font-black text-gray-900 mt-1">₹1,51,500</div>
            <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><FiTrendingUp /> Standard Performance</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl"><FiCalendar /></div>
        </div>

        <div className="card p-5 bg-white shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-semibold uppercase">Avg Payout Per Trip</div>
            <div className="text-2xl font-black text-gray-900 mt-1">₹18,400</div>
            <div className="text-xs text-indigo-600 mt-1 font-medium">Over 156 total trips</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl"><FiBriefcase /></div>
        </div>

        <div className="card p-5 bg-indigo-900 text-white shadow-md flex items-center justify-between">
          <div>
            <div className="text-indigo-200 text-xs font-semibold uppercase">Withdrawable Balance</div>
            <div className="text-2xl font-black mt-1">₹85,000</div>
            <button className="text-xs bg-white/20 hover:bg-white/30 text-white font-bold px-2 py-0.5 rounded transition-all mt-1.5 flex items-center gap-0.5">Withdraw Payout <FiArrowUpRight /></button>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center text-xl font-bold">₹</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="card p-5 bg-white shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Weekly Fleet Income Breakdown</h3>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip formatter={(v) => [`₹${v}`, 'Fleet Revenue']} cursor={{ fill: '#f3f4f6' }} />
              <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payout Logs */}
      <div className="card bg-white shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Recent Transporter Settlements</h3>
        </div>
        <div className="divide-y divide-gray-100 overflow-x-auto">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-5 flex items-center justify-between min-w-[500px] hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">₹</div>
                <div>
                  <div className="font-bold text-gray-900">{tx.route}</div>
                  <div className="text-xs text-gray-400">Trip ID: {tx.tripId} • {tx.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-extrabold text-emerald-600">+₹{tx.amount.toLocaleString()}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Platform commission deduction: -₹{tx.commission.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
