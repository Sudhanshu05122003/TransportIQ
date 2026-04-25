import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'TransportIQ — India\'s Smartest Logistics Platform',
  description: 'Real-time transportation, logistics, and supply chain management platform for India. Book shipments, manage fleets, track deliveries, and optimize routes.',
  keywords: 'logistics, transportation, India, fleet management, shipment tracking, supply chain',
  openGraph: {
    title: 'TransportIQ — India\'s Smartest Logistics Platform',
    description: 'Book shipments, manage fleets, and track deliveries in real-time across India.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>

      <body className="antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#f8fafc',
                borderRadius: '12px',
                padding: '14px 20px',
                fontSize: '14px',
                fontWeight: 500
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
