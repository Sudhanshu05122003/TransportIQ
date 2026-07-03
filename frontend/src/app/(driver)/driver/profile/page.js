'use client';
import { useState, useEffect } from 'react';
import { FiUser, FiPhone, FiMail, FiCheckCircle, FiFileText, FiUpload, FiTruck, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProfileKYCPage() {
  const [mounted, setMounted] = useState(false);
  const [kycStatus, setKycStatus] = useState('verified'); // verified, pending, unsubmitted
  const [form, setForm] = useState({
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh.kumar@gmail.com',
    phone: '+91 97231 33850',
    licenseNo: 'DL-1420210087452',
    aadhaarNo: '5482 9104 3302',
    vehicleNo: 'MH 12 AB 3456',
    vehicleType: 'HCV (Heavy Commercial Vehicle)'
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast.success('Profile settings updated successfully!');
  };

  const handleUploadDoc = (docType) => {
    toast.success(`${docType} upload simulation started! Document uploaded.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile & KYC</h1>
          <p className="text-gray-500 text-sm">Manage your profile information and check your verification status</p>
        </div>
        <div>
          {kycStatus === 'verified' && (
            <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 text-sm flex items-center gap-1.5 font-semibold rounded-full">
              <FiCheckCircle /> KYC Verified
            </span>
          )}
          {kycStatus === 'pending' && (
            <span className="badge bg-amber-50 text-amber-700 border border-amber-200 px-4 py-2 text-sm flex items-center gap-1.5 font-semibold rounded-full">
              <FiAlertCircle className="animate-spin" /> Verification Pending
            </span>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Details Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveProfile} className="card p-6 bg-white shadow-sm space-y-6">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3">Personal Details</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">First Name</label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                    <FiUser className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="input-field"
                    style={{ paddingLeft: '4rem' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Last Name</label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                    <FiUser className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="input-field"
                    style={{ paddingLeft: '4rem' }}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                    <FiMail className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field"
                    style={{ paddingLeft: '4rem' }}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Phone Number</label>
                <div className="relative group opacity-60">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={form.phone}
                    className="input-field bg-gray-50 cursor-not-allowed"
                    style={{ paddingLeft: '4rem' }}
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" className="btn-primary px-8 py-3.5 shadow-lg shadow-indigo-100">
                Save Changes
              </button>
            </div>
          </form>

          {/* Vehicle Information */}
          <div className="card p-6 bg-white shadow-sm space-y-6">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2"><FiTruck /> Assigned Vehicle Info</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 border border-gray-150 rounded-xl p-4">
                <span className="text-xs text-gray-400 font-semibold block uppercase">Registration Number</span>
                <span className="text-lg font-black text-gray-800 mt-1 block tracking-wider">{form.vehicleNo}</span>
              </div>
              <div className="bg-gray-50 border border-gray-150 rounded-xl p-4">
                <span className="text-xs text-gray-400 font-semibold block uppercase">Vehicle Type / Dialect</span>
                <span className="text-sm font-semibold text-gray-700 mt-1 block">{form.vehicleType}</span>
              </div>
            </div>
          </div>
        </div>

        {/* KYC Verification Uploads */}
        <div className="space-y-6">
          <div className="card p-5 bg-white shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3">KYC Documents</h3>

            {/* DL */}
            <div className="border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg"><FiFileText /></div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-gray-800">Driving License</div>
                  <div className="text-xs text-gray-400">No: {form.licenseNo}</div>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-100 uppercase">Verified</span>
              </div>
              <button
                type="button"
                onClick={() => handleUploadDoc('Driving License')}
                className="w-full border border-dashed border-gray-200 hover:border-indigo-400 py-3 rounded-lg text-xs font-semibold text-gray-500 hover:text-indigo-600 flex items-center justify-center gap-1.5 transition-colors"
              >
                <FiUpload /> Re-upload Document
              </button>
            </div>

            {/* Aadhaar */}
            <div className="border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg"><FiFileText /></div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-gray-800">Aadhaar Card</div>
                  <div className="text-xs text-gray-400">No: {form.aadhaarNo}</div>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-100 uppercase">Verified</span>
              </div>
              <button
                type="button"
                onClick={() => handleUploadDoc('Aadhaar Card')}
                className="w-full border border-dashed border-gray-200 hover:border-indigo-400 py-3 rounded-lg text-xs font-semibold text-gray-500 hover:text-indigo-600 flex items-center justify-center gap-1.5 transition-colors"
              >
                <FiUpload /> Re-upload Document
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
