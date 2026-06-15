'use client';
import { useState, useEffect } from 'react';
import { FiPackage, FiMapPin, FiTruck, FiUser, FiActivity, FiSearch, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ShipmentsPage() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState('all'); // all, assigned, transit, delivered
  const [search, setSearch] = useState('');

  const [shipments, setShipments] = useState([
    { id: 'TIQ4KF2M', route: 'Mumbai ➔ Delhi', pickup: 'Jawaharlal Nehru Port, Mumbai', drop: 'Sanjay Gandhi Transport Nagar, Delhi', cargo: 'Electronics', weight: '12 Tons', fare: 24500, driver: 'Rajesh Kumar', vehicle: 'MH 12 AB 3456', status: 'transit' },
    { id: 'TIQ7H2LA', route: 'Pune ➔ Bangalore', pickup: 'Chakan GIDC, Pune', drop: 'Whitefield Industry, Bangalore', cargo: 'Automobile Parts', weight: '8 Tons', fare: 18200, driver: 'Suresh Singh', vehicle: 'MH 04 CD 7890', status: 'transit' },
    { id: 'TIQ9B1XS', route: 'Nagpur ➔ Mumbai', pickup: 'Nagpur MIDC, Nagpur', drop: 'APMC Market, Vashi', cargo: 'Agricultural Goods', weight: '15 Tons', fare: 12400, driver: 'Amit Yadav', vehicle: 'KA 05 GH 5678', status: 'delivered' },
    { id: 'TIQ3L9PZ', route: 'Ahmedabad ➔ Indore', pickup: 'Sanand GIDC, Ahmedabad', drop: 'Indore City Center', cargo: 'Pharmaceuticals', weight: '5 Tons', fare: 8900, driver: 'Unassigned', vehicle: 'Unassigned', status: 'pending' }
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filteredShipments = shipments.filter(s => {
    const matchesFilter = filter === 'all' || s.status === filter;
    const matchesSearch = s.id.toLowerCase().includes(search.toLowerCase()) ||
                          s.route.toLowerCase().includes(search.toLowerCase()) ||
                          s.cargo.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAssignDriver = (id) => {
    setShipments(shipments.map(s => {
      if (s.id === id) {
        toast.success(`Assigned driver Amit Yadav to Shipment #${id}`);
        return { ...s, driver: 'Amit Yadav', vehicle: 'KA 05 GH 5678', status: 'assigned' };
      }
      return s;
    }));
  };

  const handleCompleteShipment = (id) => {
    setShipments(shipments.map(s => {
      if (s.id === id) {
        toast.success(`Shipment #${id} marked as Delivered successfully!`);
        return { ...s, status: 'delivered' };
      }
      return s;
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shipments</h1>
        <p className="text-gray-500 text-sm">Monitor live shipments, allocate assets, and confirm deliveries</p>
      </div>

      {/* Filters & Search */}
      <div className="card p-4 bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, route, cargo type..."
            className="input-field"
            style={{ paddingLeft: '3rem' }}
          />
        </div>
        
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          {['all', 'pending', 'transit', 'delivered'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg capitalize transition-all ${
                filter === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'pending' ? 'Pending Assign' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Shipment List */}
      <div className="space-y-4">
        {filteredShipments.length > 0 ? (
          filteredShipments.map(s => (
            <div key={s.id} className="card p-5 bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-gray-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg"><FiPackage /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-gray-900 text-lg">#{s.id}</span>
                      <span className={`badge text-xs px-2.5 py-0.5 rounded font-semibold uppercase ${
                        s.status === 'transit' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                        s.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        s.status === 'assigned' ? 'bg-sky-50 text-sky-700 border border-sky-100' :
                        'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {s.status === 'transit' ? 'In Transit' : s.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">Cargo: {s.cargo} • {s.weight}</div>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-2xl font-black text-gray-900">₹{s.fare.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Guaranteed rate</div>
                </div>
              </div>

              {/* Route */}
              <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <div>
                      <span className="text-[10px] text-gray-400 block font-semibold uppercase">Pickup</span>
                      <span className="text-sm font-bold text-gray-700">{s.pickup}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div>
                      <span className="text-[10px] text-gray-400 block font-semibold uppercase">Drop</span>
                      <span className="text-sm font-bold text-gray-700">{s.drop}</span>
                    </div>
                  </div>
                </div>

                {/* Driver / Vehicle Allocation */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50 border border-gray-150 p-4 rounded-xl shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-white border border-gray-150 flex items-center justify-center text-gray-500"><FiUser /></div>
                    <div>
                      <span className="text-[10px] text-gray-400 block font-semibold uppercase">Driver</span>
                      <span className={`text-xs font-bold ${s.driver === 'Unassigned' ? 'text-gray-400 italic' : 'text-gray-700'}`}>{s.driver}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-white border border-gray-150 flex items-center justify-center text-gray-500"><FiTruck /></div>
                    <div>
                      <span className="text-[10px] text-gray-400 block font-semibold uppercase">Vehicle</span>
                      <span className={`text-xs font-bold ${s.vehicle === 'Unassigned' ? 'text-gray-400 italic' : 'text-gray-700'}`}>{s.vehicle}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 mt-4">
                {s.status === 'pending' && (
                  <button onClick={() => handleAssignDriver(s.id)} className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5">
                    Allocate Fleet Asset
                  </button>
                )}
                {s.status === 'transit' && (
                  <>
                    <button onClick={() => toast.success(`Simulating live tracking for trip #${s.id}`)} className="btn-secondary text-xs py-2 px-5 flex items-center gap-1.5">
                      <FiActivity /> Live Tracking
                    </button>
                    <button onClick={() => handleCompleteShipment(s.id)} className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 border-emerald-600 shadow-emerald-50">
                      <FiCheckCircle /> Mark Delivered
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="card p-12 text-center bg-white shadow-sm border border-gray-100">
            <FiPackage className="mx-auto text-4xl text-gray-300 mb-3" />
            <h3 className="font-bold text-gray-800 text-lg">No shipments found</h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">All shipments are currently accounted for. Switch filters or clear the search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
