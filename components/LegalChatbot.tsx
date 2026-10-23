"use client";
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MessageSquare, X, Send, Sparkles, Bot, User, ShieldCheck, CornerDownLeft } from "lucide-react";

export default function LegalChatbot() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: "Hello! I am your CivicGuard Legal & Procedural Assistant. Ask me about evidence rules, anonymous reporting, or case tracking." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "How does anonymous reporting work?",
    "What evidence is admissible in court?",
    "How to track an active case?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMessage = textToSend.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
      }
    } catch(err) {
      setMessages(prev => [...prev, { role: 'bot', text: "I am temporarily offline. Please consult official law enforcement channels." }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 rounded-2xl shadow-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white hover:scale-105 active:scale-95 transition-all z-50 flex items-center justify-center shadow-blue-500/30 border border-white/20"
        title="Open AI Legal Assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse"></span>
          </div>
        )}
      </button>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[90vw] sm:w-96 bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-700/80 flex flex-col overflow-hidden z-50 max-h-[520px] animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-none flex items-center gap-1.5">
                  CivicGuard Assistant
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h3>
                <p className="text-[10px] text-cyan-100 font-mono mt-0.5">AI Legal &amp; Procedural Guidance</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Quick Questions Pills */}
          <div className="p-2.5 bg-slate-950/60 border-b border-slate-800 flex gap-1.5 overflow-x-auto">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-bold whitespace-nowrap transition-colors border border-slate-700"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto max-h-80 min-h-[260px] space-y-3 bg-slate-950/40 text-xs">
            {messages.map((ms, i) => (
              <div key={i} className={`flex ${ms.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                  ms.role === 'user' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-xs shadow-lg font-medium' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-xs shadow-md font-medium'
                }`}>
                  {ms.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl rounded-bl-xs shadow-sm flex space-x-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></div>
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2"
          >
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Ask procedural questions..." 
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs focus:outline-none focus:border-cyan-400 text-white placeholder-slate-500 font-medium"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || loading} 
              className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white hover:from-blue-500 hover:to-cyan-500 disabled:opacity-40 transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
