'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FiTruck, FiMenu, FiX, FiBell, FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi';

export default function DashboardLayout({ children, navItems, roleLabel }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  // Note: For a real app, unread count would come from a global state or API
  const unreadCount = 2; 

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleLogout = () => { logout(); router.push('/'); };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-2 p-5 border-b border-gray-100">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center"><FiTruck className="text-white text-lg" /></div>
          <div><span className="font-bold text-gray-900">Transport</span><span className="font-bold text-indigo-600">IQ</span>
            <div className="text-xs text-gray-400 font-medium">{roleLabel}</div></div>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={`sidebar-link ${isActive ? 'active' : ''}`}>
                <item.icon className="text-lg" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
              <FiMenu className="text-xl" />
            </button>
            <div className="flex items-center gap-3">
              <Link 
                href="/shipper/notifications"
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                onClick={() => setProfileOpen(false)}
              >
                <FiBell className={`text-xl ${pathname === '/shipper/notifications' ? 'text-indigo-600' : 'text-gray-600'} group-hover:text-indigo-600 transition-colors`} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <div className="relative">
                <button 
                  onClick={() => setProfileOpen(!profileOpen)} 
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
                    {user?.first_name?.[0] || 'U'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">{user?.first_name}</span>
                  <FiChevronDown className="text-gray-400 text-sm" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <Link href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><FiUser />Profile</Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"><FiLogOut />Logout</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
