'use client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { FiHome, FiPackage, FiPlus, FiMapPin, FiCreditCard, FiSettings } from 'react-icons/fi';

const navItems = [
  { href: '/shipper/dashboard', label: 'Dashboard', icon: FiHome },
  { href: '/shipper/book', label: 'Book Shipment', icon: FiPlus },
  { href: '/shipper/shipments', label: 'My Shipments', icon: FiPackage },
  { href: '/shipper/tracking', label: 'Live Tracking', icon: FiMapPin },
  { href: '/shipper/payments', label: 'Payments', icon: FiCreditCard },
  { href: '/shipper/settings', label: 'Settings', icon: FiSettings },
];

export default function ShipperLayout({ children }) {
  return <DashboardLayout navItems={navItems} roleLabel="Shipper Portal">{children}</DashboardLayout>;
}
