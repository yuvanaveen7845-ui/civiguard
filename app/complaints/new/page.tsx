"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  UploadCloud, 
  MapPin, 
  Subtitles, 
  FileText, 
  Shield, 
  Loader2, 
  Info, 
  Mic, 
  MicOff, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  ArrowRight
} from "lucide-react";

export default function NewComplaint() {
  const router = useRouter();
  const { data: session } = useSession();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Theft");
  const [location, setLocation] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Live AI Prediction state
  const [predictedCategory, setPredictedCategory] = useState<string | null>(null);
  const [predictedPriority, setPredictedPriority] = useState<string | null>(null);
  const [analyzingAi, setAnalyzingAi] = useState(false);

  // Real-time AI preview when description changes
  useEffect(() => {
    if (!description || description.trim().length < 8) {
      setPredictedCategory(null);
      setPredictedPriority(null);
      return;
    }

    const timer = setTimeout(async () => {
      setAnalyzingAi(true);
      try {
        const res = await fetch("http://localhost:8000/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description }),
          signal: AbortSignal.timeout(2000)
        });
        if (res.ok) {
          const data = await res.json();
          setPredictedCategory(data.category);
          setPredictedPriority(data.priority);
          if (data.category && data.category !== "Other") {
            setCategory(data.category);
          }
        }
      } catch (e) {
        // Local quick heuristics
        const lower = description.toLowerCase();
        if (lower.includes("gun") || lower.includes("knife") || lower.includes("kill") || lower.includes("blood")) {
          setPredictedPriority("High");
        } else if (lower.includes("stolen") || lower.includes("rob") || lower.includes("hit")) {
          setPredictedPriority("Medium");
        } else {
          setPredictedPriority("Low");
        }
      } finally {
        setAnalyzingAi(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [description, title]);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      let finalTranscript = event.results[0][0].transcript;
      setDescription(prev => prev + (prev ? " " : "") + finalTranscript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let evidenceHash = null;
      let evidenceUrl = null;
      let fileType = null;

      if (files.length > 0) {
        const formData = new FormData();
        formData.append("file", files[0]);
        
        try {
          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (uploadRes.ok) {
            const uploadedData = await uploadRes.json();
            evidenceHash = uploadedData.fileHash;
            evidenceUrl = uploadedData.url;
            fileType = uploadedData.fileType;
          }
        } catch (uploadErr) {
          console.warn("Evidence upload note:", uploadErr);
        }
      }

      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          location,
          isAnonymous,
          evidenceUrl,
          fileType,
          fileHash: evidenceHash
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1200);
      } else {
        setError("Failed to register complaint. Please check your inputs.");
      }
    } catch (err) {
      setError("Network connection issue. Please verify backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header Banner */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            AI-Assisted Case Ingress
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Register Incident Report</h1>
        <p className="text-slate-400 text-sm mt-2 font-medium">
          Your report will be processed by our automated NLP engine for threat priority assignment and evidence hashing.
        </p>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800/80 overflow-hidden">
        
        {/* Card Header Bar */}
        <div className="px-8 py-5 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between flex-wrap gap-4">
          <h2 className="font-bold text-white flex items-center text-base">
            <span className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mr-3">
              <FileText className="w-4 h-4" />
            </span>
            Incident Metadata &amp; Evidence
          </h2>
          <div className="flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-emerald-500/20">
            <Lock className="w-3.5 h-3.5 mr-1" /> SHA-256 Verified Ingress
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-xs font-bold border border-red-500/30 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-2xl text-xs font-bold border border-emerald-500/30 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Case registered successfully! Routing to Command Dashboard...</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-black text-slate-300 uppercase tracking-widest mb-2 flex items-center">
              Incident Headline <span className="text-red-400 ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Subtitles className="h-4 w-4 text-slate-500" />
              </div>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="block w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-white placeholder-slate-500 transition-all font-medium"
                placeholder="e.g. Theft of commercial equipment at warehouse"
                required
              />
            </div>
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-slate-300 uppercase tracking-widest mb-2 flex items-center justify-between">
                <span>Category</span>
                {analyzingAi && <span className="text-[10px] text-cyan-400 flex items-center gap-1 font-mono"><Loader2 className="w-3 h-3 animate-spin" /> AI analyzing...</span>}
              </label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                className="block w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm text-white cursor-pointer transition-all font-medium"
              >
                <option value="Theft">Theft & Burglary</option>
                <option value="Assault">Physical Assault & Battery</option>
                <option value="Vandalism">Vandalism & Property Damage</option>
                <option value="Fraud">Fraud & Financial Scam</option>
                <option value="Cybercrime">Cybercrime & Hacking</option>
                <option value="Harassment">Harassment & Stalking</option>
                <option value="Traffic & Road Safety">Traffic & Hit-and-Run</option>
                <option value="Other">Other Unclassified</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-300 uppercase tracking-widest mb-2 flex items-center">
                Incident Location <span className="text-red-400 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-slate-500" />
                </div>
                <input 
                  type="text" 
                  value={location} 
                  onChange={e => setLocation(e.target.value)} 
                  className="block w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm text-white placeholder-slate-500 transition-all font-medium"
                  placeholder="e.g. Times Square & 44th St, New York"
                  required
                />
              </div>
            </div>
          </div>

          {/* Description & Speech Recognition */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-black text-slate-300 uppercase tracking-widest">
                Detailed Narrative <span className="text-red-400 ml-1">*</span>
              </label>
              <button 
                type="button" 
                onClick={toggleListening}
                className={`flex items-center text-xs font-bold px-3 py-1.5 rounded-xl transition-all border ${
                  isListening 
                    ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' 
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {isListening ? (
                  <><Mic className="w-3.5 h-3.5 mr-1.5 text-red-400" /> Listening... (Speak Now)</>
                ) : (
                  <><MicOff className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Speech to Text</>
                )}
              </button>
            </div>
            
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              rows={4}
              className="block w-full p-4 bg-slate-950/60 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm text-white placeholder-slate-500 transition-all resize-none font-medium leading-relaxed"
              placeholder="Describe the sequence of events, suspect descriptions, weapon types, and any damages..."
              required
            />

            {/* Live AI Detection Pill */}
            {(predictedPriority || predictedCategory) && (
              <div className="mt-3 p-3.5 rounded-xl bg-blue-950/30 border border-blue-900/40 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-300 font-medium">Real-Time NLP Assessment:</span>
                </div>
                <div className="flex items-center gap-2">
                  {predictedCategory && (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 font-bold border border-slate-700 font-mono text-[11px]">
                      {predictedCategory}
                    </span>
                  )}
                  {predictedPriority && (
                    <span className={`px-2.5 py-1 rounded-lg font-bold border text-[11px] uppercase tracking-wider ${
                      predictedPriority === 'High' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                      predictedPriority === 'Medium' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                      'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    }`}>
                      {predictedPriority} Priority
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Evidence Upload */}
          <div className="border-t border-slate-800 pt-6">
            <label className="block text-xs font-black text-slate-300 uppercase tracking-widest mb-3">
              Tamper-Proof Digital Evidence
            </label>
            <div className="w-full border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-2xl p-8 transition-all cursor-pointer group flex flex-col items-center justify-center relative bg-slate-950/30 hover:bg-slate-950/60">
              <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="w-14 h-14 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-blue-600/20 transition-all">
                <UploadCloud className="w-7 h-7 text-blue-400" />
              </div>
              <p className="text-sm font-bold text-white mb-1">Click to attach photos, videos, or documents</p>
              <p className="text-xs text-slate-400 text-center max-w-sm font-medium">
                SHA-256 fingerprint generated automatically at upload for legal chain-of-custody.
              </p>
              {files.length > 0 && (
                <div className="mt-4 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Selected: {files[0].name} ({(files[0].size / 1024).toFixed(1)} KB)</span>
                </div>
              )}
            </div>
          </div>

          {/* Anonymous Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-slate-800">
            <div>
              <h4 className="font-bold text-white text-sm">File Anonymously (Whistleblower Protection)</h4>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Your citizen identity will be stripped from police records.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isAnonymous} onChange={() => setIsAnonymous(!isAnonymous)} />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black rounded-xl shadow-xl shadow-blue-600/30 transition-all disabled:opacity-50 text-sm hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing AI NLP &amp; Evidence...</>
              ) : (
                <>Submit Case Record <ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
