'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/lib/api';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company_name: '',
    gstin: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        company_name: user.company_name || '',
        gstin: user.gstin || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.updateProfile(form);
      if (response.success) {
        setUser(response.data);
        toast.success('Transporter profile updated successfully!');
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      const errMsg = error.errors?.map(e => e.message).join(', ') || error.message || 'Failed to update profile';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      
      <form onSubmit={handleSubmit} className="card p-8 bg-white shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Settings (Transporter Portal)</h2>
        
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">First Name</label>
            <div className="relative group">
              <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                <FiUser className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input 
                value={form.first_name}
                onChange={e => setForm({ ...form, first_name: e.target.value })}
                className="input-field" 
                style={{ paddingLeft: '4rem' }} 
                placeholder="Your name" 
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
                value={form.last_name}
                onChange={e => setForm({ ...form, last_name: e.target.value })}
                className="input-field" 
                style={{ paddingLeft: '4rem' }} 
                placeholder="Last name" 
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
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-field" 
                style={{ paddingLeft: '4rem' }} 
                placeholder="you@example.com" 
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
                className="input-field bg-gray-50 cursor-not-allowed" 
                style={{ paddingLeft: '4rem' }} 
                placeholder="+91 98765 43210" 
                value={user?.phone || ''}
                disabled 
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Company Name</label>
            <div className="relative group">
              <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                <FiBriefcase className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input 
                value={form.company_name}
                onChange={e => setForm({ ...form, company_name: e.target.value })}
                className="input-field" 
                style={{ paddingLeft: '4rem' }} 
                placeholder="Company name" 
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">GSTIN</label>
            <div className="relative group">
              <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                <FiCheckCircle className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input 
                value={form.gstin}
                onChange={e => setForm({ ...form, gstin: e.target.value })}
                className="input-field" 
                style={{ paddingLeft: '4rem' }} 
                placeholder="22AAAAA0000A1Z5" 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-8">
          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary px-10 py-3.5 shadow-lg shadow-indigo-100 disabled:opacity-60 flex items-center gap-2"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
