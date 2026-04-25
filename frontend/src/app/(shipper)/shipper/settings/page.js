'use client';
import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiCheckCircle, FiSettings } from 'react-icons/fi';

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <div className="card p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">First Name</label>
            <div className="relative group">
              <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                <FiUser className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input className="input-field" style={{ paddingLeft: '4rem' }} placeholder="Your name" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Last Name</label>
            <div className="relative group">
              <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                <FiUser className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input className="input-field" style={{ paddingLeft: '4rem' }} placeholder="Last name" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email Address</label>
            <div className="relative group">
              <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                <FiMail className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input type="email" className="input-field" style={{ paddingLeft: '4rem' }} placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Phone Number</label>
            <div className="relative group opacity-60">
              <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                <FiPhone className="text-gray-400" />
              </div>
              <input className="input-field bg-gray-50" style={{ paddingLeft: '4rem' }} placeholder="+91 98765 43210" disabled />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Company Name</label>
            <div className="relative group">
              <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                <FiBriefcase className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input className="input-field" style={{ paddingLeft: '4rem' }} placeholder="Company name" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">GSTIN</label>
            <div className="relative group">
              <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                <FiCheckCircle className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input className="input-field" style={{ paddingLeft: '4rem' }} placeholder="22AAAAA0000A1Z5" />
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-8">
          <button className="btn-primary px-10 py-3.5 shadow-lg shadow-indigo-100">Save Changes</button>
        </div>
      </div>

    </div>
  );
}
