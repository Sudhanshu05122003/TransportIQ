'use client';
import { useState, useEffect } from 'react';
import { FiBell, FiShield, FiSliders, FiVolume2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('New password and confirmation do not match!');
      return;
    }
    toast.success('Password changed successfully!');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm">Manage preferences, notification alerts, and security settings</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Preference Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notification Controls */}
          <div className="card p-6 bg-white shadow-sm space-y-6">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <FiBell /> Notification Preferences
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-800 text-sm">Push Notifications</div>
                  <div className="text-xs text-gray-500">Get notified instantly about new load offers on this device</div>
                </div>
                <button onClick={() => setPushNotif(!pushNotif)} className="text-2xl text-indigo-600 focus:outline-none">
                  {pushNotif ? <FiToggleRight className="text-indigo-600" /> : <FiToggleLeft className="text-gray-400" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-800 text-sm">SMS Alerts</div>
                  <div className="text-xs text-gray-500">Receive SMS notifications for critical payouts and route updates</div>
                </div>
                <button onClick={() => setSmsNotif(!smsNotif)} className="text-2xl text-indigo-600 focus:outline-none">
                  {smsNotif ? <FiToggleRight className="text-indigo-600" /> : <FiToggleLeft className="text-gray-400" />}
                </button>
              </div>
            </div>
          </div>

          {/* Driver Duty Settings */}
          <div className="card p-6 bg-white shadow-sm space-y-6">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <FiSliders /> Job Preferences
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-800 text-sm flex items-center gap-1.5"><FiVolume2 /> Load Offer Sound</div>
                  <div className="text-xs text-gray-500">Play a loud ringtone when a new shipment offer arrives</div>
                </div>
                <button onClick={() => setSoundAlerts(!soundAlerts)} className="text-2xl text-indigo-600 focus:outline-none">
                  {soundAlerts ? <FiToggleRight className="text-indigo-600" /> : <FiToggleLeft className="text-gray-400" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-800 text-sm">Auto-Accept Matches</div>
                  <div className="text-xs text-gray-500">Automatically accept trips that perfectly match your route and vehicle</div>
                </div>
                <button onClick={() => setAutoAccept(!autoAccept)} className="text-2xl text-indigo-600 focus:outline-none">
                  {autoAccept ? <FiToggleRight className="text-indigo-600" /> : <FiToggleLeft className="text-gray-400" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password / Security */}
        <div className="space-y-6">
          <form onSubmit={handlePasswordChange} className="card p-5 bg-white shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <FiShield /> Security
            </h3>
            
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Current Password</label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                placeholder="••••••••"
                className="input-field text-sm"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">New Password</label>
              <input
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                placeholder="••••••••"
                className="input-field text-sm"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Confirm Password</label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                placeholder="••••••••"
                className="input-field text-sm"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full py-3 text-sm font-semibold shadow-md shadow-indigo-50">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
