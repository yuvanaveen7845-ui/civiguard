"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { 
  PlusCircle, 
  FileText, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Loader2, 
  ArrowRight, 
  Activity, 
  Zap, 
  ShieldAlert, 
  UserCheck, 
  Search,
  Filter,
  Sparkles
} from "lucide-react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [cases, setCases] = useState<any[]>([]);
  const [officers, setOfficers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const getLocationString = (loc: any) => {
    if (!loc) return "Not Specified";
    if (typeof loc === "object") return loc.address || "Unknown Address";
    return String(loc);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/cases");
        if (res.ok) setCases(await res.json());

        // Fetch police officers for assignment
        const offRes = await fetch("/api/officers");
        if (offRes.ok) setOfficers(await offRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [session]);

  const handleAssign = async (caseId: string, officerId: string) => {
    try {
      await fetch(`/api/complaints/${caseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedOfficerId: officerId, status: "Assigned Officer" })
      });
      // Optimistic update
      setCases(cases.map(c => c._id === caseId ? { ...c, assignedOfficerId: officerId, status: "Assigned Officer" } : c));
    } catch(e){}
  };

  // Smart Incident Detection (Hotspots)
  const hotspots = useMemo(() => {
    const locCounts: Record<string, number> = {};
    cases.forEach(c => {
      const locStr = getLocationString(c.location);
      if (c.status !== "Resolved" && locStr && locStr !== "Not Specified") {
        locCounts[locStr] = (locCounts[locStr] || 0) + 1;
      }
    });
    return Object.keys(locCounts).filter(loc => locCounts[loc] >= 2);
  }, [cases]);

  if (loading) return (
    <div className="flex h-full items-center justify-center p-12 min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs font-mono text-slate-400">Synchronizing Command Records...</p>
      </div>
    </div>
  );

  const totalCases = cases.length;
  const activeCases = cases.filter(c => c.status !== "Resolved").length;
  const highPriorityCases = cases.filter(c => c.priorityScore === "High" && c.status !== "Resolved").length;
  const resolvedCases = cases.filter(c => c.status === "Resolved").length;

  const filteredCases = cases.filter(c => {
    const matchesStatus = filterStatus === "All" || c.status === filterStatus;
    const locStr = getLocationString(c.location).toLowerCase();
    const titleStr = (c.title || "").toLowerCase();
    const catStr = (c.category || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query || titleStr.includes(query) || locStr.includes(query) || catStr.includes(query);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-12">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/10 text-cyan-400 border border-blue-500/20">
              Live Operations Dashboard
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Civic Command Center
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 font-medium">
            Real-time incident monitoring, NLP triage results, and officer dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            href="/map"
            className="flex items-center px-4 py-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700 font-bold text-xs transition-all shadow-md"
          >
            <MapPin className="w-4 h-4 mr-2 text-red-400" />
            Tactical Map
          </Link>
          <Link 
            href="/complaints/new" 
            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl shadow-lg shadow-blue-600/30 transition-all font-bold text-xs hover:scale-105"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> File New Incident
          </Link>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Reports</p>
              <h3 className="text-3xl font-black text-white mt-1">{totalCases}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <span className="text-blue-400 font-bold">100%</span> cataloged with SHA-256
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Cases</p>
              <h3 className="text-3xl font-black text-amber-400 mt-1">{activeCases}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <span className="text-amber-400 font-bold">{activeCases}</span> in investigation pipeline
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md relative overflow-hidden group hover:border-red-500/30 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">High Priority Alerts</p>
              <h3 className="text-3xl font-black text-red-400 mt-1">{highPriorityCases}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="mt-3 text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <span className="text-red-400 font-bold">AI Priority 1</span> auto-escalated
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resolved Cases</p>
              <h3 className="text-3xl font-black text-emerald-400 mt-1">{resolvedCases}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <span className="text-emerald-400 font-bold">
              {totalCases > 0 ? Math.round((resolvedCases / totalCases) * 100) : 0}%
            </span> resolution rate
          </div>
        </div>

      </div>

      {/* Hotspot Alert Banner (if any) */}
      {hotspots.length > 0 && (
        <div className="p-5 rounded-2xl bg-red-950/30 border border-red-900/50 shadow-xl flex items-start gap-4">
          <div className="p-2 rounded-xl bg-red-500/20 text-red-400 flex-shrink-0 mt-0.5">
            <Zap className="w-5 h-5 animate-bounce" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-red-300 flex items-center gap-2">
              Automated Hotspot Anomaly Detected
            </h4>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Multiple unresolved complaints logged at matching GPS coordinates. Immediate tactical unit reassignment suggested.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {hotspots.map(h => (
                <span key={h} className="inline-flex items-center px-2.5 py-1 rounded-lg bg-red-900/40 text-red-300 border border-red-800/60 text-xs font-mono font-bold">
                  <MapPin className="w-3 h-3 mr-1 text-red-400" /> {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Incident Database Table Card */}
      <div className="rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 overflow-hidden shadow-2xl">
        
        {/* Table Filter & Search Controls */}
        <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-slate-950/40">
          
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by case title, category, or location..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {["All", "Pending Review", "Assigned Officer", "In Progress", "Resolved"].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  filterStatus === status 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" 
                    : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Incidents Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-6 py-4">Incident &amp; Category</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Threat Level</th>
                <th className="px-6 py-4">Assigned Officer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredCases.map(c => {
                const locStr = getLocationString(c.location);
                const isHotspot = hotspots.includes(locStr);
                const isHigh = c.priorityScore === "High";
                const isMed = c.priorityScore === "Medium";

                return (
                  <tr key={c._id} className="hover:bg-slate-800/40 transition-colors group">
                    
                    {/* Title & Category */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/cases/${c._id}`} className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">
                          {c.title}
                        </Link>
                        {isHotspot && (
                          <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30 flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5" /> Hotspot
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono font-bold uppercase">
                          {c.category || "General"}
                        </span>
                        {c.isAnonymous && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            &bull; Anonymous
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        <span className="truncate max-w-[200px]">{locStr}</span>
                      </div>
                    </td>

                    {/* Threat Priority */}
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                        isHigh ? 'bg-red-500/20 text-red-400 border-red-500/40 glow-red' :
                        isMed ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                        'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      }`}>
                        {c.priorityScore || 'Low'}
                      </span>
                    </td>

                    {/* Assigned Officer */}
                    <td className="px-6 py-4">
                      {c.assignedOfficerId ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[11px] font-bold">
                          <UserCheck className="w-3 h-3 mr-1" />
                          {officers.find(o => o._id === c.assignedOfficerId)?.name || "Officer Assigned"}
                        </span>
                      ) : (
                        <select 
                          className="bg-slate-950 border border-slate-800 rounded-lg text-xs px-2 py-1 outline-none font-medium cursor-pointer text-slate-300 focus:border-blue-500"
                          onChange={(e) => handleAssign(c._id, e.target.value)}
                          defaultValue=""
                        >
                          <option value="" disabled>Dispatch Unit...</option>
                          {officers.map(off => (
                            <option key={off._id} value={off._id}>{off.name}</option>
                          ))}
                        </select>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                        c.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                        c.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                        c.status === 'Assigned Officer' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {c.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/cases/${c._id}`} 
                        className="inline-flex items-center px-3 py-1.5 bg-slate-800/80 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-slate-700 hover:border-blue-500 transition-all shadow-sm"
                      >
                        Inspect <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Link>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredCases.length === 0 && (
            <div className="p-16 text-center text-slate-500 flex flex-col items-center">
              <FileText className="w-12 h-12 text-slate-700 mb-3" />
              <p className="font-bold text-white text-base">No cases match the active filter</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting the filter tabs or search query.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
