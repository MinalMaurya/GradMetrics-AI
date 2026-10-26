import React from 'react';
import {
  Bell,
  X,
  CheckCheck
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';
import { Drawer } from './Modal';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationOpen,
    setIsNotificationOpen,
    notifications,
    markNotificationsAsRead,
    unreadNotifsCount
  } = useAnalytics();

  return (
    <Drawer
      isOpen={isNotificationOpen}
      onClose={() => setIsNotificationOpen(false)}
      position="right"
      maxWidth="sm:max-w-md"
      ariaLabel="Intelligence Stream Notifications"
    >
      {/* Header */}
      <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40 shrink-0">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
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
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
          <button
            onClick={() => setIsNotificationOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Close notification drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div
        className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3"
        style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
      >
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-3.5 rounded-xl border transition ${
              !n.read
                ? 'bg-blue-50/40 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/60'
                : 'bg-slate-50/40 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
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
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 shrink-0">
        Automated alerts powered by National Labour Registry Feeds
      </div>
    </Drawer>
  );
};
