'use client';
import { useState, useEffect } from 'react';
import { FiBell, FiCheckCircle, FiClock, FiTrash2 } from 'react-icons/fi';

export default function NotificationsPage() {
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Shipment Assigned', message: 'Your shipment #TIQ4KF2M has been assigned to a driver.', time: '2 mins ago', unread: true, type: 'assignment' },
    { id: 2, title: 'Payment Success', message: 'Payment for #TIQ5LG3N was successful.', time: '1 hour ago', unread: true, type: 'payment' },
    { id: 3, title: 'New Quote Available', message: 'A new quote is available for your route: Mumbai -> Delhi', time: '5 hours ago', unread: false, type: 'quote' },
    { id: 4, title: 'System Update', message: 'TransportIQ has been updated to v2026.1. Check out new features!', time: '1 day ago', unread: false, type: 'system' },
    { id: 5, title: 'Document Verified', message: 'Your KYC documents have been verified successfully.', time: '2 days ago', unread: false, type: 'verification' },
  ]);

  useEffect(() => { 
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true); 
  }, []);

  const markAllRead = () => setNotifications(notifications.map(n => ({ ...n, unread: false })));
  const deleteNotification = (id) => setNotifications(notifications.filter(n => n.id !== id));
  const clearAll = () => setNotifications([]);

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 text-sm mt-1">Stay updated with your shipment activities and account alerts</p>
        </div>
        <div className="flex gap-3">
          <button onClick={markAllRead} className="btn-secondary text-sm px-4 py-2 flex items-center gap-2">
            <FiCheckCircle /> Mark all read
          </button>
          <button onClick={clearAll} className="btn-secondary text-sm px-4 py-2 text-red-600 hover:bg-red-50 border-red-100 flex items-center gap-2">
            <FiTrash2 /> Clear all
          </button>
        </div>
      </div>

      <div className="card divide-y divide-gray-100">
        {notifications.length > 0 ? (
          notifications.map(n => (
            <div key={n.id} className={`p-6 flex gap-4 transition-colors hover:bg-gray-50/50 ${n.unread ? 'bg-indigo-50/30' : ''}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                n.type === 'assignment' ? 'bg-emerald-50 text-emerald-600' :
                n.type === 'payment' ? 'bg-amber-50 text-amber-600' :
                n.type === 'quote' ? 'bg-indigo-50 text-indigo-600' :
                'bg-gray-50 text-gray-600'
              }`}>
                <FiBell className="text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-bold text-gray-900 ${n.unread ? 'text-indigo-900' : ''}`}>{n.title}</h3>
                  <span className="text-xs text-gray-400 flex items-center gap-1"><FiClock />{n.time}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{n.message}</p>
                {n.unread && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">New Notification</span>
                  </div>
                )}
              </div>
              <button 
                onClick={() => deleteNotification(n.id)}
                className="p-2 text-gray-300 hover:text-red-500 transition-colors self-start"
                title="Delete"
              >
                <FiTrash2 />
              </button>
            </div>
          ))
        ) : (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBell className="text-4xl text-gray-200" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">All caught up!</h3>
            <p className="text-gray-500 mt-1">You have no new or archived notifications at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
