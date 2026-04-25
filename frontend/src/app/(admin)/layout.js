'use client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { FiHome, FiUsers, FiPackage, FiDollarSign, FiBarChart2, FiSettings, FiSliders } from 'react-icons/fi';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: FiHome },
  { href: '/admin/users', label: 'Users', icon: FiUsers },
  { href: '/admin/shipments', label: 'Shipments', icon: FiPackage },
  { href: '/admin/pricing', label: 'Pricing', icon: FiSliders },
  { href: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 },
  { href: '/admin/settings', label: 'Settings', icon: FiSettings },
];

export default function AdminLayout({ children }) {
  return <DashboardLayout navItems={navItems} roleLabel="Admin Panel">{children}</DashboardLayout>;
}
