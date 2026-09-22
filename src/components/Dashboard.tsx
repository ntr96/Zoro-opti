import { useState } from "react";
import { Cpu, LogOut, Gauge as GaugeIcon, Zap, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SystemAnalysis } from "@/components/SystemAnalysis";
import { OptimizationPanel } from "@/components/OptimizationPanel";
import { AIAssistant } from "@/components/AIAssistant";

type Tab = "analysis" | "optimization" | "assistant";

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("analysis");

  const tabs: { id: Tab; label: string; icon: typeof Cpu }[] = [
    { id: "analysis", label: "Analyse", icon: GaugeIcon },
    { id: "optimization", label: "Optimisation", icon: Zap },
    { id: "assistant", label: "Assistant IA", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top bar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">PC Optimizer</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400 hidden sm:block">{user?.email}</span>
            <button
              onClick={signOut}
              className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="flex gap-1 bg-slate-900/60 border border-slate-800 rounded-xl p-1 w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id
                  ? "bg-cyan-500 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {tab === "analysis" && <SystemAnalysis />}
        {tab === "optimization" && <OptimizationPanel />}
        {tab === "assistant" && (
          <div className="max-w-2xl mx-auto">
            <AIAssistant />
          </div>
        )}
      </main>
    </div>
  );
}
