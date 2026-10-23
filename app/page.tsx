import Link from "next/link";
import { Shield, BrainCircuit, Lock, MapPin, Zap, ArrowRight, CheckCircle2, Activity, Sparkles, Scale, Users, ShieldAlert } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen relative overflow-hidden">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[600px] -left-40 w-[600px] h-[600px] bg-cyan-600/10 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[800px] -right-40 w-[600px] h-[600px] bg-purple-600/10 blur-[140px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-36 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-blue-500/30 text-xs font-bold text-blue-300 shadow-xl shadow-blue-500/10 backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>Civic Safety 2.0 &bull; Powered by FastAPI NLP & Cryptographic SHA-256</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white">
            Next-Gen AI Platform for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
              Civic Safety & Justice
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Report incidents instantly, seal tamper-proof evidence with cryptographic hashes, and track real-time police dispatch powered by automated NLP risk scoring.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/complaints/new" 
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-black text-sm tracking-wide shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-cyan-200" />
              File Incident Report
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link 
              href="/dashboard" 
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700/80 shadow-lg hover:border-slate-600 transition-all flex items-center justify-center gap-2"
            >
              <Activity className="w-4 h-4 text-blue-400" />
              Open Command Center
            </Link>

            <Link 
              href="/map" 
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-sm border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4 text-red-400" />
              Live Heatmap
            </Link>
          </div>

          {/* Live Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto">
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
              <p className="text-3xl font-black text-white">99.8%</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Uptime SLA</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
              <p className="text-3xl font-black text-cyan-400">&lt; 350ms</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">AI NLP Latency</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
              <p className="text-3xl font-black text-indigo-400">SHA-256</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Tamper Proofing</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
              <p className="text-3xl font-black text-emerald-400">Real-time</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">GPS Hotspot Tracking</p>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Engineered for Security, Speed &amp; Integrity
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto font-medium">
            Bridging citizens, patrol teams, and judicial authorities with tamper-evident digital architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 hover:border-blue-500/40 shadow-xl group transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI Incident Triage</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              FastAPI Python backend analyzes incident details in real-time, extracts keywords, flags high-threat situations, and suggests optimal dispatch priority.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 hover:border-emerald-500/40 shadow-xl group transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Cryptographic Evidence Vault</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every uploaded image, audio, or video is stamped with an immutable SHA-256 hash at ingress, making records 100% admissible and verifiable for court.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 hover:border-cyan-500/40 shadow-xl group transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white transition-all">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Live Hotspot Heatmaps</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Interactive Leaflet maps highlight geographical crime densities, active investigation statuses, and automatic hotspot clustering for proactive patrols.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-sm font-black text-white">CivicGuardAI Platform</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} CivicGuardAI. All rights reserved. Encrypted &amp; Secure.
          </p>
          <div className="flex gap-4 text-xs font-bold text-slate-400">
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link href="/register" className="hover:text-white transition-colors">Register</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
