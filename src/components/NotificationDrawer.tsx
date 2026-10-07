import React from 'react';
import {
  Bell,
  X,
  CheckCheck,
  AlertTriangle,
  Info,
  Building,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationOpen,
    setIsNotificationOpen,
    notifications,
    markNotificationsAsRead,
    unreadNotifsCount
  } = useAnalytics();

  if (!isNotificationOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsNotificationOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-[calc(100vw-1rem)] sm:max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Intelligence Stream
              </h3>
              {unreadNotifsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                  {unreadNotifsCount} New
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {unreadNotifsCount > 0 && (
                <button
                  onClick={markNotificationsAsRead}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={() => setIsNotificationOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-xl border transition ${
                  !n.read
                    ? 'bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/60'
                    : 'bg-slate-50/40 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                    {n.category}
                  </span>
                  <span className="text-slate-400 font-mono">{n.time}</span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {n.title}
                </p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
            Automated alerts powered by National Labour Registry Feeds
          </div>

        </div>
      </div>
    </div>
  );
};
