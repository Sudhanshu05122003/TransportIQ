'use client';
import { useState, useEffect } from 'react';
import { FiSearch, FiMapPin, FiCalendar, FiClock, FiActivity } from 'react-icons/fi';

export default function TripHistoryPage() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState('all'); // all, completed, cancelled
  const [search, setSearch] = useState('');

  const trips = [
    { id: 'TIQ4KF2M', date: 'Jun 15, 2026', time: '09:30 AM', pickup: 'Jawaharlal Nehru Port, Mumbai', drop: 'Sanjay Gandhi Transport Nagar, Delhi', fare: 24500, distance: '1398 km', status: 'completed', vehicle: 'MH 12 AB 3456' },
    { id: 'TIQ7H2LA', date: 'Jun 12, 2026', time: '14:15 PM', pickup: 'Chakan Industrial Area, Pune', drop: 'Whitefield Industrial Area, Bangalore', fare: 18200, distance: '840 km', status: 'completed', vehicle: 'MH 12 AB 3456' },
    { id: 'TIQ9B1XS', date: 'Jun 08, 2026', time: '11:00 AM', pickup: 'Nagpur MIDC, Nagpur', drop: 'Vashi APMC Market, Mumbai', fare: 12400, distance: '710 km', status: 'completed', vehicle: 'MH 12 AB 3456' },
    { id: 'TIQ2N7PQ', date: 'Jun 04, 2026', time: '08:45 AM', pickup: 'Aslali GIDC, Ahmedabad', drop: 'Lasudia Mori, Indore', fare: 8900, distance: '400 km', status: 'completed', vehicle: 'MH 12 AB 3456' },
    { id: 'TIQ8P9LM', date: 'May 30, 2026', time: '10:00 AM', pickup: 'Sriperumbudur Industrial Park, Chennai', drop: 'Peenya Industrial Area, Bangalore', fare: 9500, distance: '350 km', status: 'cancelled', vehicle: 'MH 12 AB 3456', reason: 'Shipper cancelled the load' },
    { id: 'TIQ5Y4RT', date: 'May 25, 2026', time: '17:30 PM', pickup: 'Hyderabad Cargo Terminal, Hyderabad', drop: 'Hosur Industrial Hub, Hosur', fare: 14200, distance: '620 km', status: 'completed', vehicle: 'MH 12 AB 3456' }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filteredTrips = trips.filter(trip => {
    const matchesFilter = filter === 'all' || trip.status === filter;
    const matchesSearch = trip.id.toLowerCase().includes(search.toLowerCase()) ||
                          trip.pickup.toLowerCase().includes(search.toLowerCase()) ||
                          trip.drop.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trip History</h1>
          <p className="text-gray-500 text-sm">View details of your past and cancelled shipments</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Trip ID, pickup or drop city..."
            className="input-field"
            style={{ paddingLeft: '3rem' }}
          />
        </div>
        
        {/* Filter Buttons */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          {['all', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 py-2 text-sm font-semibold rounded-lg capitalize transition-all ${
                filter === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* List Container */}
      <div className="space-y-4">
        {filteredTrips.length > 0 ? (
          filteredTrips.map((trip) => (
            <div key={trip.id} className="card p-5 bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-gray-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-gray-900 text-lg">#{trip.id}</span>
                    <span className={`badge text-xs px-2.5 py-1 uppercase ${
                      trip.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                      {trip.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                    <FiCalendar /> {trip.date} at {trip.time} • Vehicle: {trip.vehicle}
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-2xl font-black text-gray-900">₹{trip.fare.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{trip.distance}</div>
                </div>
              </div>

              {/* Route Details */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-gray-400 block font-medium uppercase">Pickup</span>
                      <span className="text-sm font-semibold text-gray-700">{trip.pickup}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-gray-400 block font-medium uppercase">Drop</span>
                      <span className="text-sm font-semibold text-gray-700">{trip.drop}</span>
                    </div>
                  </div>
                </div>

                {trip.status === 'cancelled' && (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-3 max-w-sm sm:self-center">
                    <span className="text-xs text-red-800 font-bold block uppercase mb-0.5">Cancellation Reason</span>
                    <span className="text-xs text-red-700 leading-relaxed font-medium">{trip.reason}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="card p-12 text-center bg-white shadow-sm border border-gray-100 space-y-3">
            <FiActivity className="mx-auto text-4xl text-gray-300" />
            <h3 className="font-bold text-gray-800 text-lg">No trips found</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto">Try adjusting your filters or search keywords to find the desired trip logs.</p>
          </div>
        )}
      </div>
    </div>
  );
}
