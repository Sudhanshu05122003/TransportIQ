'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FiTruck, FiPhone, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('password');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ phone: '', password: '', otp: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login({ phone: form.phone, password: form.password });
      toast.success(`Welcome back, ${user.first_name}!`);
      const routes = { shipper: '/shipper/dashboard', transporter: '/transporter/dashboard', driver: '/driver/dashboard', admin: '/admin/dashboard' };
      router.push(routes[user.role] || '/');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay:'2s'}} />
        </div>
        <div className="relative z-10 max-w-md">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center"><FiTruck className="text-white text-2xl" /></div>
            <span className="text-2xl font-bold text-white">Transport<span className="text-indigo-400">IQ</span></span>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-4">Welcome Back</h2>
          <p className="text-gray-400 text-lg leading-relaxed">Access your dashboard to manage shipments, track deliveries, and grow your business.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h1>
          <p className="text-gray-500 mb-8">Enter your credentials to access your account</p>
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            {['password','otp'].map(t=>(
              <button key={t} onClick={()=>setTab(t)} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab===t?'bg-white text-indigo-600 shadow-sm':'text-gray-500'}`}>{t==='password'?'Password':'OTP Login'}</button>
            ))}
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Phone Number</label>
              <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                  <FiPhone className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input 
                  type="tel" 
                  value={form.phone} 
                  onChange={e=>setForm({...form,phone:e.target.value})} 
                  className="input-field" 
                  style={{ paddingLeft: '4rem' }}
                  placeholder="+91 98765 43210" 
                  required 
                />
              </div>
            </div>
            {tab==='password'&&(
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-700 block">Password</label>
                  <Link href="/forgot-password" size="sm" className="text-xs text-indigo-600 hover:underline font-medium">Forgot?</Link>
                </div>
                <div className="relative group">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 pointer-events-none border-r border-gray-200">
                    <FiLock className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input 
                    type={showPw?'text':'password'} 
                    value={form.password} 
                    onChange={e=>setForm({...form,password:e.target.value})} 
                    className="input-field" 
                    style={{ paddingLeft: '4rem', paddingRight: '3rem' }}
                    placeholder="Enter your password" 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={()=>setShowPw(!showPw)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>
            )}
            {tab==='otp'&&(
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">One-Time Password</label>
                <input 
                  type="text" 
                  maxLength={6} 
                  value={form.otp} 
                  onChange={e=>setForm({...form,otp:e.target.value})} 
                  className="input-field text-center tracking-[0.8em] text-xl font-bold" 
                  placeholder="••••••" 
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">Didn&apos;t receive it?</span>
                  <button type="button" className="text-indigo-600 text-sm font-semibold hover:underline">Resend OTP</button>
                </div>
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-indigo-200 mt-2">
              {loading?<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>:<>Sign In to Account <FiArrowRight/></>}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">Don&apos;t have an account? <Link href="/register" className="text-indigo-600 font-semibold hover:underline">Create Account</Link></p>
        </div>
      </div>
    </div>
  );
}
