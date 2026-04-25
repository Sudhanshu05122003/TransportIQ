'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const revenueData = [
  { month: 'Jul', revenue: 180000, shipments: 320 },
  { month: 'Aug', revenue: 220000, shipments: 410 },
  { month: 'Sep', revenue: 195000, shipments: 380 },
  { month: 'Oct', revenue: 310000, shipments: 520 },
  { month: 'Nov', revenue: 280000, shipments: 490 },
  { month: 'Dec', revenue: 340000, shipments: 580 },
  { month: 'Jan', revenue: 390000, shipments: 640 },
  { month: 'Feb', revenue: 420000, shipments: 710 },
  { month: 'Mar', revenue: 480000, shipments: 820 },
  { month: 'Apr', revenue: 520000, shipments: 890 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 text-sm">
        <p className="font-semibold text-gray-900 mb-1">{label}</p>
        <p className="text-indigo-600">Revenue: ₹{(payload[0].value / 1000).toFixed(0)}K</p>
        {payload[1] && <p className="text-emerald-600">Shipments: {payload[1].value}</p>}
      </div>
    );
  }
  return null;
};

export default function RevenueChart() {
  return (
    <div className="space-y-6">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}K`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#colorRevenue)" />
            <Area type="monotone" dataKey="shipments" stroke="#10b981" strokeWidth={1.5} fill="transparent" strokeDasharray="5 5" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
