import { Cpu, Zap, Shield, Gauge, Sparkles, ArrowRight, CheckCircle } from "lucide-react";

export function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  const features = [
    { icon: Gauge, title: "Analyse en temps réel", desc: "CPU, RAM, disque, température et réseau surveillés en continu" },
    { icon: Zap, title: "Optimisation 1-clic", desc: "Nettoyage RAM, optimisation BIOS et suppression des fichiers inutiles" },
    { icon: Sparkles, title: "Assistant IA", desc: "ChatGPT et Claude intégrés pour des conseils personnalisés" },
    { icon: Shield, title: "Sécurité garantie", desc: "Vos données protégées par chiffrement et aucune collecte d'informations" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Hero */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-3xl" />

        <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">PC Optimizer</span>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-full px-4 py-1.5 text-sm text-slate-300 mb-8">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Propulsé par l'IA
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Votre PC,
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              au maximum de ses performances
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Analyse, optimise et maintient votre ordinateur en parfaite santé.
            Un seul clic suffit.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium px-8 py-3.5 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25"
            >
              Commencer
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors group"
            >
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-500/10 transition-colors">
                <f.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-32 text-center">
        <div className="bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-800 rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-4">Tout est gratuit</h2>
          <p className="text-slate-400 mb-8">Accédez à toutes les fonctionnalités sans inscription</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              "Analyse illimitée",
              "Optimisation 1-clic illimitée",
              "Assistant IA (ChatGPT + Claude)",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-left">
                <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" />
                <span className="text-slate-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium px-8 py-3.5 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all"
          >
            Lancer l'application
          </button>
        </div>
      </div>

      <footer className="relative z-10 border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        © 2026 PC Optimizer. Tous droits réservés.
      </footer>
    </div>
  );
}
