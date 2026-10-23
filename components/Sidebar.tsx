"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, FileText, Map as MapIcon, BarChart3, LogOut, Shield, ShieldCheck, Activity, Cpu } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, badge: "Live" },
    { name: "File Case Report", href: "/complaints/new", icon: FileText, badge: "AI" },
    { name: "Live Crime Map", href: "/map", icon: MapIcon, badge: "Radar" },
  ];

  if (session?.user?.role === "Admin" || !session) {
    links.push({ name: "Admin Analytics", href: "/admin/analytics", icon: BarChart3, badge: "PRO" });
  }

  return (
    <aside className="w-64 bg-slate-900/60 dark:bg-slate-950/60 backdrop-blur-xl border-r border-slate-800/80 hidden lg:flex flex-col h-[calc(100vh-4rem)] sticky top-16 shadow-2xl">
      <div className="p-4 flex-1 overflow-y-auto space-y-6">
        
        {/* User Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-800/60 to-slate-900/60 border border-slate-700/50 shadow-inner">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/30">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white truncate">{session?.user?.name || "Civic Citizen"}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{session?.user?.role || "Citizen"}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-3 flex items-center justify-between">
            <span>Navigation Hub</span>
            <Activity className="w-3 h-3 text-blue-500" />
          </div>

          <nav className="space-y-1.5">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 text-xs font-bold ${
                    isActive 
                      ? "bg-gradient-to-r from-blue-600/20 to-cyan-600/10 text-white border border-blue-500/40 shadow-lg shadow-blue-500/10" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    {link.name}
                  </div>
                  {link.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono font-bold ${
                      isActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* AI System Badge */}
        <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-900/40">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Dispatch Engine</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Automated NLP classification & cryptographic evidence sealing active.
          </p>
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center justify-center w-full px-3 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 transition-all"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect Session
        </button>
      </div>
    </aside>
  );
}
