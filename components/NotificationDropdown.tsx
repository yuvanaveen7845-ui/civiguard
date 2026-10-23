"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Bell, CheckCircle2, Sparkles, X } from "lucide-react";

export default function NotificationDropdown() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!session) return;
    async function loadNotifs() {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          setNotifications(await res.json());
        }
      } catch(e){}
    }
    loadNotifs();
    const interval = setInterval(loadNotifs, 30000);
    return () => clearInterval(interval);
  }, [session]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await fetch("/api/notifications/mark-read", { method: "POST" });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch(e) {}
  };

  return (
    <div className="relative">
      <button 
        onClick={() => { setIsOpen(!isOpen); if(!isOpen) markAsRead(); }}
        className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all shadow-md border border-slate-700/80"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-slate-900"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> System Alerts
            </h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold bg-blue-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-blue-500/30">
                {unreadCount} New
              </span>
            )}
          </div>
          
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2 opacity-60" />
                <span className="text-xs font-bold text-slate-400">All alerts cleared.</span>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {notifications.map(n => (
                  <div key={n._id} className={`p-3.5 text-xs transition-colors flex items-start ${!n.isRead ? 'bg-blue-500/10' : 'hover:bg-slate-800/40'}`}>
                    <div className={`mt-1 w-2 h-2 rounded-full mr-2.5 flex-shrink-0 ${!n.isRead ? 'bg-cyan-400 glow-blue' : 'bg-transparent'}`}></div>
                    <div className="flex-1">
                      <p className={`text-slate-200 leading-snug ${!n.isRead ? 'font-bold' : 'font-medium'}`}>{n.message}</p>
                      <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-2.5 bg-slate-950/80 border-t border-slate-800 text-center">
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Close Alerts
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
