import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Cpu, Lock, Mail, Zap, Shield, Gauge, Sparkles, ArrowRight, CheckCircle } from "lucide-react";

export function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fn = mode === "signup" ? signUp : signIn;
    const { error } = await fn(email, password);
    if (error) {
      setError(error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-4 shadow-lg shadow-cyan-500/25">
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">PC Optimizer</h1>
          <p className="text-slate-400 mt-2">Optimisez votre PC en un clic</p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-8 shadow-xl">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === "signup"
                  ? "bg-cyan-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Inscription
            </button>
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === "signin"
                  ? "bg-cyan-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Connexion
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="vous@exemple.com"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium py-2.5 rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === "signup" ? "Créer un compte" : "Se connecter"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {mode === "signup" && (
            <p className="text-xs text-slate-500 mt-4 text-center">
              Un code d'activation sera envoyé à votre email après inscription
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  const features = [
    { icon: Gauge, title: "Analyse en temps réel", desc: "CPU, RAM, disque, température et réseau surveillés en continu" },
    { icon: Zap, title: "Optimisation 1-clic", desc: "Nettoyage RAM, optimisation BIOS et suppression des fichiers inutiles" },
    { icon: Sparkles, title: "Assistant IA", desc: "ChatGPT et Claude intégrés pour des conseils personnalisés" },
    { icon: Shield, title: "Sécurité garantie", desc: "Vos données protégées par chiffrement et authentification sécurisée" },
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
          <button
            onClick={onGetStarted}
            className="bg-slate-800 hover:bg-slate-700 px-5 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Connexion
          </button>
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
              Commencer gratuitement
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

      {/* Pricing teaser */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-32 text-center">
        <div className="bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-800 rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-4">Passez au Premium</h2>
          <p className="text-slate-400 mb-8">Débloquez l'optimisation illimitée et l'assistant IA</p>
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
            Découvrir l'offre
          </button>
        </div>
      </div>

      <footer className="relative z-10 border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        © 2026 PC Optimizer. Tous droits réservés.
      </footer>
    </div>
  );
}
