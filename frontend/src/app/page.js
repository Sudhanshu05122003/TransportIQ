'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiTruck, FiMapPin, FiShield, FiClock, FiBarChart2, FiUsers, FiArrowRight, FiMenu, FiX, FiCheckCircle, FiZap, FiGlobe } from 'react-icons/fi';

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const stats = [
    { value: '50K+', label: 'Shipments Delivered' },
    { value: '12K+', label: 'Active Transporters' },
    { value: '500+', label: 'Cities Covered' },
    { value: '99.2%', label: 'On-Time Delivery' }
  ];

  const features = [
    { icon: FiTruck, title: 'Smart Shipment Booking', desc: 'Book shipments with intelligent pricing, vehicle matching, and real-time fare estimates across India.' },
    { icon: FiMapPin, title: 'Live GPS Tracking', desc: 'Track every shipment in real-time with 3-second GPS updates, route visualization, and ETA predictions.' },
    { icon: FiShield, title: 'Secure Payments', desc: 'UPI, cards, wallets, and COD support via Razorpay. GST-compliant invoicing built-in.' },
    { icon: FiClock, title: 'AI-Powered ETA', desc: 'Machine learning based arrival predictions considering traffic, road conditions, and historical data.' },
    { icon: FiBarChart2, title: 'Fleet Analytics', desc: 'Comprehensive dashboards for fleet utilization, driver performance, and revenue analytics.' },
    { icon: FiUsers, title: 'Driver Network', desc: 'Access thousands of verified drivers with KYC, auto-matching, and performance tracking.' }
  ];

  const roles = [
    { title: 'Shippers', desc: 'Book & track shipments effortlessly', icon: '📦', color: 'from-blue-500 to-indigo-600', link: '/register?role=shipper' },
    { title: 'Transporters', desc: 'Manage fleets & maximize earnings', icon: '🚛', color: 'from-emerald-500 to-teal-600', link: '/register?role=transporter' },
    { title: 'Drivers', desc: 'Accept trips & earn more', icon: '🧑‍✈️', color: 'from-amber-500 to-orange-600', link: '/register?role=driver' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white border-b border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <FiTruck className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Transport<span className="text-indigo-600">IQ</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {['Features', 'How it Works', 'Pricing'].map(item => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                   className="text-sm font-medium transition-colors text-gray-600 hover:text-indigo-600">
                  {item}
                </a>
              ))}
              <Link href="/login" className="btn-secondary text-sm">Log In</Link>
              <Link href="/register" className="btn-primary text-sm">Get Started</Link>
            </div>

            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden">
              <FiMenu className="text-2xl text-gray-900" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div className="md:hidden bg-white border-t border-gray-100 p-4 shadow-xl">
            <div className="flex flex-col gap-3">
              <Link href="/login" className="btn-secondary text-center">Log In</Link>
              <Link href="/register" className="btn-primary text-center">Get Started</Link>
            </div>
          </div>
        )}
      </nav>


      {/* Hero Section */}
      <section className="gradient-hero min-h-screen flex flex-col justify-center relative overflow-hidden py-24 lg:py-32">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-8 border border-white/10">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-ring"></span>
                <span className="text-emerald-400 text-xs sm:text-sm font-medium tracking-wide uppercase">Live across 500+ Indian cities</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-8">
                Move Goods
                <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Smarter & Faster
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-lg leading-relaxed opacity-90">
                India's most intelligent logistics platform. Book shipments, track in real-time, 
                manage fleets, and optimize your entire supply chain — all in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 mb-16">
                <Link href="/register" className="btn-primary text-base px-10 py-4 flex items-center justify-center gap-2 group shadow-2xl">
                  Start Shipping <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/login" className="bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-xl font-semibold text-center transition-all border border-white/20">
                  Transporter Login
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-gray-400">
                <div className="flex items-center gap-2 font-medium"><FiCheckCircle className="text-emerald-400" /> GST Compliant</div>
                <div className="flex items-center gap-2 font-medium"><FiZap className="text-amber-400" /> Real-time Tracking</div>
                <div className="flex items-center gap-2 font-medium"><FiGlobe className="text-blue-400" /> Pan India</div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hidden lg:flex justify-center animate-slide-up stagger-2">
              <div className="relative scale-110">
                {/* Map visualization mockup */}
                <div className="w-[520px] h-[440px] rounded-3xl bg-slate-900 border border-white/10 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] p-8 relative overflow-hidden">
                  {/* Simulated map grid */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                  }}></div>

                  {/* Route line */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 520 440">
                    <path d="M 100 340 Q 180 220 280 200 Q 380 180 440 100" stroke="url(#routeGradient)" strokeWidth="4" fill="none" strokeDasharray="12 6" opacity="0.8" />
                    <defs>
                      <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                    <circle cx="100" cy="340" r="10" fill="#6366f1" />
                    <circle cx="100" cy="340" r="18" fill="none" stroke="#6366f1" strokeWidth="2" opacity="0.3" />
                    <circle cx="440" cy="100" r="10" fill="#10b981" />
                    <circle cx="440" cy="100" r="18" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.3" />
                    <circle cx="280" cy="200" r="8" fill="#f59e0b">
                      <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </svg>

                  {/* Info cards */}
                  <div className="absolute top-6 left-6 bg-slate-900/90 rounded-xl p-4 border border-white/20 shadow-xl">
                    <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Shipment #TIQ4KF2M</div>
                    <div className="text-base text-white font-bold">Mumbai → Delhi</div>
                    <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1.5 font-medium">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> In Transit
                    </div>
                  </div>

                  <div className="absolute bottom-6 right-6 bg-slate-900/90 rounded-xl p-4 border border-white/20 shadow-xl">
                    <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Estimated Arrival</div>
                    <div className="text-2xl text-white font-black">14h 32m</div>
                    <div className="text-xs text-indigo-400 font-medium">1,398 km remaining</div>
                  </div>
                </div>

                {/* Floating notification cards */}
                <div className="absolute -right-12 top-12 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-5 w-60 animate-float border border-gray-100 hidden xl:block">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <FiCheckCircle className="text-emerald-600 text-xl" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">Delivered!</div>
                      <div className="text-xs text-gray-500 font-medium">Pune → Hyderabad</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -left-12 bottom-24 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-5 w-60 animate-float hidden xl:block" style={{ animationDelay: '2s' }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                      <FiTruck className="text-indigo-600 text-xl" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">Driver Matched</div>
                      <div className="text-xs text-gray-500 font-medium">2.3 km away</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section with improved proportions */}
          <div className="mt-24 lg:mt-32">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {stats.map((stat, i) => (
                  <div key={stat.label} className={`glass rounded-2xl p-8 lg:p-10 text-center shadow-2xl animate-slide-up stagger-${i + 1} flex flex-col justify-center h-full min-h-[160px]`}>
                    <div className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm lg:text-base text-gray-500 font-semibold tracking-wide uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* Features Section */}
      <section id="features" className="py-24 bg-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-4">
              Platform Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Move India</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              From booking to delivery, our platform handles the entire logistics lifecycle with intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={feature.title} className={`card p-8 group animate-slide-up stagger-${(i % 4) + 1}`}>
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection CTA */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Get Started in Minutes</h2>
            <p className="text-gray-500 text-lg">Choose your role and join India's fastest growing logistics network.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {roles.map((role, i) => (
              <Link key={role.title} href={role.link}
                className={`relative rounded-2xl p-8 text-center group hover:scale-105 transition-all duration-300 animate-slide-up stagger-${i + 1}`}>
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${role.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                <div className="relative">
                  <div className="text-5xl mb-4">{role.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{role.title}</h3>
                  <p className="text-gray-500 mb-6">{role.desc}</p>
                  <div className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm group-hover:gap-3 transition-all">
                    Register Now <FiArrowRight />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <FiTruck className="text-white text-xl" />
                </div>
                <span className="text-xl font-bold">Transport<span className="text-indigo-400">IQ</span></span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                India's smartest logistics platform connecting shippers, transporters, and drivers in one unified ecosystem.
              </p>
            </div>

            {[
              { title: 'Platform', links: ['Shipper Portal', 'Transporter Hub', 'Driver App', 'Admin Panel'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Contact'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'GST Compliance', 'Data Security'] }
            ].map(section => (
              <div key={section.title}>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">© 2026 TransportIQ. All rights reserved.</p>
            <p className="text-sm text-gray-500">Made with ❤️ for India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
