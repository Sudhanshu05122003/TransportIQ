'use client';
import { useState, useEffect } from 'react';
import { FiBell, FiCheckCircle, FiClock, FiTrash2 } from 'react-icons/fi';

export default function NotificationsPage() {
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New User Awaiting Approval', message: 'A new Transporter user "SuperExpress Logistics" has registered and is pending KYC document verification.', time: '12 mins ago', unread: true, type: 'approval' },
    { id: 2, title: 'Database Lag Warning', message: 'Critical Alert: Primary database replication lag has exceeded 500ms.', time: '45 mins ago', unread: true, type: 'system' },
    { id: 3, title: 'High-Value Shipment Created', message: 'Shipment #TIQ9P1XS contains high-value electronics cargo (> ₹10,00,000). Route: Chennai ➔ Delhi.', time: '4 hours ago', unread: false, type: 'audit' },
    { id: 4, title: 'API Gateway Scaling', message: 'System auto-scaled: Added 2 container instances to handle peak API load.', time: '1 day ago', unread: false, type: 'system' }
  ]);

  useEffect(() => { 
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
          <h1 className="text-2xl font-bold text-gray-900">Admin notifications</h1>
          <p className="text-gray-500 text-sm mt-1">Platform operations, system health, security audits, and pending user approvals</p>
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
                n.type === 'approval' ? 'bg-indigo-50 text-indigo-600' :
                n.type === 'system' ? 'bg-red-50 text-red-600' :
                n.type === 'audit' ? 'bg-emerald-50 text-emerald-600' :
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
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">New</span>
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
            <p className="text-gray-500 mt-1">You have no system notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
}
