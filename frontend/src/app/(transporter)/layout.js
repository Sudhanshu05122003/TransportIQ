'use client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { FiHome, FiTruck, FiUsers, FiPackage, FiDollarSign, FiSettings } from 'react-icons/fi';

const navItems = [
  { href: '/transporter/dashboard', label: 'Dashboard', icon: FiHome },
  { href: '/transporter/fleet', label: 'Fleet', icon: FiTruck },
  { href: '/transporter/drivers', label: 'Drivers', icon: FiUsers },
  { href: '/transporter/shipments', label: 'Shipments', icon: FiPackage },
  { href: '/transporter/earnings', label: 'Earnings', icon: FiDollarSign },
  { href: '/transporter/settings', label: 'Settings', icon: FiSettings },
];

export default function TransporterLayout({ children }) {
  return <DashboardLayout navItems={navItems} roleLabel="Fleet Owner">{children}</DashboardLayout>;
}
