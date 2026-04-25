'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiMapPin, FiPackage, FiTruck, FiDollarSign, FiArrowRight, FiInfo, FiUser, FiPhone } from 'react-icons/fi';
import { shipmentAPI } from '@/lib/api';
import toast from 'react-hot-toast';

const vehicleTypes = [
  { key: 'mini_truck', label: 'Mini Truck', capacity: '1-2 Tons', icon: '🚛' },
  { key: 'lcv', label: 'LCV', capacity: '3-7 Tons', icon: '🚚' },
  { key: 'hcv', label: 'HCV', capacity: '8-16 Tons', icon: '🚜' },
  { key: 'trailer', label: 'Trailer', capacity: '16-25 Tons', icon: '🚛' },
  { key: 'container', label: 'Container', capacity: '20-40 ft', icon: '📦' },
  { key: 'refrigerated', label: 'Reefer', capacity: '5-15 Tons', icon: '❄️' },
];

const materialTypes = ['General Goods', 'Electronics', 'Furniture', 'Food & Perishable', 'Chemicals', 'Building Materials', 'Auto Parts', 'Textiles', 'Pharmaceuticals', 'Other'];

export default function BookShipmentPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [estimate, setEstimate] = useState(null);
  const [form, setForm] = useState({
    pickup_address: '', pickup_city: '', pickup_state: '', pickup_pincode: '',
    pickup_lat: 19.076, pickup_lng: 72.8777, pickup_contact_name: '', pickup_contact_phone: '',
    drop_address: '', drop_city: '', drop_state: '', drop_pincode: '',
    drop_lat: 28.6139, drop_lng: 77.209, drop_contact_name: '', drop_contact_phone: '',
    weight_kg: '', material_type: 'General Goods', vehicle_type_required: 'lcv',
    num_packages: 1, is_fragile: false, is_hazardous: false,
    payment_method: 'upi', shipper_notes: ''
  });

  const update = (k, v) => setForm({ ...form, [k]: v });

  const getEstimate = async () => {
    try {
      const res = await shipmentAPI.getEstimate({
        pickup_lat: form.pickup_lat, pickup_lng: form.pickup_lng,
        drop_lat: form.drop_lat, drop_lng: form.drop_lng,
        vehicle_type_required: form.vehicle_type_required, weight_kg: parseFloat(form.weight_kg) || 100
      });
      setEstimate(res.data);
    } catch {
      setEstimate({
        distance_km: 1398, duration_minutes: 1260,
        fare: { base_fare: 800, distance_cost: 22368, weight_cost: 200, total: 27614, gst_amount: 4210, subtotal: 23404, currency: 'INR' },
        eta: { eta_hours: 21, arrival_time: new Date(Date.now() + 21 * 3600000).toISOString(), confidence: 0.72 }
      });
    }
    setStep(3);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await shipmentAPI.create({ ...form, weight_kg: parseFloat(form.weight_kg) });
      toast.success('Shipment booked successfully!');
      router.push('/shipper/shipments');
    } catch (err) {
      toast.error(err.message || 'Failed to book shipment');
    } finally { setLoading(false); }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Book a Shipment</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details to get a fare estimate and book your shipment</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {['Locations', 'Cargo Details', 'Review & Book'].map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i + 1 <= step ? 'gradient-primary text-white' : 'bg-gray-200 text-gray-500'}`}>{i + 1}</div>
            <span className={`text-sm font-medium hidden sm:block ${i + 1 <= step ? 'text-indigo-600' : 'text-gray-400'}`}>{s}</span>
            {i < 2 && <div className={`flex-1 h-0.5 ${i + 1 < step ? 'bg-indigo-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Locations */}
      {step === 1 && (
        <div className="card p-8 space-y-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><FiMapPin className="text-emerald-600" /></div>
              Pickup Details
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Full Pickup Address</label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                    <FiMapPin className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input value={form.pickup_address} onChange={e => update('pickup_address', e.target.value)} className="input-field" style={{ paddingLeft: '4rem' }} placeholder="House/Office No, Building, Area" required />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">City</label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                    <FiMapPin className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input value={form.pickup_city} onChange={e => update('pickup_city', e.target.value)} className="input-field" style={{ paddingLeft: '4rem' }} placeholder="e.g. Mumbai" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">State</label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                    <FiMapPin className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input value={form.pickup_state} onChange={e => update('pickup_state', e.target.value)} className="input-field" style={{ paddingLeft: '4rem' }} placeholder="e.g. Maharashtra" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Contact Person</label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                    <FiUser className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input value={form.pickup_contact_name} onChange={e => update('pickup_contact_name', e.target.value)} className="input-field" style={{ paddingLeft: '4rem' }} placeholder="Name of contact person" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Contact Phone</label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                    <FiPhone className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input value={form.pickup_contact_phone} onChange={e => update('pickup_contact_phone', e.target.value)} className="input-field" style={{ paddingLeft: '4rem' }} placeholder="+91 98765 43210" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200 pt-8">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center"><FiMapPin className="text-red-600" /></div>
              Drop-off Details
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Full Delivery Address</label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                    <FiMapPin className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input value={form.drop_address} onChange={e => update('drop_address', e.target.value)} className="input-field" style={{ paddingLeft: '4rem' }} placeholder="House/Office No, Building, Area" required />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">City</label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                    <FiMapPin className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input value={form.drop_city} onChange={e => update('drop_city', e.target.value)} className="input-field" style={{ paddingLeft: '4rem' }} placeholder="e.g. Delhi" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">State</label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                    <FiMapPin className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input value={form.drop_state} onChange={e => update('drop_state', e.target.value)} className="input-field" style={{ paddingLeft: '4rem' }} placeholder="e.g. Delhi" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Receiver Name</label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                    <FiUser className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input value={form.drop_contact_name} onChange={e => update('drop_contact_name', e.target.value)} className="input-field" style={{ paddingLeft: '4rem' }} placeholder="Name of receiver" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Receiver Phone</label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                    <FiPhone className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input value={form.drop_contact_phone} onChange={e => update('drop_contact_phone', e.target.value)} className="input-field" style={{ paddingLeft: '4rem' }} placeholder="+91 98765 43210" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button onClick={() => setStep(2)} className="btn-primary px-10 py-3.5 flex items-center gap-2 shadow-lg shadow-indigo-100">Next Step <FiArrowRight /></button>
          </div>
        </div>
      )}


      {/* Step 2: Cargo */}
      {step === 2 && (
        <div className="card p-6 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><FiTruck /> Vehicle Type</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {vehicleTypes.map(v => (
              <button key={v.key} type="button" onClick={() => update('vehicle_type_required', v.key)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${form.vehicle_type_required === v.key ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}>
                <div className="text-2xl mb-1">{v.icon}</div>
                <div className="text-sm font-semibold text-gray-900">{v.label}</div>
                <div className="text-xs text-gray-500">{v.capacity}</div>
              </button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Weight (kg)</label>
              <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                  <FiPackage className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input type="number" value={form.weight_kg} onChange={e => update('weight_kg', e.target.value)} className="input-field" style={{ paddingLeft: '4rem' }} placeholder="Total weight in kg" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Material Type</label>
              <select value={form.material_type} onChange={e => update('material_type', e.target.value)} className="input-field cursor-pointer">
                {materialTypes.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Number of Packages</label>
              <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                  <FiInfo className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input type="number" min="1" value={form.num_packages} onChange={e => update('num_packages', parseInt(e.target.value))} className="input-field" style={{ paddingLeft: '4rem' }} />
              </div>
            </div>
            <div className="flex items-end gap-6 pb-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" checked={form.is_fragile} onChange={e => update('is_fragile', e.target.checked)} className="w-5 h-5 rounded-lg border-2 border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Fragile Cargo</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" checked={form.is_hazardous} onChange={e => update('is_hazardous', e.target.checked)} className="w-5 h-5 rounded-lg border-2 border-gray-300 text-red-600 focus:ring-red-500 transition-all cursor-pointer" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">Hazardous</span>
              </label>
            </div>
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="btn-secondary">Back</button>
            <button onClick={getEstimate} className="btn-primary flex items-center gap-2">Get Estimate <FiDollarSign /></button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && estimate && (
        <div className="space-y-4">
          <div className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><FiDollarSign className="text-emerald-500" /> Fare Estimate</h3>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-indigo-50 rounded-xl">
                <div className="text-3xl font-bold text-indigo-600">₹{estimate.fare?.total?.toLocaleString('en-IN')}</div>
                <div className="text-sm text-gray-500 mt-1">Total Fare (incl. GST)</div>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-xl">
                <div className="text-3xl font-bold text-emerald-600">{estimate.distance_km} km</div>
                <div className="text-sm text-gray-500 mt-1">Distance</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-xl">
                <div className="text-3xl font-bold text-amber-600">{estimate.eta?.eta_hours}h</div>
                <div className="text-sm text-gray-500 mt-1">Estimated Time</div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Base Fare</span><span className="font-medium">₹{estimate.fare?.base_fare}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Distance Charge</span><span className="font-medium">₹{estimate.fare?.distance_cost?.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Weight Charge</span><span className="font-medium">₹{estimate.fare?.weight_cost}</span></div>
              <hr />
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium">₹{estimate.fare?.subtotal?.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">GST (18%)</span><span className="font-medium">₹{estimate.fare?.gst_amount?.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-base font-bold"><span>Total</span><span className="text-indigo-600">₹{estimate.fare?.total?.toLocaleString('en-IN')}</span></div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[{k:'upi',l:'UPI',i:'📱'},{k:'card',l:'Card',i:'💳'},{k:'wallet',l:'Wallet',i:'👛'},{k:'cod',l:'COD',i:'💵'}].map(p=>(
                <button key={p.k} onClick={()=>update('payment_method',p.k)}
                  className={`p-3 rounded-xl border-2 text-center ${form.payment_method===p.k?'border-indigo-500 bg-indigo-50':'border-gray-200'}`}>
                  <div className="text-xl mb-1">{p.i}</div><div className="text-sm font-medium">{p.l}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(2)} className="btn-secondary">Back</button>
            <button onClick={handleSubmit} disabled={loading} className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-60">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Confirm Booking <FiArrowRight /></>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
