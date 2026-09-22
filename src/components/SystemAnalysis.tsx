import { useEffect, useState, useCallback } from "react";
import { Cpu, MemoryStick, HardDrive, Thermometer, Wifi, Battery, Activity } from "lucide-react";
import type { SystemMetrics } from "@/types";

function Gauge({
  label,
  value,
  icon: Icon,
  color,
  unit = "%",
}: {
  label: string;
  value: number;
  icon: typeof Cpu;
  color: string;
  unit?: string;
}) {
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-sm text-slate-300 font-medium">{label}</span>
        </div>
      </div>
      <div className="relative flex items-center justify-center">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-slate-800"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={color}
            style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-bold text-white">{Math.round(value)}</span>
          <span className="text-xs text-slate-500">{unit}</span>
        </div>
      </div>
    </div>
  );
}

export function SystemAnalysis() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 35,
    ram: 58,
    disk: 72,
    temperature: 45,
    network: 40,
    battery: 85,
  });
  const [scanning, setScanning] = useState(false);

  const generateMetrics = useCallback(() => {
    setMetrics({
      cpu: 20 + Math.random() * 60,
      ram: 30 + Math.random() * 50,
      disk: 50 + Math.random() * 40,
      temperature: 35 + Math.random() * 30,
      network: 10 + Math.random() * 80,
      battery: 50 + Math.random() * 50,
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(generateMetrics, 3000);
    return () => clearInterval(interval);
  }, [generateMetrics]);

  const runScan = () => {
    setScanning(true);
    setTimeout(() => {
      generateMetrics();
      setScanning(false);
    }, 1500);
  };

  const gauges = [
    { label: "CPU", value: metrics.cpu, icon: Cpu, color: "text-cyan-400" },
    { label: "RAM", value: metrics.ram, icon: MemoryStick, color: "text-blue-400" },
    { label: "Disque", value: metrics.disk, icon: HardDrive, color: "text-teal-400" },
    { label: "Température", value: metrics.temperature, icon: Thermometer, color: "text-orange-400", unit: "°C" },
    { label: "Réseau", value: metrics.network, icon: Wifi, color: "text-green-400" },
    { label: "Batterie", value: metrics.battery, icon: Battery, color: "text-yellow-400" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Analyse système
          </h2>
          <p className="text-slate-400 text-sm mt-1">Surveillance en temps réel des composants</p>
        </div>
        <button
          onClick={runScan}
          disabled={scanning}
          className="bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {scanning ? (
            <>
              <span className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
              Analyse...
            </>
          ) : (
            "Actualiser"
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {gauges.map((g, i) => (
          <Gauge key={i} {...g} />
        ))}
      </div>
    </div>
  );
}
