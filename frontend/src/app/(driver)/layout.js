'use client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { FiHome, FiNavigation, FiDollarSign, FiClock, FiUser, FiSettings } from 'react-icons/fi';

const navItems = [
  { href: '/driver/dashboard', label: 'Dashboard', icon: FiHome },
  { href: '/driver/trip', label: 'Active Trip', icon: FiNavigation },
  { href: '/driver/earnings', label: 'Earnings', icon: FiDollarSign },
  { href: '/driver/history', label: 'Trip History', icon: FiClock },
  { href: '/driver/profile', label: 'Profile & KYC', icon: FiUser },
  { href: '/driver/settings', label: 'Settings', icon: FiSettings },
];

export default function DriverLayout({ children }) {
  return <DashboardLayout navItems={navItems} roleLabel="Driver App">{children}</DashboardLayout>;
}
