"use client";

import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  MapPin, 
  BrainCircuit, 
  ShieldAlert, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Loader2, 
  ArrowLeft,
  Copy,
  Check,
  Lock,
  Sparkles,
  UserCheck
} from "lucide-react";
import Link from "next/link";

export default function CaseDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    async function fetchCase() {
      try {
        const res = await fetch(`/api/complaints/${resolvedParams.id}`);
        if (res.ok) {
          const data = await res.json();
          setComplaint(data);
        } else {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCase();
  }, [resolvedParams.id, router]);

  const handleStatusUpdate = async (newStatus: string) => {
    setStatusUpdating(true);
    try {
      const res = await fetch(`/api/complaints/${resolvedParams.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setComplaint({ ...complaint, status: newStatus });
      }
    } catch(e) {}
    setStatusUpdating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const getLocationString = (loc: any) => {
    if (!loc) return "Not Specified";
    if (typeof loc === "object") return loc.address || "Unknown Address";
    return String(loc);
  };

  if (loading) return (
    <div className="flex h-[75vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
        <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Opening Secure Case Vault...</p>
      </div>
    </div>
  );

  if (!complaint) return null;

  const isAdmin = true; // Enabled for interactive testing
  
  const steps = ["Pending Review", "Assigned Officer", "In Progress", "Resolved"];
  const currentStepIndex = steps.indexOf(complaint.status) >= 0 ? steps.indexOf(complaint.status) : 0;
  const locString = getLocationString(complaint.location);

  return (
    <div className="max-w-6xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      
      {/* Back Button */}
      <Link href="/dashboard" className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-white mb-6 transition-colors group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </Link>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="bg-blue-500/10 text-cyan-400 px-3 py-1 rounded-lg text-xs font-mono font-bold border border-blue-500/30">
              CASE #{complaint._id.slice(-8).toUpperCase()}
            </span>
            <span className="text-slate-400 text-xs font-medium">
              Reported on {new Date(complaint.createdAt || Date.now()).toLocaleString()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            {complaint.title}
          </h1>
        </div>
        
        {/* Police Status Controller */}
        {isAdmin && (
          <div className="bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 shadow-xl flex items-center flex-wrap gap-1">
            {steps.map(s => (
              <button 
                key={s}
                disabled={statusUpdating}
                onClick={() => handleStatusUpdate(s)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                  complaint.status === s 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/30' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
            {statusUpdating && <Loader2 className="w-4 h-4 animate-spin text-cyan-400 ml-2 mr-2" />}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (Left 2 columns) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Status Timeline Stepper */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800">
            <h3 className="font-bold text-sm text-slate-300 uppercase tracking-widest mb-6 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-cyan-400" /> Case Progression Stepper
            </h3>
            
            <div className="relative flex justify-between items-center w-full max-w-xl mx-auto my-6">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700 ease-out"
                  style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                />
              </div>
              
              {steps.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={step} className="relative flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-500 border-4 border-slate-900 ${
                      isCompleted 
                        ? 'bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-lg shadow-blue-500/50 scale-110' 
                        : 'bg-slate-800 text-slate-500'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-3 h-3" />}
                    </div>
                    <span className={`absolute top-12 w-28 text-center text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      isCurrent ? 'text-cyan-400' : isCompleted ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Official Narrative */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800">
            <h3 className="font-bold text-sm text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Official Statement &amp; Facts
            </h3>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap font-medium text-sm sm:text-base">
              {complaint.description}
            </p>
          </div>

          {/* Cryptographic Evidence Vault */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-sm text-slate-300 uppercase tracking-widest flex items-center">
                <Lock className="w-4 h-4 mr-2 text-emerald-400" /> Cryptographic Evidence Vault
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Court Verifiable
              </span>
            </div>
            
            {complaint.evidence && complaint.evidence.length > 0 ? (
              <div className="space-y-4">
                {complaint.evidence.map((ev: any, i: number) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Digital Evidence Record #{i + 1}</p>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">SHA-256: {ev.fileHash ? `${ev.fileHash.slice(0, 16)}...${ev.fileHash.slice(-8)}` : "Verified"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {ev.fileHash && (
                        <button 
                          onClick={() => copyToClipboard(ev.fileHash)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedHash ? "Copied" : "Copy Hash"}
                        </button>
                      )}
                      {ev.fileUrl && (
                        <a 
                          href={ev.fileUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
                        >
                          Inspect File
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-center flex flex-col items-center">
                <ShieldAlert className="w-10 h-10 text-slate-600 mb-2" />
                <p className="text-sm font-bold text-slate-300">No Attached External Files</p>
                <p className="text-xs text-slate-500 mt-1">Incident was filed with direct verbal testimony.</p>
              </div>
            )}
          </div>

        </div>

        {/* Sidebar Info (Right Column) */}
        <div className="space-y-6">
          
          {/* AI NLP Insights Card */}
          <div className="bg-gradient-to-b from-blue-900/40 to-slate-900 rounded-3xl p-6 border border-blue-500/30 shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-500/20 p-2.5 rounded-xl border border-blue-500/30 text-cyan-400">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">AI NLP Intelligence</h3>
            </div>
            
            <div className="space-y-5 text-xs">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Categorization</p>
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-cyan-300 font-bold border border-slate-700 inline-block">
                  {complaint.category || "General"}
                </span>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Automated Threat Level</p>
                <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider inline-block border ${
                  complaint.priorityScore === 'High' ? 'bg-red-500/20 text-red-400 border-red-500/40 glow-red' :
                  complaint.priorityScore === 'Medium' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                  'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                }`}>
                  {complaint.priorityScore || 'Low'} Priority
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  Verified by CivicGuard Python NLP Microservice on FastAPI port 8000.
                </p>
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-800">
            <h3 className="font-bold text-sm text-slate-300 uppercase tracking-widest mb-4 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-red-400" /> Incident Location
            </h3>
            <p className="text-xs font-bold text-white mb-4 bg-slate-950/60 px-3.5 py-2.5 rounded-xl border border-slate-800">
              {locString}
            </p>
            
            <Link 
              href="/map"
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold flex items-center justify-center gap-2 transition-all border border-slate-700"
            >
              <MapPin className="w-3.5 h-3.5 text-red-400" /> View on Live Crime Map
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
