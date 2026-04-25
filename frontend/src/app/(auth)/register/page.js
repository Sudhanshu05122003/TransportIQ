'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FiTruck, FiPhone, FiLock, FiUser, FiMail, FiArrowRight, FiBriefcase } from 'react-icons/fi';
import toast from 'react-hot-toast';

function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    role: searchParams.get('role') || 'shipper',
    first_name: '', last_name: '', phone: '', email: '', password: '', company_name: '', gstin: ''
  });

  const roles = [
    { key: 'shipper', label: 'Shipper', desc: 'Book & track shipments', icon: '📦' },
    { key: 'transporter', label: 'Transporter', desc: 'Manage fleet & drivers', icon: '🚛' },
    { key: 'driver', label: 'Driver', desc: 'Accept trips & earn', icon: '🧑‍✈️' }
  ];

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(form);
      toast.success('Account created successfully!');
      const routes = { shipper: '/shipper/dashboard', transporter: '/transporter/dashboard', driver: '/driver/dashboard' };
      router.push(routes[user.role] || '/');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-float" />
        </div>
        <div className="relative z-10 max-w-md">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center"><FiTruck className="text-white text-2xl" /></div>
            <span className="text-2xl font-bold text-white">Transport<span className="text-indigo-400">IQ</span></span>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-4">Join India&apos;s #1 Logistics Network</h2>
          <p className="text-gray-400 text-lg">Connect with thousands of shippers, transporters, and drivers across 500+ cities.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-500 mb-6">Step {step} of 2</p>
          <div className="flex gap-2 mb-8">{[1,2].map(s=>(<div key={s} className={`flex-1 h-1.5 rounded-full ${s<=step?'gradient-primary':'bg-gray-200'}`}/>))}</div>

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-700 mb-3">I am a...</p>
              <div className="grid gap-3">
                {roles.map(r => (
                  <button key={r.key} type="button" onClick={() => { setForm({...form, role: r.key}); setStep(2); }}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${form.role===r.key?'border-indigo-500 bg-indigo-50':'border-gray-200 hover:border-indigo-300'}`}>
                    <span className="text-3xl">{r.icon}</span>
                    <div><div className="font-semibold text-gray-900">{r.label}</div><div className="text-sm text-gray-500">{r.desc}</div></div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">First Name</label>
                  <input value={form.first_name} onChange={e=>setForm({...form,first_name:e.target.value})} className="input-field" placeholder="e.g. Rajesh" required />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Last Name</label>
                  <input value={form.last_name} onChange={e=>setForm({...form,last_name:e.target.value})} className="input-field" placeholder="e.g. Kumar" />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Phone Number</label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                    <FiPhone className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="input-field" style={{ paddingLeft: '4rem' }} placeholder="+91 98765 43210" required />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email Address <span className="text-gray-400 font-normal">(optional)</span></label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                    <FiMail className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="input-field" style={{ paddingLeft: '4rem' }} placeholder="you@example.com" />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Password</label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                    <FiLock className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="input-field" style={{ paddingLeft: '4rem' }} placeholder="Minimum 8 characters" required />
                </div>
              </div>

              {(form.role === 'shipper' || form.role === 'transporter') && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Company Name</label>
                  <div className="relative group">
                    <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                      <FiBriefcase className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input value={form.company_name} onChange={e=>setForm({...form,company_name:e.target.value})} className="input-field" style={{ paddingLeft: '4rem' }} placeholder="Your Company Pvt. Ltd." />
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={()=>setStep(1)} className="btn-secondary flex-1 py-3.5">Back</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3.5 disabled:opacity-60">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Account <FiArrowRight /></>}
                </button>
              </div>
            </form>
          )}


          <p className="text-center text-sm text-gray-500 mt-8">Already have an account? <Link href="/login" className="text-indigo-600 font-semibold hover:underline">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <RegisterForm />
    </Suspense>
  );
}
