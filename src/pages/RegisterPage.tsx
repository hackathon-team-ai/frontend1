import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, UserPlus, Lock, Mail, MapPin } from 'lucide-react';
import { INDIA_STATES_DISTRICTS, getDistricts } from '../data/india-data';

const DEFAULT_STATE = 'Maharashtra';

export const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    phone_number: '',
    role: 'farmer',
    state: DEFAULT_STATE,
    district: getDistricts(DEFAULT_STATE)[0] || '',
    soil_type: 'Black',
    farm_size_acres: 2.5,
    preferred_language: 'en',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleStateChange = (state: string) => {
    const districts = getDistricts(state);
    setForm(f => ({ ...f, state, district: districts[0] || '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectCls = 'w-full glass-input rounded-xl p-2.5 bg-darkbg-900 text-white cursor-pointer';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-agri-950/30 via-darkbg-900 to-darkbg-900">
      <GlassCard className="max-w-lg w-full !p-8 space-y-6 border-agri-500/30">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-agri-600 to-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-agri-500/30">
            <Sprout className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Create Farmer Account</h1>
          <p className="text-xs text-slate-400">Join KrishiMitra AI — AI advisory &amp; crop diagnosis</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/30 text-xs text-red-300 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {/* Full Name */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
            <input
              type="text"
              value={form.full_name}
              onChange={e => setForm({ ...form, full_name: e.target.value })}
              placeholder="Ramesh Kumar"
              className="w-full glass-input rounded-xl p-2.5"
              required
            />
          </div>

          {/* Email + Password */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="ramesh@example.com"
                className="w-full glass-input rounded-xl p-2.5"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password *</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full glass-input rounded-xl p-2.5"
                required
              />
            </div>
          </div>

          {/* Phone + Language */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Phone (optional)</label>
              <input
                type="tel"
                value={form.phone_number}
                onChange={e => setForm({ ...form, phone_number: e.target.value })}
                placeholder="9876543210"
                className="w-full glass-input rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Preferred Language</label>
              <select value={form.preferred_language} onChange={e => setForm({ ...form, preferred_language: e.target.value })} className={selectCls}>
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
                <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="or">ଓଡ଼ିଆ (Odia)</option>
              </select>
            </div>
          </div>

          {/* State dropdown */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-agri-400" /> State / UT *
            </label>
            <select
              value={form.state}
              onChange={e => handleStateChange(e.target.value)}
              className={selectCls}
              required
            >
              {INDIA_STATES_DISTRICTS.map(s => (
                <option key={s.state} value={s.state}>{s.state}</option>
              ))}
            </select>
          </div>

          {/* District dropdown — updates when state changes */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-agri-400" /> District *
            </label>
            <select
              value={form.district}
              onChange={e => setForm({ ...form, district: e.target.value })}
              className={selectCls}
              required
            >
              {getDistricts(form.state).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Soil + Farm size */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Soil Type</label>
              <select value={form.soil_type} onChange={e => setForm({ ...form, soil_type: e.target.value })} className={selectCls}>
                <option value="Black">Black Cotton Soil</option>
                <option value="Alluvial">Alluvial Soil</option>
                <option value="Red">Red Soil</option>
                <option value="Sandy">Sandy Loam</option>
                <option value="Clay">Clay Soil</option>
                <option value="Loamy">Loamy Soil</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Farm Size (Acres)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={form.farm_size_acres}
                onChange={e => setForm({ ...form, farm_size_acres: parseFloat(e.target.value) })}
                className="w-full glass-input rounded-xl p-2.5"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-agri-500 to-emerald-500 hover:from-agri-400 hover:to-emerald-400 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-agri-500/20 flex items-center justify-center space-x-2 transition-all mt-4"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-white/10 text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-agri-400 font-bold hover:underline">Sign In</Link>
        </div>
      </GlassCard>
    </div>
  );
};
