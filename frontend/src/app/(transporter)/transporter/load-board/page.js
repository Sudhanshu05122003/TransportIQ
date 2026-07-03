'use client';
import { useState, useEffect } from 'react';
import { FiMapPin, FiTruck, FiPackage, FiDollarSign, FiClock, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function LoadBoardPage() {
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [biddingOn, setBiddingOn] = useState(null);
  const [bidAmount, setBidAmount] = useState('');

  const fetchLoads = async () => {
    try {
      // Mock fetch
      setTimeout(() => {
        setLoads([
          {
            id: 'shp-1234',
            pickup_city: 'Mumbai',
            drop_city: 'Delhi',
            material_type: 'Electronics',
            weight_kg: 5000,
            vehicle_type_required: 'HCV',
            estimated_fare: 45000,
            bidding_ends_at: new Date(Date.now() + 86400000).toISOString()
          },
          {
            id: 'shp-5678',
            pickup_city: 'Pune',
            drop_city: 'Hyderabad',
            material_type: 'Auto Parts',
            weight_kg: 2000,
            vehicle_type_required: 'LCV',
            estimated_fare: 18000,
            bidding_ends_at: new Date(Date.now() + 3600000).toISOString()
          }
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      toast.error('Failed to load marketplace data');
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLoads();
  }, []);

  const submitBid = async (shipmentId) => {
    if (!bidAmount) {
      toast.error('Please enter a bid amount');
      return;
    }
    
    // Call backend API /api/marketplace/bids
    toast.success(`Bid of ₹${bidAmount} placed successfully!`);
    setBiddingOn(null);
    setBidAmount('');
  };

  if (loading) return <div>Loading marketplace...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Load Board</h1>
          <p className="text-gray-500 text-sm mt-1">Browse open shipments and place bids</p>
        </div>
      </div>

      <div className="grid gap-6">
        {loads.map(load => (
          <div key={load.id} className="card p-6 border border-gray-100 hover:border-indigo-100 transition-colors">
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="badge badge-pending font-mono">{load.id}</span>
                  <span className="text-sm font-semibold text-rose-600 flex items-center gap-1">
                    <FiClock /> Ends {new Date(load.bidding_ends_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-gray-400" />
                    <span className="font-semibold text-lg">{load.pickup_city}</span>
                  </div>
                  <div className="h-0.5 w-12 bg-gray-300 relative">
                    <div className="absolute right-0 -top-1 border-t-4 border-l-4 border-b-4 border-transparent border-l-gray-300"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-indigo-500" />
                    <span className="font-semibold text-lg">{load.drop_city}</span>
                  </div>
                </div>

                <div className="flex gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2"><FiPackage /> {load.material_type} ({load.weight_kg}kg)</div>
                  <div className="flex items-center gap-2"><FiTruck /> Required: {load.vehicle_type_required}</div>
                  <div className="flex items-center gap-2 text-green-600 font-semibold"><FiDollarSign /> Est. ₹{load.estimated_fare}</div>
                </div>
              </div>

              <div>
                {biddingOn === load.id ? (
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                    <input 
                      type="number" 
                      placeholder="₹ Amount" 
                      className="input w-32" 
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                    />
                    <button onClick={() => submitBid(load.id)} className="btn-primary p-2">
                      <FiCheck />
                    </button>
                    <button onClick={() => setBiddingOn(null)} className="btn-secondary text-xs">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setBiddingOn(load.id)} className="btn-primary">
                    Place Bid
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {loads.length === 0 && (
          <div className="text-center py-12 text-gray-500">No open loads available right now.</div>
        )}
      </div>
    </div>
  );
}
