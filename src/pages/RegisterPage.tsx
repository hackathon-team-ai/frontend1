import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, UserPlus, Lock, Mail, User, MapPin } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    phone_number: '',
    role: 'farmer',
    state: 'Maharashtra',
    district: 'Pune',
    soil_type: 'Black',
    farm_size_acres: 2.5,
    preferred_language: 'en'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-agri-950/30 via-darkbg-900 to-darkbg-900">
      <GlassCard className="max-w-lg w-full !p-8 space-y-6 border-agri-500/30">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-agri-600 to-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-agri-500/30">
            <Sprout className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Create Farmer Account</h1>
          <p className="text-xs text-slate-400">Join KrishiMitra AI to access AI advisory & crop diagnosis</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/30 text-xs text-red-300 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="Ramesh Kumar"
              className="w-full glass-input rounded-xl p-2.5"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="ramesh@example.com"
                className="w-full glass-input rounded-xl p-2.5"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full glass-input rounded-xl p-2.5"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">State</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">District</label>
              <input
                type="text"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Soil Type</label>
              <select
                value={form.soil_type}
                onChange={(e) => setForm({ ...form, soil_type: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 bg-darkbg-900 text-white"
              >
                <option value="Black">Black Soil</option>
                <option value="Alluvial">Alluvial Soil</option>
                <option value="Red">Red Soil</option>
                <option value="Sandy">Sandy Loam</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Farm Size (Acres)</label>
              <input
                type="number"
                step="0.5"
                value={form.farm_size_acres}
                onChange={(e) => setForm({ ...form, farm_size_acres: parseFloat(e.target.value) })}
                className="w-full glass-input rounded-xl p-2.5"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-agri-500 to-emerald-500 hover:from-agri-400 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-agri-500/20 flex items-center justify-center space-x-2 transition-all mt-4"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-white/10 text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-agri-400 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};
