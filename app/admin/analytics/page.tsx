"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BarChart3, TrendingUp, ShieldCheck, Clock, AlertTriangle, BrainCircuit, Activity, ArrowUpRight } from "lucide-react";

export default function AnalyticsDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/admin/analytics");
        if (res.ok) {
          setData(await res.json());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [session]);

  if (loading) return (
    <div className="p-16 text-center text-slate-500 font-mono text-xs flex flex-col items-center gap-2">
      <Activity className="w-6 h-6 animate-spin text-cyan-400" />
      <span>Aggregating Platform Intelligence...</span>
    </div>
  );
  
  if (!data) return <div className="p-10 text-center font-medium text-slate-500">Analytics unavailable</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-12">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
            Executive Intelligence
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Judicial &amp; Police Analytics
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1 font-medium">
          Comprehensive overview of case closure rates, threat severity distribution, and NLP model performance.
        </p>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest">Total Reports</span>
            <BarChart3 className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-4xl font-black text-white">{data.totalCases}</span>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">Logged across all precincts</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest">Resolved Cases</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-4xl font-black text-emerald-400">{data.resolvedCases}</span>
          <p className="text-[11px] text-emerald-500/80 mt-2 font-medium">Closed with sealed evidence</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest">Active In Queue</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-4xl font-black text-amber-400">{data.pendingCases}</span>
          <p className="text-[11px] text-amber-500/80 mt-2 font-medium">Under active investigation</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest">Resolution Rate</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-4xl font-black text-cyan-400">{data.resolutionRate}%</span>
          <p className="text-[11px] text-cyan-500/80 mt-2 font-medium">Above municipal benchmark</p>
        </div>

      </div>

      {/* Breakdown Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Category Breakdown */}
        <div className="bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-300 mb-6 flex items-center justify-between border-b border-slate-800 pb-3">
            <span>Category Distribution</span>
            <span className="text-cyan-400 text-xs font-mono font-bold">{data.categoryDistribution.length} Categories</span>
          </h3>
          <div className="space-y-5">
            {data.categoryDistribution.map((cat: any) => {
              const pct = data.totalCases > 0 ? Math.round((cat.count / data.totalCases) * 100) : 0;
              return (
                <div key={cat._id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span className="uppercase tracking-wider">{cat._id}</span>
                    <span className="text-cyan-400 font-mono">{cat.count} cases ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Priority Breakdown */}
        <div className="bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-300 mb-6 flex items-center justify-between border-b border-slate-800 pb-3">
            <span>AI Threat Priority Triage</span>
            <BrainCircuit className="w-4 h-4 text-purple-400" />
          </h3>
          <div className="space-y-5">
            {data.priorityDistribution.map((pri: any) => {
              const pct = data.totalCases > 0 ? Math.round((pri.count / data.totalCases) * 100) : 0;
              const isHigh = pri._id === "High";
              const isMed = pri._id === "Medium";
              const barGradient = isHigh 
                ? "bg-gradient-to-r from-red-600 to-rose-500" 
                : isMed 
                ? "bg-gradient-to-r from-amber-600 to-yellow-500" 
                : "bg-gradient-to-r from-emerald-600 to-teal-500";
              const textColor = isHigh ? "text-red-400" : isMed ? "text-amber-400" : "text-emerald-400";

              return (
                <div key={pri._id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span className={`uppercase tracking-wider ${textColor}`}>{pri._id || "Low Priority"}</span>
                    <span className="font-mono text-slate-400">{pri.count} cases ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                    <div className={`${barGradient} h-2.5 rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
