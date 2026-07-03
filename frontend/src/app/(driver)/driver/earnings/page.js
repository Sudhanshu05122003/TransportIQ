'use client';
import { useState, useEffect } from 'react';
import { FiTrendingUp, FiArrowUpRight, FiCalendar, FiClock, FiCheckCircle } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function EarningsPage() {
  const [mounted, setMounted] = useState(false);

  // Sample earnings data for chart
  const weeklyData = [
    { day: 'Mon', amount: 3200 },
    { day: 'Tue', amount: 4800 },
    { day: 'Wed', amount: 2500 },
    { day: 'Thu', amount: 5000 },
    { day: 'Fri', amount: 3000 },
    { day: 'Sat', amount: 4000 },
    { day: 'Sun', amount: 0 },
  ];

  // Recent transactions/payouts
  const transactions = [
    { id: 'tx1', tripId: 'TIQ4KF2M', date: 'Jun 15, 2026', route: 'Mumbai ➔ Delhi', amount: 24500, status: 'credited' },
    { id: 'tx2', tripId: 'TIQ7H2LA', date: 'Jun 12, 2026', route: 'Pune ➔ Bangalore', amount: 18200, status: 'credited' },
    { id: 'tx3', tripId: 'TIQ9B1XS', date: 'Jun 08, 2026', route: 'Nagpur ➔ Mumbai', amount: 12400, status: 'credited' },
    { id: 'tx4', tripId: 'TIQ2N7PQ', date: 'Jun 04, 2026', route: 'Ahmedabad ➔ Indore', amount: 8900, status: 'credited' },
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
        <p className="text-gray-500 text-sm">Track your payouts, trip bonuses, and financial progress</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 bg-white shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-semibold uppercase">Today&apos;s Earnings</div>
            <div className="text-2xl font-black text-gray-900 mt-1">₹3,200</div>
            <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><FiTrendingUp /> Standard Rate</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">₹</div>
        </div>

        <div className="card p-5 bg-white shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-semibold uppercase">This Week</div>
            <div className="text-2xl font-black text-gray-900 mt-1">₹18,500</div>
            <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><FiTrendingUp /> +12% vs last week</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl"><FiCalendar /></div>
        </div>

        <div className="card p-5 bg-white shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-semibold uppercase">This Month</div>
            <div className="text-2xl font-black text-gray-900 mt-1">₹74,200</div>
            <div className="text-xs text-indigo-600 mt-1 font-medium">On track for target</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl"><FiTrendingUp /></div>
        </div>

        <div className="card p-5 bg-indigo-900 text-white shadow-md flex items-center justify-between">
          <div>
            <div className="text-indigo-200 text-xs font-semibold uppercase">Wallet Balance</div>
            <div className="text-2xl font-black mt-1">₹14,500</div>
            <button className="text-xs bg-white/20 hover:bg-white/30 text-white font-bold px-2 py-0.5 rounded transition-all mt-1.5 flex items-center gap-0.5">Withdraw <FiArrowUpRight /></button>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center text-xl font-bold">₹</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-5 bg-white shadow-sm lg:col-span-2">
          <h3 className="font-bold text-gray-900 mb-4">Weekly Earnings Breakdown</h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip formatter={(v) => [`₹${v}`, 'Earnings']} cursor={{ fill: '#f3f4f6' }} />
                <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incentive / Goals Card */}
        <div className="card p-5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex flex-col justify-between shadow-md">
          <div>
            <h3 className="font-black text-xl mb-1">Weekly Target Bonus</h3>
            <p className="text-indigo-100 text-sm">Complete 5 more long-distance trips to unlock ₹5,000 bonus!</p>
          </div>
          <div className="space-y-3 mt-6">
            <div className="flex justify-between text-xs font-bold">
              <span>Progress (3/8 completed)</span>
              <span>37.5%</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div className="bg-white h-full rounded-full" style={{ width: '37.5%' }} />
            </div>
            <div className="text-[11px] text-indigo-100 flex items-center gap-1 mt-1">
              <FiClock /> Promo ends in 3 days (Sunday midnight)
            </div>
          </div>
        </div>
      </div>

      {/* Payout History / Recent Transactions */}
      <div className="card bg-white shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Recent Trip Payouts</h3>
        </div>
        <div className="divide-y divide-gray-100 overflow-x-auto">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-5 flex items-center justify-between min-w-[500px] hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><FiCheckCircle /></div>
                <div>
                  <div className="font-bold text-gray-900">{tx.route}</div>
                  <div className="text-xs text-gray-400">Trip ID: {tx.tripId} • {tx.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-extrabold text-emerald-600">+₹{tx.amount.toLocaleString()}</div>
                <div className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold border border-emerald-100 inline-block mt-0.5">Credited</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
