'use client';
import { useState, useEffect, useRef } from 'react';
import { FiMapPin, FiClock, FiTruck, FiNavigation } from 'react-icons/fi';
import dynamic from 'next/dynamic';

// Dynamically import map to avoid SSR issues with Leaflet
const TrackingMap = dynamic(() => import('@/components/maps/TrackingMap'), { ssr: false, loading: () => <div className="h-[500px] bg-gray-100 rounded-xl animate-pulse flex items-center justify-center text-gray-400">Loading Map...</div> });

export default function TrackingPage() {
  const [driverPos, setDriverPos] = useState({ lat: 21.1458, lng: 79.0882 }); // Nagpur (midpoint)
  const [tripInfo] = useState({
    tracking_id: 'TIQ4KF2M', status: 'in_transit',
    pickup: { city: 'Mumbai', lat: 19.076, lng: 72.8777 },
    drop: { city: 'Delhi', lat: 28.6139, lng: 77.209 },
    driver: { name: 'Rajesh Kumar', phone: '+91 98765 43210', vehicle: 'MH 12 AB 3456' },
    eta: '6h 45m', distance_remaining: '680 km', distance_covered: '718 km'
  });

  // Simulate driver movement
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverPos(prev => ({
        lat: prev.lat + (Math.random() - 0.4) * 0.01,
        lng: prev.lng + (Math.random() - 0.3) * 0.015
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Tracking</h1>
          <p className="text-gray-500 text-sm">Shipment #{tripInfo.tracking_id}</p>
        </div>
        <span className="badge badge-in_transit text-sm px-4 py-1.5">● Live</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <TrackingMap driverPosition={driverPos} pickup={tripInfo.pickup} drop={tripInfo.drop} />
          </div>
        </div>

        {/* Trip Info */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-4">Trip Details</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 ring-4 ring-emerald-100"></div>
                <div><div className="text-xs text-gray-400">Pickup</div><div className="font-semibold text-gray-900">{tripInfo.pickup.city}</div></div>
              </div>
              <div className="ml-1.5 border-l-2 border-dashed border-gray-200 h-6"></div>
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5 ring-4 ring-red-100"></div>
                <div><div className="text-xs text-gray-400">Drop</div><div className="font-semibold text-gray-900">{tripInfo.drop.city}</div></div>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-3">Driver</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold">R</div>
              <div>
                <div className="font-semibold text-gray-900">{tripInfo.driver.name}</div>
                <div className="text-sm text-gray-500">{tripInfo.driver.phone}</div>
                <div className="text-xs text-gray-400">{tripInfo.driver.vehicle}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="card-stat text-center">
              <FiClock className="mx-auto text-xl text-amber-500 mb-2" />
              <div className="text-xl font-bold text-gray-900">{tripInfo.eta}</div>
              <div className="text-xs text-gray-500">ETA</div>
            </div>
            <div className="card-stat text-center">
              <FiNavigation className="mx-auto text-xl text-indigo-500 mb-2" />
              <div className="text-xl font-bold text-gray-900">{tripInfo.distance_remaining}</div>
              <div className="text-xs text-gray-500">Remaining</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
