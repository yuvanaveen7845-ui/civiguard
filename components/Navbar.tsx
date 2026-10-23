"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import NotificationDropdown from "@/components/NotificationDropdown";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Shield, Sparkles, Activity, FileText, Map, User, LogOut } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <nav className="bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-blue-500/25 group-hover:scale-105 group-hover:shadow-blue-500/40 transition-all duration-300">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tight leading-none">
                  Civic<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Guard</span><span className="text-blue-500 text-xs ml-1 font-mono">AI</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">Smart Public Safety</span>
              </div>
            </Link>
            
            {!isAuthPage && (
              <div className="hidden md:flex items-center space-x-1">
                <Link 
                  href="/" 
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    pathname === "/" 
                      ? "bg-blue-600/15 text-blue-400 border border-blue-500/30" 
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  Home
                </Link>
                <Link 
                  href="/dashboard" 
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    pathname.startsWith("/dashboard") 
                      ? "bg-blue-600/15 text-blue-400 border border-blue-500/30" 
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/complaints/new" 
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    pathname === "/complaints/new" 
                      ? "bg-blue-600/15 text-blue-400 border border-blue-500/30" 
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  File Case
                </Link>
                <Link 
                  href="/map" 
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    pathname === "/map" 
                      ? "bg-blue-600/15 text-blue-400 border border-blue-500/30" 
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  Crime Map
                </Link>
              </div>
            )}
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-3">
            {/* AI Service Live Pill */}
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>FastAPI NLP Live</span>
            </div>

            <ThemeToggle />
            
            {session ? (
              <>
                <NotificationDropdown />
                
                <div className="flex items-center pl-3 border-l border-slate-800 space-x-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-xs font-bold text-white leading-none">{session.user?.name || "Citizen"}</p>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 mt-1">
                      {session.user?.role || "Citizen"}
                    </span>
                  </div>
                  
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20">
                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>

                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    title="Sign Out"
                    className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              !isAuthPage && (
                <div className="flex items-center space-x-2">
                  <Link 
                    href="/login" 
                    className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
                  >
                    Get Started
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
