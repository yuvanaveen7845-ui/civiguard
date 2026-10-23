"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Citizen");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (res.ok) {
        setSuccess("Account created successfully!");
        setTimeout(() => router.push("/login"), 1200);
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      setError("Network connection issue. Proceeding with local profile.");
      setTimeout(() => router.push("/login"), 1200);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-800 p-8 sm:p-10">
        
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-blue-500/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Create Civic Profile</h1>
          <p className="text-xs text-slate-400 mt-1 text-center font-medium">
            Register to securely submit complaints, upload evidence, and track investigations.
          </p>
        </div>

        {error && (
          <div className="mb-5 bg-red-500/10 text-red-400 p-3.5 rounded-xl flex items-center text-xs font-bold border border-red-500/30">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-5 bg-emerald-500/10 text-emerald-400 p-3.5 rounded-xl flex items-center text-xs font-bold border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4 mr-2 flex-shrink-0" />
            <p>{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-300 uppercase tracking-widest mb-1.5">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                placeholder="Jane Doe"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-300 uppercase tracking-widest mb-1.5">Role Type</label>
              <select 
                value={role} 
                onChange={e => setRole(e.target.value)} 
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer font-medium"
              >
                <option value="Citizen">Citizen (Standard)</option>
                <option value="Police Officer">Police Officer</option>
                <option value="Admin">Admin Overseer</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-black text-slate-300 uppercase tracking-widest mb-1.5">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
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
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 mt-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Complete Registration"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already registered?{" "}
          <Link href="/login" className="font-bold text-cyan-400 hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
