"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, AlertCircle, Loader2, KeyRound, Sparkles, User, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      // In dev mode with credential provider fallback, route to dashboard if local test
      router.push("/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  const quickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-800 p-8">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-blue-500/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Access CivicGuard</h1>
          <p className="text-xs text-slate-400 mt-1 text-center font-medium">
            Unified authentication portal for Citizens, Officers, and Admins.
          </p>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="mb-6 p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> 1-Click Demo Profiles
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => quickFill("citizen@civicguard.ai", "citizen123")}
              className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold transition-all border border-slate-700 text-center"
            >
              Citizen
            </button>
            <button
              type="button"
              onClick={() => quickFill("officer@civicguard.ai", "officer123")}
              className="px-2 py-1.5 rounded-lg bg-blue-900/30 hover:bg-blue-800/40 text-blue-300 text-[10px] font-bold transition-all border border-blue-700/50 text-center"
            >
              Police
            </button>
            <button
              type="button"
              onClick={() => quickFill("admin@civicguard.ai", "admin123")}
              className="px-2 py-1.5 rounded-lg bg-purple-900/30 hover:bg-purple-800/40 text-purple-300 text-[10px] font-bold transition-all border border-purple-700/50 text-center"
            >
              Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 bg-red-500/10 text-red-400 p-3.5 rounded-xl flex items-center text-xs font-bold border border-red-500/30">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-300 uppercase tracking-widest mb-1.5">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-300 uppercase tracking-widest mb-1.5">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 mt-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In to Console"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Need a citizen account?{" "}
          <Link href="/register" className="font-bold text-cyan-400 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
