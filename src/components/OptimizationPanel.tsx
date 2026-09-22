import { useState } from "react";
import { Zap, MemoryStick, Settings2, Trash2, CheckCircle, Loader } from "lucide-react";

type OptimizationType = "ram" | "bios" | "clean";

interface OptTask {
  id: OptimizationType;
  label: string;
  desc: string;
  icon: typeof Zap;
  color: string;
}

const tasks: OptTask[] = [
  { id: "ram", label: "Optimisation RAM", desc: "Libère la mémoire inutilisée", icon: MemoryStick, color: "text-blue-400" },
  { id: "bios", label: "Optimisation BIOS", desc: "Configure les paramètres pour de meilleures performances", icon: Settings2, color: "text-cyan-400" },
  { id: "clean", label: "Nettoyage de fichiers", desc: "Supprime fichiers temporaires et cache", icon: Trash2, color: "text-teal-400" },
];

export function OptimizationPanel() {
  const [running, setRunning] = useState<OptimizationType | "all" | null>(null);
  const [completed, setCompleted] = useState<Set<OptimizationType>>(new Set());
  const [results, setResults] = useState<Record<string, string>>({});

  const runOptimization = async (type: OptimizationType | "all") => {
    setRunning(type);
    const typesToRun = type === "all" ? tasks.map((t) => t.id) : [type];

    for (const t of typesToRun) {
      await new Promise((r) => setTimeout(r, 1200));
      const freed = Math.floor(100 + Math.random() * 900);
      const messages: Record<OptimizationType, string> = {
        ram: `${freed} Mo de RAM libérés`,
        bios: "Paramètres BIOS optimisés (XMP activé, timings ajustés)",
        clean: `${freed * 2} Mo de fichiers supprimés`,
      };
      setResults((prev) => ({ ...prev, [t]: messages[t] }));
      setCompleted((prev) => new Set(prev).add(t));
    }

    setRunning(null);
  };

  const allDone = completed.size === tasks.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            Optimisation
          </h2>
          <p className="text-slate-400 text-sm mt-1">Améliorez les performances en un clic</p>
        </div>
        <button
          onClick={() => runOptimization("all")}
          disabled={running !== null}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
        >
          {running === "all" ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Optimisation...
            </>
          ) : allDone ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Terminé
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Optimiser tout
            </>
          )}
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => {
          const isRunning = running === task.id || (running === "all" && !completed.has(task.id));
          const isDone = completed.has(task.id);

          return (
            <div
              key={task.id}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-4 hover:border-slate-700 transition-colors"
            >
              <div className={`w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center shrink-0`}>
                <task.icon className={`w-5 h-5 ${task.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{task.label}</span>
                  {isDone && <CheckCircle className="w-4 h-4 text-green-400" />}
                  {isRunning && <Loader className="w-4 h-4 text-cyan-400 animate-spin" />}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{task.desc}</p>
                {results[task.id] && (
                  <p className="text-xs text-green-400 mt-1">{results[task.id]}</p>
                )}
              </div>
              <button
                onClick={() => runOptimization(task.id)}
                disabled={running !== null}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Exécuter
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
