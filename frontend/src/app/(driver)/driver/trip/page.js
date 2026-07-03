'use client';
import { useState, useEffect } from 'react';
import { FiMapPin, FiClock, FiTruck, FiNavigation, FiPhone, FiCheckCircle, FiChevronRight, FiMap } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

// Dynamically import map to avoid SSR issues with Leaflet
const TrackingMap = dynamic(() => import('@/components/maps/TrackingMap'), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-100 rounded-xl animate-pulse flex items-center justify-center text-gray-400">Loading Route Map...</div>
});

export default function ActiveTripPage() {
  const [mounted, setMounted] = useState(false);
  const [tripState, setTripState] = useState('accepted'); // accepted, arrived, loaded, in_transit, delivered
  const [driverPos, setDriverPos] = useState({ lat: 21.1458, lng: 79.0882 }); // Nagpur (midpoint)
  
  const [tripInfo] = useState({
    id: 't1',
    tracking_id: 'TIQ4KF2M',
    pickup: { city: 'Mumbai', lat: 19.076, lng: 72.8777, address: 'Jawaharlal Nehru Port Trust, Navi Mumbai, MH' },
    drop: { city: 'Delhi', lat: 28.6139, lng: 77.209, address: 'Sanjay Gandhi Transport Nagar, New Delhi, DL' },
    shipper: { name: 'Acme Logistics Ltd.', contact: 'Rajesh Sharma', phone: '+91 98765 43210' },
    fare: 24500,
    distance: '1398 km',
    eta: '6h 45m'
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Simulate driver location update
  useEffect(() => {
    if (tripState === 'in_transit') {
      const interval = setInterval(() => {
        setDriverPos(prev => ({
          lat: prev.lat + (Math.random() - 0.4) * 0.005,
          lng: prev.lng + (Math.random() - 0.3) * 0.008
        }));
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [tripState]);

  if (!mounted) return null;

  const handleNextStep = () => {
    switch (tripState) {
      case 'accepted':
        setTripState('arrived');
        toast.success('Status updated: Arrived at Pickup Location');
        break;
      case 'arrived':
        setTripState('loaded');
        toast.success('Status updated: Loading Completed');
        break;
      case 'loaded':
        setTripState('in_transit');
        toast.success('Status updated: In Transit / Out for Delivery');
        break;
      case 'in_transit':
        setTripState('delivered');
        toast.success('Status updated: Shipment Successfully Delivered! 🎉');
        break;
      default:
        break;
    }
  };

  const statusLabels = {
    accepted: 'Accepted',
    arrived: 'Arrived at Pickup',
    loaded: 'Cargo Loaded',
    in_transit: 'In Transit',
    delivered: 'Delivered'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Active Trip</h1>
          <p className="text-gray-500 text-sm">Shipment ID: #{tripInfo.tracking_id}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`badge text-sm px-4 py-2 border ${tripState === 'delivered' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-indigo-50 border-indigo-200 text-indigo-700'}`}>
            ● {statusLabels[tripState]}
          </span>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="card p-5 bg-white shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[600px] px-4">
          {Object.keys(statusLabels).map((stepKey, idx) => {
            const keys = Object.keys(statusLabels);
            const currentIdx = keys.indexOf(tripState);
            const isCompleted = keys.indexOf(stepKey) < currentIdx;
            const isActive = stepKey === tripState;
            
            return (
              <div key={stepKey} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                    isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 
                    isActive ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <span className={`text-xs font-semibold mt-2 absolute -bottom-6 whitespace-nowrap ${isActive ? 'text-indigo-600' : isCompleted ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {statusLabels[stepKey]}
                  </span>
                </div>
                {idx < keys.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 rounded-full transition-all ${
                    idx < currentIdx ? 'bg-emerald-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        <div className="h-6" /> {/* Spacer for label positioning */}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card overflow-hidden bg-white shadow-sm">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <span className="font-semibold text-gray-800 flex items-center gap-2"><FiMap /> Route Map</span>
              {tripState === 'in_transit' && <span className="text-xs text-indigo-600 animate-pulse font-medium">● GPS Tracking Active</span>}
            </div>
            <TrackingMap driverPosition={driverPos} pickup={tripInfo.pickup} drop={tripInfo.drop} />
          </div>

          {/* Action Card */}
          {tripState !== 'delivered' ? (
            <div className="card p-6 bg-white shadow-sm border border-indigo-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Update Trip Progress</h3>
                  <p className="text-gray-500 text-sm">Please update your status as you progress on this shipment</p>
                </div>
                <button
                  onClick={handleNextStep}
                  className="btn-primary w-full sm:w-auto px-8 py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 text-base"
                >
                  {tripState === 'accepted' && 'Arrive at Pickup'}
                  {tripState === 'arrived' && 'Start Loading Cargo'}
                  {tripState === 'loaded' && 'Start Transit'}
                  {tripState === 'in_transit' && 'Mark as Delivered'}
                  <FiChevronRight />
                </button>
              </div>
            </div>
          ) : (
            <div className="card p-6 bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <FiCheckCircle className="mx-auto text-4xl text-emerald-500" />
              <h3 className="font-bold text-emerald-900 text-lg">Trip Successfully Completed</h3>
              <p className="text-emerald-700 text-sm">Excellent job! This shipment has been finalized and payout has been credited to your wallet.</p>
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          {/* Booking / Location Details */}
          <div className="card p-5 bg-white shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3">Shipment Route</h3>
            <div className="space-y-4 relative">
              <div className="absolute left-1.5 top-2 bottom-2 border-l-2 border-dashed border-gray-200 z-0" />
              
              <div className="flex items-start gap-3 relative z-10">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 mt-1.5 ring-4 ring-emerald-100 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-400 font-semibold uppercase">Pickup Point</div>
                  <div className="font-bold text-gray-800">{tripInfo.pickup.city}</div>
                  <div className="text-sm text-gray-500">{tripInfo.pickup.address}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 relative z-10">
                <div className="w-3.5 h-3.5 rounded-full bg-red-500 mt-1.5 ring-4 ring-red-100 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-400 font-semibold uppercase">Delivery Drop</div>
                  <div className="font-bold text-gray-800">{tripInfo.drop.city}</div>
                  <div className="text-sm text-gray-500">{tripInfo.drop.address}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Fare and Distance Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card-stat text-center p-4 bg-white shadow-sm">
              <FiClock className="mx-auto text-xl text-amber-500 mb-2" />
              <div className="text-xl font-bold text-gray-900">{tripInfo.eta}</div>
              <div className="text-xs text-gray-500">Total ETA</div>
            </div>
            <div className="card-stat text-center p-4 bg-white shadow-sm">
              <FiNavigation className="mx-auto text-xl text-indigo-500 mb-2" />
              <div className="text-xl font-bold text-gray-900">{tripInfo.distance}</div>
              <div className="text-xs text-gray-500">Route Distance</div>
            </div>
          </div>

          <div className="card p-5 bg-white shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3">Shipper / Cargo Owner</h3>
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="font-bold text-gray-900">{tripInfo.shipper.name}</div>
                <div className="text-sm text-gray-500">Contact: {tripInfo.shipper.contact}</div>
                <div className="text-sm text-indigo-600 font-medium">{tripInfo.shipper.phone}</div>
              </div>
              <a href={`tel:${tripInfo.shipper.phone}`} className="w-11 h-11 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-colors">
                <FiPhone />
              </a>
            </div>
          </div>

          {/* Earnings Card */}
          <div className="card p-5 bg-indigo-900 text-white shadow-md">
            <div className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">Estimated Payout</div>
            <div className="text-3xl font-black mt-1">₹{tripInfo.fare.toLocaleString()}</div>
            <div className="text-xs text-indigo-200 mt-2">Includes GST & toll charges. Payout released instantly upon delivery confirmation.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
