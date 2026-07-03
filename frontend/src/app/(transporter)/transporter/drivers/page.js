'use client';
import { useState, useEffect } from 'react';
import { FiUsers, FiPlus, FiPhone, FiCheckCircle, FiAlertCircle, FiX, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function DriversPage() {
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Rajesh Kumar', phone: '+91 98765 43210', license: 'DL-1420210087452', status: 'active', vehicle: 'MH 12 AB 3456' },
    { id: 2, name: 'Suresh Singh', phone: '+91 98765 43211', license: 'DL-1420210087453', status: 'active', vehicle: 'MH 04 CD 7890' },
    { id: 3, name: 'Amit Yadav', phone: '+91 98765 43212', license: 'DL-1420210087454', status: 'idle', vehicle: 'KA 05 GH 5678' },
    { id: 4, name: 'Vikram Rathore', phone: '+91 98765 43213', license: 'DL-1420210087455', status: 'offline', vehicle: 'Unassigned' }
  ]);

  const [newDriver, setNewDriver] = useState({ firstName: '', lastName: '', phone: '', license: '' });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleAddDriver = (e) => {
    e.preventDefault();
    const newId = drivers.length + 1;
    const added = {
      id: newId,
      name: `${newDriver.firstName} ${newDriver.lastName}`,
      phone: newDriver.phone,
      license: newDriver.license,
      status: 'idle',
      vehicle: 'Unassigned'
    };
    setDrivers([...drivers, added]);
    setShowModal(false);
    setNewDriver({ firstName: '', lastName: '', phone: '', license: '' });
    toast.success('Driver added to fleet successfully!');
  };

  const handleToggleStatus = (id) => {
    setDrivers(drivers.map(d => {
      if (d.id === id) {
        const nextStatus = d.status === 'active' ? 'idle' : d.status === 'idle' ? 'offline' : 'active';
        toast.success(`Updated ${d.name}'s status to ${nextStatus}`);
        return { ...d, status: nextStatus };
      }
      return d;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Drivers</h1>
          <p className="text-gray-500 text-sm">Manage fleet drivers, assign duties, and track availability</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary px-6 py-3 flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 self-start sm:self-center"
        >
          <FiPlus /> Add Driver
        </button>
      </div>

      {/* Driver Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {drivers.map(d => (
          <div key={d.id} className="card p-5 bg-white shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white text-lg font-black">
                    {d.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{d.name}</h3>
                    <p className="text-xs text-gray-400">License: {d.license}</p>
                  </div>
                </div>
                <span className={`badge text-xs px-2.5 py-1 rounded font-semibold border ${
                  d.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                  d.status === 'idle' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                  'bg-gray-50 text-gray-600 border-gray-200'
                }`}>
                  {d.status === 'active' ? '● Active' : d.status === 'idle' ? '● Idle' : '● Offline'}
                </span>
              </div>

              <div className="divide-y divide-gray-100 pt-2 text-sm text-gray-600">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="font-medium text-gray-400">Phone</span>
                  <a href={`tel:${d.phone}`} className="font-semibold text-indigo-600 hover:underline flex items-center gap-1"><FiPhone /> {d.phone}</a>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="font-medium text-gray-400">Assigned Vehicle</span>
                  <span className={`font-semibold ${d.vehicle === 'Unassigned' ? 'text-gray-400 italic' : 'text-gray-800'}`}>{d.vehicle}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-100 mt-4">
              <button
                onClick={() => handleToggleStatus(d.id)}
                className="btn-secondary text-xs flex-1 py-2 flex items-center justify-center gap-1.5"
              >
                Change Status
              </button>
              <button
                onClick={() => toast.success(`Vehicle management simulated for ${d.name}`)}
                className="btn-secondary text-xs flex-1 py-2 flex items-center justify-center gap-1.5"
              >
                Assign Vehicle
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Driver Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <FiX className="text-lg" />
            </button>
            
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><FiUsers /> Add New Driver</h3>

            <form onSubmit={handleAddDriver} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">First Name</label>
                  <input
                    type="text"
                    required
                    value={newDriver.firstName}
                    onChange={e => setNewDriver({ ...newDriver, firstName: e.target.value })}
                    className="input-field text-sm"
                    placeholder="e.g. Sanjay"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newDriver.lastName}
                    onChange={e => setNewDriver({ ...newDriver, lastName: e.target.value })}
                    className="input-field text-sm"
                    placeholder="e.g. Patel"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={newDriver.phone}
                  onChange={e => setNewDriver({ ...newDriver, phone: e.target.value })}
                  className="input-field text-sm"
                  placeholder="e.g. +91 99988 87776"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">Driving License Number</label>
                <input
                  type="text"
                  required
                  value={newDriver.license}
                  onChange={e => setNewDriver({ ...newDriver, license: e.target.value })}
                  className="input-field text-sm"
                  placeholder="e.g. DL-XXXXXXXXXXXXX"
                />
              </div>

              <div className="flex gap-3 pt-4 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary px-5 py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-6 py-2.5"
                >
                  Save Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
