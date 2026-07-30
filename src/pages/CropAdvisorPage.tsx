import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';
import { RecommendedCrop } from '../types';
import { useAuth } from '../context/AuthContext';
import { Sprout, Calculator, CheckCircle, MapPin } from 'lucide-react';

const MAHARASHTRA_DISTRICTS = [
  'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara',
  'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli',
  'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban',
  'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar',
  'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara',
  'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal',
];

export const CropAdvisorPage: React.FC = () => {
  const { user } = useAuth();

  const [form, setForm] = useState({
    state: 'Maharashtra',
    district: '',
    season: 'Kharif',
    soil_type: 'Black',
    water_availability: 'Medium',
    farm_size_acres: 2.5,
    budget: 50000,
  });

  // Pre-fill district from the logged-in user's profile
  useEffect(() => {
    if (user?.district) {
      setForm(prev => ({ ...prev, district: user.district! }));
    }
    if (user?.state) {
      setForm(prev => ({ ...prev, state: user.state! }));
    }
  }, [user]);

  const [results, setResults] = useState<RecommendedCrop[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.district) {
      setError('Please select your district.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/crop/recommend', form);
      setResults(res.data.top_crops);
    } catch (err) {
      console.error('Crop recommendation error', err);
      setError('Could not fetch recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const demandColor = (demand: string) => {
    if (demand === 'Very High') return 'green';
    if (demand === 'High') return 'blue';
    return 'default';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
          <Sprout className="w-8 h-8 text-agri-400" />
          Smart Crop Recommendation & Yield Predictor
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Enter your farm parameters to get the top 5 suitable crops ranked by agronomic fit and estimated profit.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Form ── */}
        <GlassCard className="lg:col-span-4 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-agri-400" />
            Farm Parameters
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">

            {/* State — read-only, always Maharashtra */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">State</label>
              <input
                type="text"
                value={form.state}
                readOnly
                className="w-full glass-input rounded-xl p-2.5 opacity-60 cursor-not-allowed"
              />
            </div>

            {/* District — dropdown */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-agri-400" /> District
              </label>
              <select
                value={form.district}
                onChange={e => setForm({ ...form, district: e.target.value })}
                required
                className="w-full glass-input rounded-xl p-2.5 bg-darkbg-900 text-white cursor-pointer"
              >
                <option value="" disabled>— Select District —</option>
                {MAHARASHTRA_DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Season */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Season</label>
              <select
                value={form.season}
                onChange={e => setForm({ ...form, season: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 bg-darkbg-900 text-white"
              >
                <option value="Kharif">Kharif (Monsoon · Jun–Oct)</option>
                <option value="Rabi">Rabi (Winter · Nov–Mar)</option>
                <option value="Zaid">Zaid (Summer · Mar–Jun)</option>
              </select>
            </div>

            {/* Soil Type */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Soil Type</label>
              <select
                value={form.soil_type}
                onChange={e => setForm({ ...form, soil_type: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 bg-darkbg-900 text-white"
              >
                <option value="Black">Black Cotton Soil</option>
                <option value="Alluvial">Alluvial Soil</option>
                <option value="Red">Red Soil</option>
                <option value="Sandy">Sandy Loam</option>
                <option value="Clay">Clay Soil</option>
                <option value="Loamy">Loamy Soil</option>
              </select>
            </div>

            {/* Water Availability */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Water Availability</label>
              <select
                value={form.water_availability}
                onChange={e => setForm({ ...form, water_availability: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 bg-darkbg-900 text-white"
              >
                <option value="High">High (Canal / Borewell)</option>
                <option value="Medium">Medium (Drip / Sprinkler)</option>
                <option value="Rainfed / Low">Rainfed / Low</option>
              </select>
            </div>

            {/* Farm Size */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Farm Size (Acres)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={form.farm_size_acres}
                onChange={e => setForm({ ...form, farm_size_acres: parseFloat(e.target.value) })}
                className="w-full glass-input rounded-xl p-2.5"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Total Budget (₹)</label>
              <input
                type="number"
                step="1000"
                min="5000"
                value={form.budget}
                onChange={e => setForm({ ...form, budget: parseFloat(e.target.value) })}
                className="w-full glass-input rounded-xl p-2.5"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-agri-500 to-emerald-500 hover:from-agri-400 hover:to-emerald-400 disabled:opacity-50 text-white font-bold shadow-lg shadow-agri-500/20 transition-all"
            >
              {loading ? 'Calculating best crops…' : '🌱 Get Top 5 Crop Recommendations'}
            </button>
          </form>
        </GlassCard>

        {/* ── Results ── */}
        <div className="lg:col-span-8 space-y-4">
          {results ? (
            results.map(crop => (
              <GlassCard key={crop.rank} className="space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-agri-500/20 border border-agri-500/30 flex items-center justify-center font-extrabold text-agri-300 text-lg shrink-0">
                      #{crop.rank}
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white leading-tight">{crop.crop_name}</h3>
                      <p className="text-xs text-slate-400">{crop.category} &bull; {crop.duration_days} day cycle</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="green" className="text-xs">{crop.suitability_score}% Match</Badge>
                    <Badge variant={demandColor(crop.market_demand) as any} className="text-xs">{crop.market_demand} Demand</Badge>
                  </div>
                </div>

                {/* Financials */}
                <div className="grid grid-cols-3 gap-3 bg-darkbg-900/60 p-3.5 rounded-xl border border-white/5 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Cost / Acre</span>
                    <strong className="text-white font-bold">₹{crop.est_cost_per_acre.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Expected Yield</span>
                    <strong className="text-agri-300 font-bold">{crop.expected_yield_per_acre}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Est. Profit / Acre</span>
                    <strong className={`font-extrabold text-sm ${crop.est_profit_per_acre >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      ₹{crop.est_profit_per_acre.toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>

                {/* Water req */}
                <p className="text-xs text-slate-400">
                  💧 Water requirement: <span className="text-white font-semibold">{crop.water_requirement}</span>
                </p>

                {/* Advantages */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Advantages</h4>
                  <div className="flex flex-wrap gap-2">
                    {crop.key_advantages.map((adv, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-agri-950/40 border border-agri-500/20 text-xs text-agri-300 flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3 text-agri-400 shrink-0" />
                        {adv}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            ))
          ) : (
            <GlassCard className="p-12 text-center">
              <Sprout className="w-16 h-16 opacity-30 mb-3 text-agri-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-400">Fill in Farm Parameters</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Select your district, season, soil type and budget on the left, then click
                <strong className="text-agri-400"> Get Top 5 Crop Recommendations</strong>.
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};
