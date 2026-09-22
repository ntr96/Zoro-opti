import { useState } from "react";
import { CreditCard, CheckCircle, Loader, Lock, Zap, Sparkles, Gauge } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export function PaywallPage() {
  const { refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) throw new Error("Non connecté");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            priceId: "price_premium_one_time",
            mode: "payment",
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erreur de paiement");

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Gauge, text: "Analyse système illimitée" },
    { icon: Zap, text: "Optimisation 1-clic illimitée" },
    { icon: Sparkles, text: "Assistant IA (ChatGPT + Claude)" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-4 shadow-lg shadow-cyan-500/25">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Passez à Premium</h2>
          <p className="text-slate-400 mt-2 text-sm">Débloquez toutes les fonctionnalités</p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-white">
              9,99€
              <span className="text-lg text-slate-500 font-normal"> / paiement unique</span>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center shrink-0">
                  <f.icon className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-slate-300 text-sm">{f.text}</span>
                <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400 mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium py-3 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Payer avec Stripe
              </>
            )}
          </button>

          <p className="text-xs text-slate-500 mt-4 text-center flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            Paiement sécurisé par Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
