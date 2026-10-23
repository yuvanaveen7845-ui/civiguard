"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Filter, AlertTriangle, ShieldCheck, MapPin, Zap, ArrowRight } from "lucide-react";
import L from "leaflet";
import Link from "next/link";

export default function CrimeMapClient() {
  const [cases, setCases] = useState<any[]>([]);
  const [filterCategory, setFilterCategory] = useState("All");
  
  useEffect(() => {
    fetch("/api/cases")
      .then(res => res.json())
      .then(data => setCases(data))
      .catch(() => {});
  }, []);

  const getLocationString = (loc: any) => {
    if (!loc) return "Not Specified";
    if (typeof loc === "object") return loc.address || "Unknown Address";
    return String(loc);
  };

  const filteredCases = filterCategory === "All" 
    ? cases 
    : cases.filter(c => c.category === filterCategory);

  const center: [number, number] = [40.7128, -74.0060]; // NY Base Default
  
  const getSimulatedCoords = (id: string, base: [number, number]) => {
     const hash = (id || "case_101").split("").reduce((a,b) => a + b.charCodeAt(0), 0);
     const latOffset = (hash % 100) / 1000 - 0.05;
     const lngOffset = ((hash * 7) % 100) / 1000 - 0.05;
     return [base[0] + latOffset, base[1] + lngOffset] as [number, number];
  };

  return (
    <div className="relative w-full h-full min-h-[600px] rounded-3xl overflow-hidden">
      
      {/* Floating Tactical Filter UI */}
      <div className="absolute top-6 left-6 z-[400] w-72 sm:w-80 bg-slate-900/90 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-slate-700/80">
         <div className="flex items-center justify-between mb-4">
           <h2 className="font-bold text-white flex items-center text-sm">
             <Filter className="w-4 h-4 mr-2 text-cyan-400" /> Tactical Crime Map
           </h2>
           <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-cyan-400 text-[10px] font-mono font-bold">
             {filteredCases.length} Active
           </span>
         </div>
         
         <div className="space-y-4 text-xs">
           <div>
             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Category Filter</label>
             <select 
               value={filterCategory} 
               onChange={e => setFilterCategory(e.target.value)}
               className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none text-white cursor-pointer shadow-sm"
             >
                <option value="All">All Categories</option>
                <option value="Theft">Theft & Burglary</option>
                <option value="Assault">Assault</option>
                <option value="Vandalism">Vandalism</option>
                <option value="Fraud">Fraud</option>
             </select>
           </div>
           
           <div className="pt-3 border-t border-slate-800">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5">Threat Level Legend</p>
              <div className="space-y-2">
                <div className="flex items-center text-slate-300 font-medium">
                  <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] mr-2.5 border border-white/40 animate-pulse"></span>
                  High Threat (Priority 1)
                </div>
                <div className="flex items-center text-slate-300 font-medium">
                  <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)] mr-2.5 border border-white/40"></span>
                  Medium Priority
                </div>
                <div className="flex items-center text-slate-300 font-medium">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 mr-2.5 border border-white/40"></span>
                  Low Priority / Resolved
                </div>
              </div>
           </div>
         </div>
      </div>

      <MapContainer center={center} zoom={12} className="w-full h-full z-0" zoomControl={false}>
         <TileLayer 
           url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" 
           attribution="&copy; OpenStreetMap contributors &copy; CARTO" 
         />
         
         {filteredCases.map(c => {
           const coords = getSimulatedCoords(c._id, center);
           const isHigh = c.priorityScore === 'High';
           const isResolved = c.status === 'Resolved';
           const color = isResolved ? '#10b981' : (isHigh ? '#ef4444' : '#f59e0b');
           const locStr = getLocationString(c.location);
           
           return (
             <CircleMarker 
               key={c._id} 
               center={coords} 
               radius={isHigh && !isResolved ? 12 : 8}
               pathOptions={{ fillColor: color, color: '#ffffff', weight: 2, fillOpacity: 0.9 }}
             >
               <Popup className="custom-popup border-0 p-0 shadow-2xl rounded-2xl overflow-hidden min-w-[240px]">
                  <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                       {isResolved ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className={`w-3.5 h-3.5 ${isHigh ? 'text-red-400' : 'text-amber-400'}`} />}
                       <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-slate-800 px-2 py-0.5 rounded">
                         {c.category}
                       </span>
                    </div>
                    <h3 className="font-bold text-white text-xs leading-snug mb-1">{c.title}</h3>
                    <p className="text-[11px] text-slate-400 mb-3 flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-slate-500" /> {locStr}
                    </p>
                    
                    <Link 
                      href={`/cases/${c._id}`} 
                      className="block w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-center text-[11px] font-bold rounded-xl transition-all shadow-md"
                    >
                      Inspect Case Record
                    </Link>
                  </div>
               </Popup>
             </CircleMarker>
           );
         })}
      </MapContainer>
    </div>
  );
}
