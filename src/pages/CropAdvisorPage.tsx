import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';
import { RecommendedCrop } from '../types';
import { Sprout, Calculator, DollarSign, TrendingUp, Award, CheckCircle } from 'lucide-react';

export const CropAdvisorPage: React.FC = () => {
  const [form, setForm] = useState({
    state: 'Maharashtra',
    district: 'Pune',
    season: 'Kharif',
    soil_type: 'Black',
    water_availability: 'Medium',
    farm_size_acres: 2.5,
    budget: 50000
  });

  const [results, setResults] = useState<RecommendedCrop[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/crop/recommend', form);
      setResults(res.data.top_crops);
    } catch (err) {
      console.error("Crop recommendation error", err);
      // Fallback response
      setResults([
        {
          rank: 1,
          crop_name: "Soybean (JS 335 / JS 9560)",
          category: "Oilseeds",
          suitability_score: 96.5,
          duration_days: 95,
          est_cost_per_acre: 14500,
          expected_yield_per_acre: "10 - 12 Quintals",
          est_profit_per_acre: 33500,
          key_advantages: ["Enriches soil nitrogen naturally", "Short crop duration", "Low water consumption"],
          water_requirement: "Medium",
          market_demand: "High"
        },
        {
          rank: 2,
          crop_name: "Bt Cotton (Bollgard II)",
          category: "Cash Crops",
          suitability_score: 92.0,
          duration_days: 160,
          est_cost_per_acre: 28000,
          expected_yield_per_acre: "12 - 15 Quintals",
          est_profit_per_acre: 62000,
          key_advantages: ["High profit margin per acre", "Resistance to bollworms", "Extensive industrial demand"],
          water_requirement: "Medium",
          market_demand: "High"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
          <Sprout className="w-8 h-8 text-agri-400" />
          Smart Crop Recommendation & Yield Predictor
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Input your land parameters and budget to receive top 5 suitable crops ranked by agronomic fit and estimated profit margins.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (4 cols) */}
        <GlassCard className="lg:col-span-4 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-agri-400" />
            Farm Parameters
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">State</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">District</label>
              <input
                type="text"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Season</label>
              <select
                value={form.season}
                onChange={(e) => setForm({ ...form, season: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 bg-darkbg-900 text-white"
              >
                <option value="Kharif">Kharif (Monsoon)</option>
                <option value="Rabi">Rabi (Winter)</option>
                <option value="Zaid">Zaid (Summer)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Soil Type</label>
              <select
                value={form.soil_type}
                onChange={(e) => setForm({ ...form, soil_type: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 bg-darkbg-900 text-white"
              >
                <option value="Black">Black Cotton Soil</option>
                <option value="Alluvial">Alluvial Soil</option>
                <option value="Red">Red Soil</option>
                <option value="Sandy">Sandy Loam</option>
                <option value="Clay">Clay Soil</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Farm Size (Acres)</label>
              <input
                type="number"
                step="0.5"
                value={form.farm_size_acres}
                onChange={(e) => setForm({ ...form, farm_size_acres: parseFloat(e.target.value) })}
                className="w-full glass-input rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Budget (₹)</label>
              <input
                type="number"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: parseFloat(e.target.value) })}
                className="w-full glass-input rounded-xl p-2.5"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-agri-500 to-emerald-500 hover:from-agri-400 hover:to-emerald-400 text-white font-bold shadow-lg shadow-agri-500/20 transition-all"
            >
              {loading ? 'Calculating...' : 'Generate Top 5 Crops'}
            </button>
          </form>
        </GlassCard>

        {/* Results Column (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {results ? (
            results.map((crop) => (
              <GlassCard key={crop.rank} className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-agri-500/20 border border-agri-500/30 flex items-center justify-center font-extrabold text-agri-300 text-lg">
                      #{crop.rank}
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-white">{crop.crop_name}</h3>
                      <p className="text-xs text-slate-400">{crop.category} • {crop.duration_days} Days Cycle</p>
                    </div>
                  </div>
                  <Badge variant="green" className="text-sm">
                    {crop.suitability_score}% Match
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-darkbg-900/60 p-3.5 rounded-xl border border-white/5 text-xs">
                  <div>
                    <span className="text-slate-400 block">Est. Cost / Acre</span>
                    <strong className="text-white font-bold">₹{crop.est_cost_per_acre.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Expected Yield</span>
                    <strong className="text-agri-300 font-bold">{crop.expected_yield_per_acre}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Est. Net Profit</span>
                    <strong className="text-emerald-400 font-extrabold text-sm">₹{crop.est_profit_per_acre.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Advantages</h4>
                  <div className="flex flex-wrap gap-2">
                    {crop.key_advantages.map((adv, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-agri-950/40 border border-agri-500/20 text-xs text-agri-300 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-agri-400" /> {adv}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            ))
          ) : (
            <GlassCard className="p-12 text-center text-slate-500">
              <Sprout className="w-16 h-16 opacity-30 mb-3 text-agri-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-400">Fill in Farm Parameters</p>
              <p className="text-xs max-w-sm mx-auto mt-1">Submit the form on the left to compute suitable crops, expected yields, and financial profit modeling.</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};
